"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bad_words_1 = __importDefault(require("bad-words"));
const email_1 = __importDefault(require("../helpers/email"));
const postContactPage = (req, res) => {
    try {
        let data = '';
        req.on('data', (chunk) => {
            data += chunk;
        });
        req.on('end', async () => {
            data = JSON.parse(data);
            for (const key in data) {
                if (new bad_words_1.default({ placeHolder: '#$%' }).clean(data[key]).includes('#$%')) {
                    return res.status(200).send('bad-words');
                }
            }
            await (0, email_1.default)(process.env.NODEMAILER_USER, 'Someone Sent An Email!', `subject: ${data.subject}\n\nmessage: ${data.message}\n\nfrom: ${data.email}`);
            res.status(200).send('success');
        });
    }
    catch (e) {
        res.status(500).send();
    }
};
exports.default = {
    postContactPage,
};
