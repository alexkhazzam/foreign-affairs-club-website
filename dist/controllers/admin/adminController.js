"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Year_1 = __importDefault(require("../../schema/Year"));
const Speaker_1 = __importDefault(require("../../schema/Speaker"));
const getHomepage = (req, res) => {
    res.render('./admin/home', {});
};
const getMemberPage = async (req, res) => {
    res.render('./admin/members', {
        years: (await Year_1.default.find()).map(year => {
            year._id = year._id.toString();
            return year;
        }),
    });
};
const postMemberPage = async (req, res) => {
    let data = '';
    req.on('data', (chunk) => {
        data += chunk;
    });
    req.on('end', () => {
        let parsedData = JSON.parse(data);
        console.log(parsedData);
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
                res.status(200).send();
            })
                .catch(e => {
                console.log(e);
                res.status(500).send();
            });
        }
        else {
            Year_1.default.deleteOne({
                _id: parsedData.id,
            })
                .then(() => {
                res.status(200).send();
            })
                .catch(e => {
                console.log(e);
                res.status(500).send();
            });
        }
    });
};
const getSpeakersPage = async (req, res) => {
    res.render('./admin/speakers', {
        speakers: (await Speaker_1.default.find()).map(year => {
            year._id = year._id.toString();
            return year;
        }),
    });
};
const postSpeakersPage = (req, res) => {
    let data = '';
    req.on('data', (chunk) => {
        data += chunk;
    });
    req.on('end', () => {
        let parsedData = JSON.parse(data);
        console.log(parsedData);
        if (parsedData.hasOwnProperty('name') &&
            parsedData.hasOwnProperty('description') &&
            parsedData.hasOwnProperty('date')) {
            Speaker_1.default.create(parsedData)
                .then(() => {
                res.status(200).send();
            })
                .catch(e => {
                console.log(e);
                res.status(500).send();
            });
        }
        else {
            Speaker_1.default.deleteOne({
                _id: parsedData.id,
            })
                .then(() => {
                res.status(200).send();
            })
                .catch(e => {
                console.log(e);
                res.status(500).send();
            });
        }
    });
};
const getMiscPage = (req, res) => {
    res.render('./admin/misc', {});
};
exports.default = {
    getHomepage,
    postMemberPage,
    getMemberPage,
    getSpeakersPage,
    postSpeakersPage,
    getMiscPage,
};
