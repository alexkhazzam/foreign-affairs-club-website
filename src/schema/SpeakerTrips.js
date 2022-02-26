"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
exports.default = mongoose_1.default.model('speakers-trips', new mongoose_1.default.Schema({
    date: {
        type: String,
    },
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    type: {
        type: String,
    },
}));
