/* eslint-disable class-methods-use-this */
import db from '../db/db';

class MessageController {
    getAllMessages(req:Object, res:Object) {
        return res.status(200).send({
            success: 'true',
            message: 'messages retrieved successfully',
            messages: db,
        });
    }

    getMessage(req:Object, res:Object) {
        const id = parseInt(req.params.id, 10);
        db.map((message) => {
            if (message.id === id) {
                return res.status(200).send({
                    success: 'true',
                    message: 'message retrieved successfully',
                    messages: message,
                });
            }
        });
        return res.status(404).send({
            success: 'false',
            message: 'message does not exist',
        });
    }

    createMessage(req:Object, res:Object) {
        if (!req.body.title) {
            return res.status(400).send({
                success: 'false',
                message: 'title is required',
            });
        } else if (!req.body.description) {
            return res.status(400).send({
                success: 'false',
                message: 'description is required',
            });
        }
        const message = {
            id: db.length + 1,
            title: req.body.title,
            description: req.body.description,
        };
        db.push(message);
        return res.status(201).send({
            success: 'true',
            message: 'message added successfully',
            message,
        });
    }

    updateMessage(req:Object, res:Object) {
        const id = parseInt(req.params.id, 10);
        let messageFound;
        let itemIndex:number;
        db.map((message, index) => {
            if (message.id === id) {
                messageFound = message;
                itemIndex = index;
            }
        });

        if (!messageFound) {
            return res.status(404).send({
                success: 'false',
                message: 'message not found',
            });
        }

        if (!req.body.title) {
            return res.status(400).send({
                success: 'false',
                message: 'title is required',
            });
        } else if (!req.body.description) {
            return res.status(400).send({
                success: 'false',
                message: 'description is required',
            });
        }

        const newMessage = {
            id: messageFound.id,
            title: req.body.title || messageFound.title,
            description: req.body.description || messageFound.description,
        };

        db.splice(itemIndex, 1, newMessage);

        return res.status(201).send({
            success: 'true',
            message: 'message added successfully',
            newMessage,
        });
    }

    deleteMessage(req:Object, res:Object) {
        const id = parseInt(req.params.id, 10);
        let messageFound;
        let itemIndex:number;
        db.map((message, index) => {
            if (message.id === id) {
                messageFound = message;
                itemIndex = index;
            }
        });

        if (!messageFound) {
            return res.status(404).send({
                success: 'false',
                message: 'message not found',
            });
        }
        db.splice(itemIndex, 1);

        return res.status(200).send({
            success: 'true',
            message: 'Message deleted successfuly',
        });
    }
}

const messageController = new MessageController();
export default messageController;