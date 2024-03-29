import { Request, Response } from "express";
import { getManager } from "typeorm";
import { User } from "../entity/user.entity";
import { updateInfoValidation } from "../validation/user.validation";
import bcryptjs from 'bcryptjs';

export const fetchAllUser = async (req: Request, res: Response ) => { 
    const take = 10;
    let pager = parseInt( req.query.page as string || '1');
    const page = ( 0 < pager) ? pager : 1;
    const repository = getManager().getRepository(User);
    await repository.findAndCount({
        take,
        skip: (page - 1 ) * take,
        relations: ['role']
    }).then((result) => {
        const [data, total] = result;
        return res.status(200).send({
            data : data.map(u => {
                const {password, ...data} = u;
                return data;
            }),
            meta: {
                total,
                page,
                last_page: Math.ceil(total / take)
            }
        })
    }).catch((err) => {
        return res.status(500).send(err);
    });
};

export const createUser = async (req: Request, res: Response ) => {
        const body = req.body;
        const {error} = updateInfoValidation.validate({
            username: body.username,
            email: body.email,
        });
      
        if (error) {
            return res.status(400).send(error.details)
        }
        const repository = getManager().getRepository(User);
        await repository.save({
            email: body.email,
            username: body.username,
            password: await bcryptjs.hash("password123", 10),
            role: {
                id: body.roleId
            }
            }).then((result) => {
                const {password , ...user} = result;
                return res.send(user);
            }).catch((err) => {
                return res.status(500).send(err);
            });
    };


    export const UpdateUser = async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const {email, username, roleId} = req.body;
    
        const {error} = updateInfoValidation.validate({
            username: username,
            email: email
    });
    
    if (error) {
        return res.status(400).send(error.details)
    }
        const repository = getManager().getRepository(User);
        await repository.update( {id: id}, {
            email: email,
            username: username,
            role: {
                id: roleId
            }
        }).then((result) => {
            return res.status(200).send({
                message: 'Info updated',
                result
            });
        }).catch((err) => {
            return res.status(500).send(err);
        });
    };
    
    export const getOneUser = async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const repository = getManager().getRepository(User);
        await repository.findOne({ where :{id : id}, relations: { role: true} }).then((result) => {
            return res.status(200).send({            
                result
            });
        }).catch((err) => {
            return res.status(500).send(err);
        });
    };

    export const DeleteUser = async (req: Request, res: Response ) => { 
        const id = parseInt(req.params.id);
        const repository = getManager().getRepository(User);
        await repository.delete({id : id}).then((result) => {
            return res.status(200).send(result)
        }).catch((err) => {
            return res.status(500).send(err);
        });
    }

