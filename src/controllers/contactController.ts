import { Request, Response } from 'express';
import filter from 'bad-words';
import email from '../helpers/email';

const postContactPage = (req: Request, res: Response) => {
  try {
    let data: any = '';

    req.on('data', (chunk: Buffer): void => {
      data += chunk;
    });
    req.on('end', async () => {
      data = JSON.parse(data);

      for (const key in data) {
        if (
          new filter({ placeHolder: '#$%' }).clean(data[key]).includes('#$%')
        ) {
          return res.status(200).send('bad-words');
        }
      }

      await email(
        process.env.NODEMAILER_USER!,
        'Someone Sent An Email!',
        `subject: ${data.subject}\n\nmessage: ${data.message}\n\nfrom: ${data.email}`
      );
      res.status(200).send('success');
    });
  } catch (e) {
    res.status(500).send();
  }
};

export default {
  postContactPage,
};
