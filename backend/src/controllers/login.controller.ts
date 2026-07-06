import {Request, Response} from "express";
import { prisma } from "../database/prisma";
import { z } from "zod";
import { hash } from "bcrypt";
import {UserRole} from "@prisma/client";
import {AppError} from "../utils/AppError";

class LoginController {
    async create(req: Request, res: Response) {
        const bodySchema = z.object({
            name: z.string(),
            email: z.string().trim().email({message: "email inválido."}).toLowerCase(),
            password: z.string().min(6, {message: "A senha deve ter pelo menos 6 caracteres."})
        })

        const { name, email, password } = bodySchema.parse(req.body);

        const userWithSameEmail = await prisma.user.findFirst({
            where: {
                email
            }
        })

        if (userWithSameEmail) {
            throw new AppError("Email ja cadastrado.", 400)
        }

        const hashedPassword = await hash(password, 8);

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: UserRole.client
            }
        })

        const userWithoutPassword = {
            name,
            email,
            role: UserRole.client
        }

        res.status(201).json(userWithoutPassword);
    }

}

export { LoginController }