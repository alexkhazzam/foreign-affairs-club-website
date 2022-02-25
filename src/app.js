"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const routes_1 = __importDefault(require("./routes"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../.env') });
const client = mongoose_1.default
    .connect(process.env.MONGO_DB_URI)
    .then(mongoClient => mongoClient.connection.getClient());
const app = (0, express_1.default)();
// app.use(
//   session({
//     secret: process.env.CLIENT_SECRET!,
//     resave: false,
//     saveUninitialized: false,
//   })
// );
// add
app.set('views', 'views');
app.set('view engine', 'ejs');
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(routes_1.default);
exports.default = app;
