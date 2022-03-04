"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
exports.default = mongoose_1.default.model('resource', new mongoose_1.default.Schema({
    title: {
        type: String,
    },
    type: {
        type: String,
    },
    link: {
        type: String,
    },
    date: {
        type: String,
    },
}));
