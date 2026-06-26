import {Request, Response} from "express";
import { prisma } from "../database/prisma";
import { z } from "zod";
import {AppError} from "../utils/AppError";
import {UserRole } from "@prisma/client";
import {hash, compare} from "bcrypt";

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
                clientId,
                technicianId: technician.id
            }
        })

        await prisma.ticketService.create({
            data: {
                ticketId: ticket.id,
                serviceId
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

        ticketServices: {
            select: {
                service: {
                    select: {
                        id: true,
                        name: true,
                        amount: true
                    }
                }
            }
        }
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

            services: ticketCreated.ticketServices.map(item => item.service),

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

            ticketServices: {
                select: {
                    service: {
                        select: {
                            id: true,
                            name: true,
                            amount: true
                        }
                    }
                }
            }
        }
    })

    const formattedTickets = tickets.map(ticket => ({
        id: ticket.id,
        title: ticket.title,
        description: ticket.description,
        status: ticket.status,

        client: ticket.client,

        technician: ticket.technician,

        services: ticket.ticketServices.map(
            item => item.service
        ),

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

            ticketServices: {
                select: {
                    service: {
                        select: {
                            id: true,
                            name: true,
                            amount: true
                        }
                    }
                }
            }
        }
    })

    const formattedTickets = tickets.map(ticket => ({
        id: ticket.id,
        title: ticket.title,
        description: ticket.description,
        status: ticket.status,

        client: ticket.client,

        technician: ticket.technician,

        services: ticket.ticketServices.map(
            item => item.service
        ),

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

        ticketServices: {
            select: {
                service: {
                    select: {
                        id: true,
                        name: true,
                        amount: true
                    }
                }
            }
        }
    }
})

        const formattedTickets = tickets.map(ticket => ({
        id: ticket.id,
        title: ticket.title,
        description: ticket.description,
        status: ticket.status,

        client: ticket.client,

        technician: ticket.technician,

        services: ticket.ticketServices.map(
            item => item.service
        ),

        createdAt: ticket.createdAt
    }))

        return res.status(200).json(formattedTickets)
        
    }


}

export {TicketsController}