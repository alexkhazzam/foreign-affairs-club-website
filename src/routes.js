"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Router = express_1.default.Router();
const homeController_1 = __importDefault(require("./controllers/homeController"));
const memberController_1 = __importDefault(require("./controllers/memberController"));
const adminController_1 = __importDefault(require("./controllers/admin/adminController"));
const auth_1 = __importDefault(require("./controllers/auth"));
const adminMiddleware = (req, res, next) => {
    //   req.session.client ? next() : res.redirect('/');
    next();
};
Router.get('/', homeController_1.default.getHomepage);
Router.get('/members', memberController_1.default.getMemberPage);
Router.get('/admin', adminMiddleware, adminController_1.default.getHomepage);
Router.get('/admin/members', adminMiddleware, adminController_1.default.getMemberPage);
Router.post('/admin/members', adminMiddleware, adminController_1.default.postMemberPage);
Router.get('/admin/speakers', adminMiddleware, adminController_1.default.getSpeakersPage);
Router.post('/admin/speakers', adminMiddleware, adminController_1.default.postSpeakersPage);
Router.get('/admin/misc', adminMiddleware, adminController_1.default.getMiscPage);
Router.get('/register', auth_1.default.getRegisterPage);
Router.post('/register', auth_1.default.postRegisterPage);
Router.get('/login', auth_1.default.getLoginPage);
Router.post('/login', auth_1.default.postLoginPage);
exports.default = Router;