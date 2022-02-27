import express, { Request, Response, NextFunction } from 'express';
const Router = express.Router();

import homeController from './controllers/homeController';
import memberController from './controllers/memberController';
import adminController from './controllers/admin/adminController';
import authController from './controllers/auth';

const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  //   req.session.client ? next() : res.redirect('/');
  next();
};

Router.get('/', homeController.getHomepage);
Router.get('/members', memberController.getMemberPage);

Router.get('/admin', adminMiddleware, adminController.getHomepage);
Router.get('/admin/members', adminMiddleware, adminController.getMemberPage);
Router.post('/admin/members', adminMiddleware, adminController.postMemberPage);
Router.get('/admin/speakers', adminMiddleware, adminController.getSpeakersPage);
Router.post(
  '/admin/speakers',
  adminMiddleware,
  adminController.postSpeakersPage
);
Router.get('/admin/trips', adminMiddleware, adminController.getTripsPage);
Router.post('/admin/trips', adminMiddleware, adminController.postTripsPage);
Router.post(
  '/admin/session',
  adminMiddleware,
  adminController.postAdminSession
);
Router.get('/admin/settings', adminMiddleware, adminController.getSettingsPage);
Router.post(
  '/admin/settings',
  adminMiddleware,
  adminController.postSettingsPage
);

Router.get('/register', authController.getRegisterPage);
Router.post('/register', authController.postRegisterPage);
Router.get('/login', authController.getLoginPage);
Router.post('/login', authController.postLoginPage);

export default Router;
