import {Request, Response} from "express";
import { prisma } from "../database/prisma";
import { z } from "zod";
import {AppError} from "../utils/AppError";
import {UserRole } from "@prisma/client";
import {hash, compare} from "bcrypt";

class ServicesController {
    async create(req: Request, res: Response) {
        const bodySchema = z.object({
            name: z.string().trim().min(3, {message: "O nome deve ter pelo menos 3 caracteres."}),
            description: z.string().trim().min(3, {message: "A descricao deve ter pelo menos 3 caracteres."}),
            amount: z.number().positive({message: "O valor deve ser positivo."}),
            categoryId: z.string().uuid()
        })

        const { name, description, amount, categoryId } = bodySchema.parse(req.body);

        const serviceWithSameName = await prisma.service.findFirst({
            where: {
                name
            }
        })

        const category = await prisma.category.findUnique({
            where: {
                id: categoryId
            }
        })

        if(!category) {
            throw new AppError("Categoria nao encontrada.", 404)
        }

        const service = await prisma.service.create({
            data: {
                name,
                description,
                amount,
                categoryId
            }
        })

        return res.status(201).json(service)
    }
}

export {ServicesController}