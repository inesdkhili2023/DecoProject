import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendResetPasswordMail(to: string, resetLink: string) {
    const mailOptions = {
      from: `"Support App" <${process.env.MAIL_USER}>`,
      to,
      subject: 'Réinitialisation de mot de passe',
      html: `
        <h3>Réinitialisation de mot de passe</h3>
        <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
        <p>Cliquez sur ce lien pour réinitialiser votre mot de passe :</p>
        <a href="${resetLink}">${resetLink}</a>
        <p><i>Ce lien expire dans 15 minutes.</i></p>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
