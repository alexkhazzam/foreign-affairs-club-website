"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Year_1 = __importDefault(require("../../schema/Year"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const SpeakerTrips_1 = __importDefault(require("../../schema/SpeakerTrips"));
const Admin_1 = __importDefault(require("../../schema/Admin"));
const Officer_1 = __importDefault(require("../../schema/Officer"));
const Pings_1 = __importDefault(require("../../schema/Pings"));
const email_1 = __importDefault(require("../../helpers/email"));
const getHomepage = (req, res) => {
    res.render('./admin/home', {});
};
const getMemberPage = async (req, res) => {
    console.log(req.session.client);
    res.render('./admin/members', {
        years: (await Year_1.default.find()).map(year => {
            year._id = year._id.toString();
            return year;
        }),
        yearCreated: req.query.yearCreated === 'yes',
        error: req.query.error === 'yes',
    });
};
const postAdminSession = (req, res) => {
    const body = { ...req.body };
    if (body.hasOwnProperty('email') && req.session.client) {
        if (req.session.client.adminAccess === 'top-level') {
            Admin_1.default.create({ email: body.email })
                .then(async () => {
                await (0, email_1.default)(body.email, 'Email Authorized', 'You have been invited to become an admin of the Foreign Affairs Club website. Register at https://nhsforeignaffairs.herokuapp.com/register with your school email and login at href="https://nhsforeignaffairs.herokuapp.com/login');
                res.redirect('/admin/settings/?emailAdded=yes');
            })
                .catch(e => {
                res.redirect('/admin/settings/?error=yes');
            });
        }
        else {
            res.redirect('/admin/settings/?notAuthorized=yes');
        }
    }
    else {
        try {
            let data = '';
            req.on('data', (chunk) => {
                data += chunk;
            });
            req.on('end', async () => {
                const parsedData = JSON.parse(data);
                if (parsedData.hasOwnProperty('password')) {
                    if (await bcrypt_1.default.compare(parsedData.password.trim(), req.session.client.password)) {
                        res.status(200).send();
                    }
                    else {
                        res.status(500).send();
                    }
                }
            });
        }
        catch (e) {
            res.status(500).send();
        }
    }
};
const postMemberPage = async (req, res) => {
    const parsedData = { ...req.body };
    if (parsedData.hasOwnProperty('officers') &&
        parsedData.hasOwnProperty('members') &&
        parsedData.hasOwnProperty('year')) {
        parsedData.officers = parsedData.officers
            .split(',')
            .map((officer) => officer.trim());
        parsedData.members = parsedData.members
            .split(',')
            .map((member) => member.trim());
        Year_1.default.create(parsedData)
            .then(() => {
            res.redirect('/admin/members/?yearCreated=yes');
        })
            .catch(e => {
            res.redirect('/admin/members/?error=yes');
        });
    }
    else {
        let data = '';
        req.on('data', (chunk) => {
            data += chunk;
        });
        req.on('end', async () => {
            data = JSON.parse(data);
            Year_1.default.deleteOne({ _id: data.id })
                .then(() => {
                res.status(200).send();
            })
                .catch(() => {
                res.status(500).send();
            });
        });
    }
};
const getSpeakersPage = async (req, res) => {
    res.render('./admin/speakers', {
        speakers: (await SpeakerTrips_1.default.find())
            .filter(st => st.type === 'speaker')
            .map(speaker => {
            speaker._id = speaker._id.toString();
            return speaker;
        }),
        speakerCreated: req.query.speakerCreated === 'yes',
        error: req.query.error === 'yes',
    });
};
const postSpeakersPage = (req, res) => {
    const parsedData = { ...req.body };
    console.log(parsedData);
    if (parsedData.hasOwnProperty('name') &&
        parsedData.hasOwnProperty('description') &&
        parsedData.hasOwnProperty('date')) {
        parsedData.type = 'speaker';
        SpeakerTrips_1.default.create(parsedData)
            .then(() => {
            res.redirect('/admin/speakers/?speakerCreated=yes');
        })
            .catch(e => {
            res.redirect('/admin/speakers/?error=yes');
        });
    }
    else {
        let data = '';
        req.on('data', (chunk) => {
            data += chunk;
        });
        req.on('end', async () => {
            data = JSON.parse(data);
            SpeakerTrips_1.default.deleteOne({ _id: data.id })
                .then(() => {
                res.status(200).send();
            })
                .catch(() => {
                res.status(500).send();
            });
        });
    }
};
const getTripsPage = async (req, res) => {
    res.render('admin/trips', {
        trips: (await SpeakerTrips_1.default.find())
            .filter(st => st.type === 'trip')
            .map(trip => {
            trip._id = trip._id.toString();
            return trip;
        }),
        tripCreated: req.query.tripCreated === 'yes',
        error: req.query.error === 'yes',
    });
};
const postTripsPage = async (req, res) => {
    const parsedData = { ...req.body };
    if (parsedData.hasOwnProperty('date') &&
        parsedData.hasOwnProperty('name') &&
        parsedData.hasOwnProperty('description')) {
        parsedData.type = 'trip';
        SpeakerTrips_1.default.create(parsedData)
            .then(() => {
            res.redirect('/admin/trips/?tripCreated=yes');
        })
            .catch(() => {
            res.redirect('/admin/trips/?error=yes');
        });
    }
    else {
        let data = '';
        req.on('data', (chunk) => {
            data += chunk;
        });
        req.on('end', async () => {
            data = JSON.parse(data);
            SpeakerTrips_1.default.deleteOne({ _id: data.id })
                .then(() => {
                res.status(200).send();
            })
                .catch(() => {
                res.status(500).send();
            });
        });
    }
};
const getSettingsPage = async (req, res) => {
    res.render('admin/settings', {
        admins: await Officer_1.default.find(),
        emailAdded: req.query.emailAdded === 'yes',
        notAuthorized: req.query.notAuthorized === 'yes',
        error: req.query.error === 'yes',
        pings: (await Pings_1.default.find())[0].totalPings.toString(),
        username: process.env.NODEMAILER_USER,
        password: process.env.NODEMAILER_PASS,
    });
};
const postSettingsPage = (req, res) => {
    res.render('admin/settings', {});
};
exports.default = {
    getHomepage,
    postMemberPage,
    getMemberPage,
    postAdminSession,
    getSpeakersPage,
    postSpeakersPage,
    getTripsPage,
    postTripsPage,
    getSettingsPage,
    postSettingsPage,
};
