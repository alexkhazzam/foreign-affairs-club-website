"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const email_1 = __importDefault(require("../helpers/email"));
const token_1 = __importDefault(require("../helpers/token"));
const Admin_1 = __importDefault(require("../schema/Admin"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const EmailConfirmationToken_1 = __importDefault(require("../schema/EmailConfirmationToken"));
const Officer_1 = __importDefault(require("../schema/Officer"));
const getLoginPage = (req, res) => {
    res.render('auth/login.ejs');
};
const getRegisterPage = async (req, res) => {
    res.render('auth/register.ejs', {
        tokenSent: req.query.tokenSent === 'yes',
        errorMessage: req.query.errorMessage || '',
        accountCreated: req.query.accountCreated === 'yes',
        invalidToken: req.query.invalidToken === 'yes',
    });
};
const postLoginPage = (req, res) => { };
const postRegisterPage = async (req, res) => {
    const parsedData = { ...req.body };
    try {
        if (parsedData.hasOwnProperty('email') &&
            parsedData.hasOwnProperty('firstName') &&
            parsedData.hasOwnProperty('lastName') &&
            parsedData.hasOwnProperty('pass1') &&
            parsedData.hasOwnProperty('pass2')) {
            if (await Officer_1.default.findOne({ email: parsedData.email })) {
                return res.redirect(`/register/?errorMessage=Email in use.`);
            }
            else if (!(await Admin_1.default.findOne({ email: parsedData.email }))) {
                return res.redirect(`/register/?errorMessage=Email not authorized.`);
            }
            else if (parsedData.email.charAt(0).toUpperCase() !==
                parsedData.firstName.charAt(0).toUpperCase()) {
                return res.redirect(`/register/?errorMessage=Enter your real first name.`);
            }
            else if (parsedData.email
                .split('@')[0]
                .substring(1)
                .slice(0, -1)
                .toUpperCase() !== parsedData.lastName.toUpperCase()) {
                return res.redirect(`/register/?errorMessage=Enter your real last name.`);
            }
            else if (parsedData.pass1 !== parsedData.pass2) {
                return res.redirect(`/register/?errorMessage=Passwords must match.`);
            }
            else if (parsedData.pass1.includes('=') ||
                parsedData.pass1.includes('!') ||
                parsedData.pass1.includes(')') ||
                parsedData.pass1.includes('(') ||
                parsedData.pass1.includes('$') ||
                parsedData.pass1.includes('.') ||
                parsedData.pass1.length < 8) {
                return res.redirect(`/register/?errorMessage=Password must be at least 8 characters and not contain any special symbols.`);
            }
            Object.defineProperty(parsedData, 'password', {
                value: parsedData.pass1,
            });
            req.session.tentativeClient = {
                email: parsedData.email,
                firstName: parsedData.firstName,
                lastName: parsedData.lastName,
                password: await bcrypt_1.default.hash(parsedData.pass1, 10),
                adminAccess: parsedData.email === 'akhazzam1@student.gn.k12.ny.us' ||
                    parsedData.email === 'llane@greatneck.k12.ny.us'
                    ? 'top-level'
                    : 'entry-level',
            };
            const emailToken = (0, token_1.default)(6);
            await EmailConfirmationToken_1.default.create({
                email: parsedData.email,
                token: emailToken,
            });
            await (0, email_1.default)(parsedData.email, 'Email Confirmation', `Token: ${emailToken}`);
            res.redirect('/register/?tokenSent=yes');
        }
        else {
            if (await EmailConfirmationToken_1.default.findOne({
                token: parsedData.token,
                email: req.session.hasOwnProperty('tentativeClient')
                    ? req.session.tentativeClient.email
                    : '',
            })) {
                req.session.client = await Officer_1.default.create(req.session.tentativeClient);
                req.session.tentativeClient = {};
                console.log(req.session.client);
                return res.redirect('/register/?accountCreated=yes');
            }
            else {
                return res.redirect('/register/?invalidToken=yes');
            }
        }
    }
    catch (e) {
        console.log(e);
        res.redirect('/register/?errorMessage=Oops! Something went wrong; try again later.');
    }
    return true;
};
exports.default = {
    getLoginPage,
    getRegisterPage,
    postLoginPage,
    postRegisterPage,
};
