"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Speaker_1 = __importDefault(require("../schema/Speaker"));
const Year_1 = __importDefault(require("../schema/Year"));
const getHomepage = async (req, res) => {
    res.render('home', {
        years: await Year_1.default.find(),
        speakers: (await Speaker_1.default.find()).reverse(),
    });
};
exports.default = {
    getHomepage,
};
