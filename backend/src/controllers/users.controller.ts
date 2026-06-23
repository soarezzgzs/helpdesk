import {Request, Response} from "express";
import { prisma } from "../database/prisma";
import { z } from "zod";
import { hash } from "bcrypt";
import {UserRole} from "@prisma/client";

class UsersController {
    async create(req: Request, res: Response) {
        const bodySchema = z.object({
            name: z.string(),
            email: z.string().trim().email({message: "email inválido."}).toLowerCase(),
            password: z.string().min(6, {message: "A senha deve ter pelo menos 6 caracteres."}),
            role: z.enum([UserRole.admin, UserRole.technician, UserRole.client]).default(UserRole.client),
        })

        const { name, email, password, role } = bodySchema.parse(req.body);

        const userWithSameEmail = await prisma.user.findFirst({
            where: {
                email
            }
        })

        if (userWithSameEmail) {
            return res.status(400).json({ message: "Email ja cadastrado." });
        }

        const hashedPassword = await hash(password, 8);

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role
            }
        })

        res.status(201).json()
}

}

export { UsersController }