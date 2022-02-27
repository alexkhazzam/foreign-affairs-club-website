import { Request, Response } from 'express';
import email from '../helpers/email';
import token from '../helpers/token';
import AdminSchema from '../schema/Admin';
import bcrypt from 'bcrypt';
import EmailConfirmationTokenSchema from '../schema/EmailConfirmationToken';
import OfficerSchema from '../schema/Officer';

const getLoginPage = (req: Request, res: Response) => {
  res.render('auth/login.ejs', {
    errorMessage: req.query.errorMessage || '',
    invalid: req.query.invalid === 'yes',
  });
};

const getRegisterPage = async (req: Request, res: Response) => {
  res.render('auth/register.ejs', {
    tokenSent: req.query.tokenSent === 'yes',
    errorMessage: req.query.errorMessage || '',
    accountCreated: req.query.accountCreated === 'yes',
    invalidToken: req.query.invalidToken === 'yes',
  });
};

const postLoginPage = async (req: Request, res: Response) => {
  const body = { ...req.body };

  try {
    const officer = await OfficerSchema.findOne({ email: body.email });
    console.log(officer);
    if (
      officer &&
      (await AdminSchema.findOne({ email: body.email })) &&
      (await bcrypt.compare(body.password, officer.password))
    ) {
      req.session.client = officer;
      console.log(req.session.client);
      return res.redirect('/admin');
    } else {
      return res.redirect('/login/?errorMessage=Invalid credentials.');
    }
  } catch (e) {
    console.log(e);
    res.redirect(
      '/login/?errorMessage=Oops! Something went wrong; try again later.'
    );
  }
};

const postRegisterPage = async (req: Request, res: Response) => {
  const parsedData = { ...req.body };

  try {
    if (
      parsedData.hasOwnProperty('email') &&
      parsedData.hasOwnProperty('firstName') &&
      parsedData.hasOwnProperty('lastName') &&
      parsedData.hasOwnProperty('pass1') &&
      parsedData.hasOwnProperty('pass2')
    ) {
      if (await OfficerSchema.findOne({ email: parsedData.email })) {
        return res.redirect(`/register/?errorMessage=Email in use.`);
      } else if (!(await AdminSchema.findOne({ email: parsedData.email }))) {
        return res.redirect(`/register/?errorMessage=Email not authorized.`);
      } else if (
        parsedData.email.charAt(0).toUpperCase() !==
        parsedData.firstName.charAt(0).toUpperCase()
      ) {
        return res.redirect(
          `/register/?errorMessage=Enter your real first name.`
        );
      } else if (
        parsedData.email
          .split('@')[0]
          .substring(1)
          .slice(0, -1)
          .toUpperCase() !== parsedData.lastName.toUpperCase()
      ) {
        return res.redirect(
          `/register/?errorMessage=Enter your real last name.`
        );
      } else if (parsedData.pass1 !== parsedData.pass2) {
        return res.redirect(`/register/?errorMessage=Passwords must match.`);
      } else if (
        parsedData.pass1.includes('=') ||
        parsedData.pass1.includes('!') ||
        parsedData.pass1.includes(')') ||
        parsedData.pass1.includes('(') ||
        parsedData.pass1.includes('$') ||
        parsedData.pass1.includes('.') ||
        parsedData.pass1.length < 8
      ) {
        return res.redirect(
          `/register/?errorMessage=Password must be at least 8 characters and not contain any special symbols.`
        );
      }

      Object.defineProperty(parsedData, 'password', {
        value: parsedData.pass1,
      });
      req.session.tentativeClient = {
        email: parsedData.email,
        firstName: parsedData.firstName,
        lastName: parsedData.lastName,
        password: await bcrypt.hash(parsedData.pass1, 10),
        adminAccess:
          parsedData.email === 'akhazzam1@student.gn.k12.ny.us' ||
          parsedData.email === 'llane@greatneck.k12.ny.us'
            ? 'top-level'
            : 'entry-level',
      };
      const emailToken = token(6);
      await EmailConfirmationTokenSchema.create({
        email: parsedData.email,
        token: emailToken,
      });
      await email(
        parsedData.email,
        'Email Confirmation',
        `Token: ${emailToken}`
      );
      res.redirect('/register/?tokenSent=yes');
    } else {
      if (
        await EmailConfirmationTokenSchema.findOne({
          token: parsedData.token,
          email: req.session.hasOwnProperty('tentativeClient')
            ? req.session.tentativeClient.email
            : '',
        })
      ) {
        await OfficerSchema.create(req.session.tentativeClient);
        req.session.tentativeClient = {};
        return res.redirect('/register/?accountCreated=yes');
      } else {
        return res.redirect('/register/?invalidToken=yes');
      }
    }
  } catch (e) {
    console.log(e);
    res.redirect(
      '/register/?errorMessage=Oops! Something went wrong; try again later.'
    );
  }

  return true;
};

export default {
  getLoginPage,
  getRegisterPage,
  postLoginPage,
  postRegisterPage,
};
