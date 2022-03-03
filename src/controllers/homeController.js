"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SpeakerTrips_1 = __importDefault(require("../schema/SpeakerTrips"));
const Year_1 = __importDefault(require("../schema/Year"));
const getHomepage = async (req, res) => {
    if (!req.session.visitor) {
        // req.session.visitor = { user: 'unknown' };
        // const obj = (await PingSchema.find())[0];
        // await PingSchema.updateOne({
        //   id: obj._id.toString,
        //   totalPings: obj.totalPings + 1,
        // });
        // return res.redirect('https://nhsforeignaffairs.herokuapp.com');
    }
    res.render('home', {
        years: await Year_1.default.find(),
        speakers: (await SpeakerTrips_1.default.find()).reverse()
    });
};
exports.default = {
    getHomepage,
};
