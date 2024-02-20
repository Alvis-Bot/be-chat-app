import { Injectable } from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import * as SendGrid from '@sendgrid/mail';
import { MailerService } from '@nestjs-modules/mailer';
interface MailOptions {
    to: string;
    from: string;
    subject: string;
    text?: string;
    html?: string;
    attachments?: any[];
}



@Injectable()
export class MailService {
    constructor(private readonly configService: ConfigService,
                private readonly mailerService: MailerService) {}


    async sendMail({ to, from, subject, text, html, attachments }: MailOptions) {
        // if (this.configService.get('NODE_ENV') === 'dev') {
        //     console.log('Send mail to: ', to);
        //     console.log('Send mail from: ', from);
        //     console.log('Send mail subject: ', subject);
        //     console.log('Send mail content: ',  text || html);
        //     console.log('Send mail attachments: ', attachments);
        //     return;
        // }

        try {
            await this.mailerService.sendMail({
                to: to,
                from: from,
                subject: subject,
                text: text,
                html: html,
                attachments: attachments,
            });
        }catch (e) {
            console.log(e);

        }
    }
}
