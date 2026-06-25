import {Request, Response} from "express";
import { prisma } from "../database/prisma";
import { z } from "zod";
import {AppError} from "../utils/AppError";
import {UserRole } from "@prisma/client";
import {hash, compare} from "bcrypt";

class CategoriesController {
    async create(req: Request, res: Response) {
        const bodySchema = z.object({
            name: z.string().trim().min(3, {message: "O nome deve ter pelo menos 3 caracteres."})
        })

        const { name } = bodySchema.parse(req.body);

        const categoryWithSameName = await prisma.category.findFirst({
            where: {
                name
            }
        })

        if (categoryWithSameName) {
            throw new AppError("Categoria ja cadastrada.", 400)
        }

        const category = await prisma.category.create({
            data: {
                name
            }
        })

        return res.status(201).json(category)
    }

    async index(req: Request, res: Response) {
        const categories = await prisma.category.findMany();

        if(categories.length === 0) {
            throw new AppError("Nenhuma categoria cadastrada.", 404)
        }

        return res.json(categories)
    }
}

export {CategoriesController}