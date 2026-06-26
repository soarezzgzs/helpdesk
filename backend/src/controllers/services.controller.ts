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
            amount: z.number().positive({message: "O valor deve ser positivo."})
        })

        const { name, amount } = bodySchema.parse(req.body);

        const serviceWithSameName = await prisma.service.findFirst({
            where: {
                name
            }
        })

        if(serviceWithSameName){
            throw new AppError("Servico ja cadastrado.", 400)
        }

        const service = await prisma.service.create({
            data: {
                name,
                amount,
                active: true
            }
        })

        return res.status(201).json(service)
    }

    async index(req: Request, res: Response){
        const services = await prisma.service.findMany({
            where: {
                active: true
            }
        })

        return res.json(services)
    }

    async update(req: Request, res: Response){
        const paramsSchema = z.object({
            id: z.string().uuid()
        })

        const bodySchema = z.object({
            name: z.string().trim().min(3, {message: "O nome deve ter pelo menos 3 caracteres."}).optional(),
            amount: z.number().positive({message: "O valor deve ser positivo."}).optional(),
        })

        const {id} = paramsSchema.parse(req.params);
        const {name, amount} = bodySchema.parse(req.body);

        const service = await prisma.service.findUnique({
            where: {
                id
            }
        })

        if(!service){
            throw new AppError("Servico nao encontrado.", 404)
        }

        if(name){
            const serviceWithSameName = await prisma.service.findFirst({
                where: {
                    name
                }
            })
            
            if(serviceWithSameName && serviceWithSameName.id !== service.id){
                throw new AppError("Servico ja cadastrado.", 400)
            }
        }

        const updatedService = await prisma.service.update({
            where: {
                id
            },
            data: {
                name,
                amount
            }
        })

        return res.json(updatedService)
    }

    async updateStatus(req: Request, res: Response){
        const paramsSchema = z.object({
            id: z.string().uuid()
        })

        const {id} = paramsSchema.parse(req.params);

        const service = await prisma.service.findUnique({
            where: {
                id
            }
        })

        if(!service){
            throw new AppError("Servico nao encontrado.", 404)
        }

        const updatedService = await prisma.service.update({
            where: {
                id
            },
            data: {
                active: !service.active
            }
        })

        return res.json(updatedService)
    }

}

export {ServicesController}