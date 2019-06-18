import db from "../db/db";
var amqp = require('amqplib/callback_api');
class Interface {
    constructor() {

    }
    getAllMessages(req, res) {

        amqp.connect('amqp://localhost', function(error0 :any, connection: any) {
            if (error0) {
                throw error0;
            }
            connection.createChannel(function(error1, channel) {
                if (error1) {
                    throw error1;
                }

                var queue = 'sqs';

                channel.assertQueue(queue, {
                    durable: true
                });

                console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

                channel.consume(queue, function(msg) {
                    console.log(" [x] Received %s", msg.content.toString());
                    res.status(200).send({
                        success: 'true',
                        message: 'Message Received successfully',
                        data:   msg
                    });
                }, {
                    noAck: true
                });
            });
        });
    }

    getMessage(req:Object, res:Object) {

    }

    createMessage(req:any, res:any) {
        if(!req.body.message) {
            return res.status(400).send({
                success: 'false',
                message: 'Message is required',
                body :req.body
            });
        }

        let msg = req.body.message;
        msg = JSON.parse(req.body.message);

        let response:any;
        amqp.connect('amqp://localhost', function(error0 :any, connection: any) {
            if (error0) {
                throw error0;
            }
            connection.createChannel(function(error1:any, channel:any) {
                if (error1) {
                    throw error1;
                }
                var queue = 'sqs';
                response = channel.sendToQueue(queue, Buffer.from(req.body.message), {
                    contentType: 'application/json',
                    });
            });
            setTimeout(function() {
                res.status(200).send({
                    success: 'true',
                    message: 'Message sent successfully',
                    response: response
                });
                connection.close();
                process.exit(0);
            }, 500);
        });
    }
}
export default Interface;