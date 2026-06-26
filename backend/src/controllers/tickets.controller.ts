import {Request, Response} from "express";
import { prisma } from "../database/prisma";
import { z } from "zod";
import {AppError} from "../utils/AppError";
import {UserRole, TicketStatus } from "@prisma/client";

class TicketsController {
    async create(req: Request, res: Response){
        const bodySchema = z.object({
            title: z.string().trim().min(3, {message: "O titulo deve ter pelo menos 3 caracteres."}),
            description: z.string().trim().min(3, {message: "A descricao deve ter pelo menos 3 caracteres."}),
            serviceId: z.string().uuid(),
        })

        const {title, description, serviceId} = bodySchema.parse(req.body);

        const clientId = req.user?.id

        if(!clientId){
            throw new AppError("Cliente nao encontrado.", 404)
        }

        const client = await prisma.user.findUnique({
            where: {
                id: clientId
            }
        })

        if(!client){
            throw new AppError("Cliente nao encontrado.", 404)
        }

        if(client.role !== UserRole.client){
            throw new AppError("Usuário nao é um cliente.", 400)
        }

        const service = await prisma.service.findUnique({
            where: {
                id: serviceId
            }
        })

        if(!service){
            throw new AppError("Servico nao encontrado.", 404)
        }

        if(!service.active){
            throw new AppError("Servico inativo.", 400)
        }

        const technician = await prisma.user.findFirst({
            where: {
                role: UserRole.technician
            }
        })

        if(!technician){
            throw new AppError("Nenhum técnico disponível.", 404)
        }

        const ticket = await prisma.ticket.create({
            data: {
                title,
                description,
                serviceId,
                clientId,
                technicianId: technician.id
            }
        })

        const ticketCreated = await prisma.ticket.findUnique({
    where: {
        id: ticket.id
    },
    include: {
        client: {
            select: {
                id: true,
                name: true,
                avatarUrl: true
            }
        },

        technician: {
            select: {
                id: true,
                name: true
            }
        },
        service: true,
        additionalServices: true
    }
})

        if(!ticketCreated){
            throw new AppError("Ticket nao encontrado.", 404)
        }

        return res.status(201).json({
    id: ticketCreated.id,
    title: ticketCreated.title,
    description: ticketCreated.description,
    status: ticketCreated.status,

    client: ticketCreated.client,

    technician: ticketCreated.technician,

    service: ticketCreated.service,

    additionalServices:
        ticketCreated.additionalServices,

    createdAt: ticketCreated.createdAt
})
    }

    async clientTickets(req: Request, res: Response){

    const tickets = await prisma.ticket.findMany({
        where: {
            clientId: req.user?.id
        },

        include: {
            client: {
                select: {
                    id: true,
                    name: true,
                    avatarUrl: true
                }
            },

            technician: {
                select: {
                    id: true,
                    name: true,
                    avatarUrl: true
                }
            },
            service: true,
            additionalServices: true
        }
    })

    const formattedTickets = tickets.map(ticket => ({
        id: ticket.id,
        title: ticket.title,
        description: ticket.description,
        status: ticket.status,

        client: ticket.client,

        technician: ticket.technician,

        service: ticket.service,

        additionalServices: ticket.additionalServices,

        createdAt: ticket.createdAt
    }))

    return res.status(200).json(formattedTickets)
}

    async technicianTickets(req: Request, res: Response){
        
       const tickets = await prisma.ticket.findMany({
        where: {
            technicianId: req.user?.id
        },

        include: {
            client: {
                select: {
                    id: true,
                    name: true,
                    avatarUrl: true
                }
            },

            technician: {
                select: {
                    id: true,
                    name: true,
                    avatarUrl: true
                }
            },
            service: true,
            additionalServices: true,
        }
    })

    const formattedTickets = tickets.map(ticket => ({
        id: ticket.id,
        title: ticket.title,
        description: ticket.description,
        status: ticket.status,

        client: ticket.client,

        technician: ticket.technician,

        service: ticket.service,

        additionalServices: ticket.additionalServices,

        createdAt: ticket.createdAt
    }))

    return res.status(200).json(formattedTickets)
    }

    async allTickets(req: Request, res: Response){
        
        const tickets = await prisma.ticket.findMany({
    include: {
        client: {
            select: {
                id: true,
                name: true,
                avatarUrl: true
            }
        },

        technician: {
            select: {
                id: true,
                name: true,
                avatarUrl: true
            }
        },

        service: true,
        additionalServices: true
    }
})

        const formattedTickets = tickets.map(ticket => ({
        id: ticket.id,
        title: ticket.title,
        description: ticket.description,
        status: ticket.status,

        client: ticket.client,

        technician: ticket.technician,

        service: ticket.service,

        additionalServices: ticket.additionalServices,

        createdAt: ticket.createdAt
    }))

        return res.status(200).json(formattedTickets)
        
    }

    async updateStatus(req: Request, res: Response){
        const paramsSchema = z.object({
            id: z.string().uuid()
        })

        const bodySchema = z.object({
            status: z.nativeEnum(TicketStatus)
        })

        const {id} = paramsSchema.parse(req.params);
        const {status} = bodySchema.parse(req.body);

        const ticket = await prisma.ticket.findUnique({
            where: {
                id
            }
        })

        if(!ticket){
            throw new AppError("Ticket nao encontrado.", 404)
        }

        if(req.user?.role === UserRole.technician && ticket.technicianId !== req.user.id){
            throw new AppError("Usuário nao pode alterar o status de outro tecnico.", 403)
        }

        const updatedTicket = await prisma.ticket.update({
            where: {
                id
            },
            data: {
                status
            }
        })

        return res.json(updatedTicket)
    }

    async addAdditionalService(req: Request, res: Response){
        const paramsSchema = z.object({
            id: z.string().uuid()
        })

        const bodySchema = z.object({
            description: z.string().trim().min(3, {message: "A descricao deve ter pelo menos 3 caracteres."}),
            amount: z.number().positive({message: "O valor deve ser positivo."})
        })

        const {id} = paramsSchema.parse(req.params);
        const {description, amount} = bodySchema.parse(req.body);

        const ticket = await prisma.ticket.findUnique({
            where: {
                id
            }
        })

        if(!ticket){
            throw new AppError("Ticket nao encontrado.", 404)
        }

        if(req.user?.role === UserRole.technician && ticket.technicianId !== req.user.id){
            throw new AppError("Usuário nao pode adicionar um servico ao ticket de outro tecnico.", 403)
        }

        const additionalService = await prisma.additionalService.create({
            data: {
                description,
                amount,
                ticketId: id
            }
        })

        return res.status(201).json(additionalService)
    }

}

export {TicketsController}