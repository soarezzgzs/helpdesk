import {Request, Response} from "express";
import { prisma } from "../database/prisma";
import { z } from "zod";
import {AppError} from "../utils/AppError";
import {UserRole} from "@prisma/client";
import {hash, compare} from "bcrypt";


class AdminsController {
    async index(req: Request, res: Response){
        const admins = await prisma.user.findMany({
            where: {
                role: "admin"
            }
        })

        if(admins.length === 0) {
            throw new AppError("Nenhum admin cadastrado.", 404)
        }

        const adminsWithoutPassword = admins.map(admin => {
            return {
                id: admin.id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        })

        return res.json(adminsWithoutPassword)
    }

    async create(req: Request, res: Response){
        const bodySchema = z.object({
            name: z.string().trim().min(3, {message: "O nome deve ter pelo menos 3 caracteres."}),
            email: z.string().email({message: "E-mail inválido."}).toLowerCase(),
            password: z.string().min(6, {message: "A senha deve ter pelo menos 6 caracteres."}),
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
                role: UserRole.admin
            },
        })


        res.status(201).json({message: "Admin cadastrado com sucesso."})
    }

    async update(req: Request, res: Response){
        const paramsSchema = z.object({
            id: z.string().uuid()
        })
 
        const bodySchema = z.object({
            name: z.string().trim().min(3, {message: "O nome deve ter pelo menos 3 caracteres."}).optional(),
            email: z.string().email({message: "E-mail inválido."}).toLowerCase().optional(),
            password: z.string().min(6, {message: "A senha deve ter pelo menos 6 caracteres."}).optional()
        })

        const {id} = paramsSchema.parse(req.params);
        const {name, email, password} = bodySchema.parse(req.body);

        const user = await prisma.user.findUnique({
            where: {
                id
            }
        })

        if (!user) {
            throw new AppError("Admin nao encontrado.", 404)
        }

        if(user.role !== UserRole.admin){
            throw new AppError("Usuário não é um admin.", 400)
        }

        if(email){
            const userWithSameEmail = await prisma.user.findFirst({
                where: {
                    email
                }
            })
            
            if (userWithSameEmail && userWithSameEmail.id !== id) {
                throw new AppError("Email ja cadastrado.", 400)
            }
        }

        if (password){
            const samePassword = await compare(password, user.password)

            if(samePassword){
                throw new AppError("A nova senha deve ser diferente da atual.", 400)
            }
        }

        let hashedPassword: string | undefined;

        if (password){
            hashedPassword = await hash(password, 8)
        }

        const updatedAdmin = await prisma.user.update({
            where: {
                id
            },
            data: {
                name,
                email,
                password: hashedPassword
            }
        })

        const {password: _, ...updatedAdminWithoutPassword} = updatedAdmin

        res.status(200).json(updatedAdminWithoutPassword)

    }

    async delete(req: Request, res: Response) {
        const paramsSchema = z.object({
            id: z.string().uuid()
        })

        const {id} = paramsSchema.parse(req.params);

        const admin = await prisma.user.findUnique({
            where: {
                id
            }
        })

        if(!admin){
            throw new AppError("Admin nao encontrado.", 404)
        }

        if (admin.role !== UserRole.admin){
            throw new AppError("Usuário nao é um admin.", 400)
        }

        if (req.user?.id === id){
            throw new AppError("Você não pode excluir sua própria conta.", 400)
        }

        const adminsCount = await prisma.user.count({
            where: {
                role: UserRole.admin
            }
        })

        if(adminsCount <= 1){
            throw new AppError("Não é possível excluir o último admin.", 400)
        }

        await prisma.user.delete({
            where: {
                id
            }
        })

        return res.status(200).json({message: "Admin deletado com sucesso."})
    }
}

export {AdminsController}