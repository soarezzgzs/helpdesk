import { Request, Response } from "express"
import { authConfig } from "../configs/auth"
import { prisma } from "../database/prisma"
import { sign } from "jsonwebtoken"
import { compare } from "bcrypt"
import { z } from "zod"

class AuthController {
    async login(req: Request, res: Response) {
        const bodySchema = z.object({
            email: z.string().email({message: "E-mail inválido."}),
            password: z.string()
        })

        const { email, password } = bodySchema.parse(req.body);
        
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (!user) {
            return res.status(401).json({ message: "Email ou senha inválidos." });
        }

        const passwordMatch = await compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Email ou senha inválidos." });
        }

        
        const {secret, expiresIn} = authConfig.jwt
        
        if (!secret) {
            throw new Error("JWT secret not found")
        }

        const token = sign({role: user.role}, secret, {
            subject: user.id,
            expiresIn
        })

        const {password: _, ...userWithoutPassword} = user

        return res.json({token, user: userWithoutPassword})
    }
}

export { AuthController }