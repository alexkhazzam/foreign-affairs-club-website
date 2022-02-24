"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Year_1 = __importDefault(require("../schema/Year"));
const getMemberPage = async (req, res) => {
    res.render('members', {
        years: await Year_1.default.find(),
    });
};
exports.default = {
    getMemberPage,
};
