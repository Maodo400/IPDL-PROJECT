import {bind, BindingScope} from '@loopback/core';
import {createTransport, SentMessageInfo} from 'nodemailer';
import {EmailTemplate, User} from '../models';

@bind({scope: BindingScope.TRANSIENT})
export class EmailService {
  /**
   * If using gmail see https://nodemailer.com/usage/using-gmail/
   */

  private static async setupTransporter() {
    return createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: true, // upgrade later with STARTTLS
      auth: {
        user: 'mysteremady@gmail.com',
        pass: 'fgjnmsrosdczwkvg',
      },
    });
  }
  async sendResetPasswordMail(user: User): Promise<SentMessageInfo> {
    const transporter = await EmailService.setupTransporter();
    const emailTemplate = new EmailTemplate({
      to: user.email,
      subject: '[LB4] Reset Password Request',
      text:'Hello',
      html: `
      <div>
          <p>Hi there,</p>
          <p style="color: red;">We received a request to reset the password for your account</p>
          <p>To reset your password click on the link provided below</p>
          <a href="${process.env.APPLICATION_URL}/reset-password-finish.html?resetKey=${user.resetKey}">Reset your password link</a>
          <p>If you didn’t request to reset your password, please ignore this email or reset your password to protect your account.</p>
          <p>Thanks</p>
          <p>LB4 team</p>
      </div>
      `,
    });
    return transporter.sendMail(emailTemplate);
  }
}

// import {bind, BindingScope} from '@loopback/core';
// import {createTransport} from 'nodemailer';
// import {EmailTemplate, NodeMailer, User} from '../models';

// @bind({scope: BindingScope.TRANSIENT})
// export class EmailService {
//   /**
//    * If using gmail see https://nodemailer.com/usage/using-gmail/
//    */
//   private static async setupTransporter() {
//     return createTransport({
//       service: 'gmail',
//       host: process.env.SMTP_SERVER,
//       port: 465,
//       secure: true, // upgrade later with STARTTLS
//       auth: {
//         user: process.env.SMTP_USERNAME,
//         pass: process.env.SMTP_PASSWORD,
//       },

//     });
//   }
//   async sendResetPasswordMail(user: User): Promise<NodeMailer> {
//     const transporter: any = await EmailService.setupTransporter();
//     const emailTemplate = new EmailTemplate({
//       from: 'maodo@darissconsulting.com',
//       to: user.email,
//       subject: '[LB4] Reset Password Request',
//       text: 'Hello word',
//       html: `
//       <div>
//           <p>Hi there,</p>
//           <p style="color: red;">We received a request to reset the password for your account</p>
//           <p>To reset your password click on the link provided below</p>
//           <a href="${process.env.APPLICATION_URL}/reset-password-finish.html?resetKey=${user.resetKey}">Reset your password link</a>
//           <p>If you didn’t request to reset your password, please ignore this email or reset your password to protect your account.</p>
//           <p>Thanks</p>
//           <p>LB4 team</p>
//       </div>
//       `,
//     });
//     return transporter.sendMail(emailTemplate);
//   }
// }
