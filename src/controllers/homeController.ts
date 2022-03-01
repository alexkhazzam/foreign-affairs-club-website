import { Request, Response } from 'express';
import SpeakerSchema from '../schema/SpeakerTrips';
import YearSchema from '../schema/Year';

const getHomepage = async (req: Request, res: Response): Promise<void> => {
  if (!req.session.visitor) {
    req.session.visitor = { user: 'unknown' };
    return res.redirect('https://nhsforeignaffairs.herokuapp.com');
  }

  res.render('home', {
    years: await YearSchema.find(),
    speakers: (await SpeakerSchema.find()).reverse(),
  });
};

export default {
  getHomepage,
};
