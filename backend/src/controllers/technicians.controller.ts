import {Request, Response} from "express";
import { prisma } from "../database/prisma";
import { z } from "zod";
import {AppError} from "../utils/AppError";
import {UserRole} from "@prisma/client";
import {hash, compare} from "bcrypt";

class TechniciansController {
    async index(req: Request, res: Response) {
        const technicians = await prisma.user.findMany({
            where: {
                role: "technician"
            }
        })

        const techniciansWithoutPassword = technicians.map(technician => {
            return {
                id: technician.id,
                name: technician.name,
                email: technician.email,
                role: technician.role
            }
        })

        return res.json(techniciansWithoutPassword)

    }

    async create(req: Request, res: Response){
        const bodySchema = z.object({
            name: z.string().trim().min(3, {message: "O nome deve ter pelo menos 3 caracteres."}),
            email: z.string().email({message: "E-mail inválido."}).toLowerCase(),
            password: z.string().min(6, {message: "A senha deve ter pelo menos 6 caracteres."})
        })

        const {name, email, password} = bodySchema.parse(req.body);

        const userWithSameEmail = await prisma.user.findFirst({
            where: {
                email
            }
        })

        if(userWithSameEmail) {
            throw new AppError("Email ja cadastrado.", 400)
        }

        const hashedPassword = await hash(password, 8);

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: UserRole.technician
            }
        })

        return res.status(201).json({message: "Tecnico cadastrado com sucesso."})

    }

    async update(req: Request, res: Response){
        const paramsSchema = z.object({
            id: z.string().uuid()
        })

        const bodySchema = z.object({
            name: z.string().trim().min(3, {message: "O nome deve ter pelo menos 3 caracteres."}).optional(),
            email: z.string().email({message: "E-mail inválido."}).toLowerCase().optional(),
            avatar: z.string().optional()
        })

        const {id} = paramsSchema.parse(req.params);
        const {name, email, avatar} = bodySchema.parse(req.body);

        const user = await prisma.user.findUnique({
            where: {
                id
            }
        })

        if(!user){
            throw new AppError("Tecnico nao encontrado.", 404)
        }

        if(user.role !== UserRole.technician){
            throw new AppError("Usuário nao é um tecnico.", 400)
        }

        if(email){
            const userWithSameEmail = await prisma.user.findFirst({
                where: {
                    email
                }
            })

            if(userWithSameEmail && userWithSameEmail.id !== id){
                throw new AppError("Email ja cadastrado.", 400)
            }
        }

        const technicianUpdated = await prisma.user.update({
            where: {
                id
            },
            data: {
                name,
                email,
                avatar
            }
        })

        return res.status(200).json(technicianUpdated)
    }

    async updatePassword(req: Request, res: Response) {
        const paramsSchema = z.object({
            id: z.string().uuid()
        })

        const bodySchema = z.object({
            currentPassword: z.string(),
            newPassword: z.string().min(6, {message: "A senha deve ter pelo menos 6 caracteres."})
        })

        const {id} = paramsSchema.parse(req.params);
        const {currentPassword, newPassword} = bodySchema.parse(req.body);

        const technician = await prisma.user.findUnique({
            where: {
                id
            }
        })

        if(!technician){
            throw new AppError("Tecnico nao encontrado.", 404)
        }

        if (technician.role !== UserRole.technician) {
            throw new AppError("Usuário não é um técnico.", 400)
        }

        if(req.user?.role === "technician" && req.user.id !== id){
            throw new AppError("Usuário nao pode alterar a senha de outro tecnico.", 403)
        }

        const passwordMatch = await compare(currentPassword, technician.password);

        if(!passwordMatch){
            throw new AppError("Senha atual incorreta.", 400)
        }

        const samePassword = await compare(newPassword, technician.password)

        if(samePassword){
            throw new AppError("A nova senha deve ser diferente da senha atual.", 400)
        }

        const hashedPassword = await hash(newPassword, 8);

        await prisma.user.update({
            where: {
                id
            },
            data: {
                password: hashedPassword
            }
        })

        return res.status(200).json({message: "Senha atualizada com sucesso."})
    }

    async technicianAvailability(req: Request, res: Response){
        const paramsSchema = z.object({
            id: z.string().uuid()
        })

        const bodySchema = z.object({
            hours: z.array(z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {message: "Formato de hora inválido."}))
        })

        const {id} = paramsSchema.parse(req.params);
        const {hours} = bodySchema.parse(req.body);

        const technician = await prisma.user.findUnique({
            where: {
                id
            }
        })

        if(!technician){
            throw new AppError("Tecnico nao encontrado.", 404)
        }

        if(technician.role !== UserRole.technician){
            throw new AppError("Usuário nao é um tecnico.", 400)
        }

        if (req.user?.role === "technician" && req.user.id !== id){
            throw new AppError("Usuário nao pode alterar a disponibilidade de outro tecnico.", 403)
        }

        await prisma.technicianAvailability.deleteMany({
            where: {
                technicianId: id
            }
        })

        const availabilityData = hours.map(hour => ({
            technicianId: id,
            hour
        }))

        await prisma.technicianAvailability.createMany({
            data: availabilityData
        })

        const availability = await prisma.technicianAvailability.findMany({
            where: {
                technicianId: id
            }
        })

        return res.status(200).json(availability)
    }
}

export {TechniciansController}