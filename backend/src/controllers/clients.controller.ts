import {Request, Response} from "express";
import { prisma } from "../database/prisma";
import { z } from "zod";
import { hash, compare } from "bcrypt";
import {UserRole} from "@prisma/client";
import {AppError} from "../utils/AppError";


class ClientsController {
    async index(req: Request, res: Response){
        const clients = await prisma.user.findMany({
            where: {
                role: "client"
            }
        })

        if(clients.length === 0){
            throw new AppError("Nenhum cliente cadastrado.", 404)
        }

        if(req.user?.role !== "admin"){
            throw new AppError("Usuário nao é um admin.", 400)
        }

        const clientsWithoutPassword = clients.map(client => {
            return {
                id: client.id,
                name: client.name,
                email: client.email,
                role: client.role,
                avatarUrl: client.avatarUrl
            }
        })

        return res.status(200).json(clientsWithoutPassword)
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

        const client = await prisma.user.findUnique({
            where: {
                id
            }
        })

        if(!client){
            throw new AppError("Cliente nao encontrado.", 404)
        }

        if(client.role !== UserRole.client){
            throw new AppError("Usuário nao é um cliente.", 400)
        }

        if(email){
            const clientWithSameEmail = await prisma.user.findFirst({
                where: {
                    email
                }
            })

            if(clientWithSameEmail && clientWithSameEmail.id !== id ){
                throw new AppError("Email ja cadastrado.", 400)
            }
        }

        const clientUpdated = await prisma.user.update({
            where: {
                id
            },
            data: {
                name,
                email,
                avatar
            }
        })

        const {password, ...clientWithoutPassword} = clientUpdated

        return res.status(200).json(clientWithoutPassword)


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
    
            const client = await prisma.user.findUnique({
                where: {
                    id
                }
            })
    
            if(!client){
                throw new AppError("Cliente nao encontrado.", 404)
            }
    
            if (client.role !== UserRole.client) {
                throw new AppError("Usuário não é um cliente.", 400)
            }
    
            if(req.user?.role === "client" && req.user.id !== id){
                throw new AppError("Usuário nao pode alterar a senha de outro cliente.", 403)
            }
    
            const passwordMatch = await compare(currentPassword, client.password);
    
            if(!passwordMatch){
                throw new AppError("Senha atual incorreta.", 400)
            }
    
            const samePassword = await compare(newPassword, client.password)
    
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

    async delete(req: Request, res: Response){
        const paramsSchema = z.object({
            id: z.string().uuid()
        })

        const {id} = paramsSchema.parse(req.params);

        const client = await prisma.user.findUnique({
            where: {
                id
            }
        })

        if(!client){
            throw new AppError("Cliente nao encontrado.", 404)
        }

        if(client.role !== "client"){
            throw new AppError("Usuário nao é um cliente.", 400)
        }

        if(req.user?.role !== "admin"){
            throw new AppError("Usuário nao é um admin.", 400)
        }

        await prisma.user.delete({
            where: {
                id
            }
        })

        return res.status(200).json({message: "Cliente excluido com sucesso."})
    }

    async show(
  req: Request,
  res: Response
) {

  const paramsSchema = z.object({
    id: z.string().uuid(),
  });

  const { id } =
    paramsSchema.parse(req.params);

  const client =
    await prisma.user.findUnique({
      where: {
        id,
      },
    });

  if (!client) {
    throw new AppError(
      "Cliente não encontrado.",
      404
    );
  }

  if (
    client.role !== UserRole.client
  ) {
    throw new AppError(
      "Usuário não é um cliente.",
      400
    );
  }

  return res.json({
    id: client.id,
    name: client.name,
    email: client.email,
    avatarUrl: client.avatarUrl,
  });
}

}

export { ClientsController }