import { Request, Response } from 'express';
import SpeakerSchema from '../schema/Speaker';
import YearSchema from '../schema/Year';

const getHomepage = async (req: Request, res: Response): Promise<void> => {
  console.log('base url: ' + req.baseUrl);
  console.log('base url: ' + req.url);

  res.render('home', {
    years: await YearSchema.find(),
    speakers: (await SpeakerSchema.find()).reverse(),
  });
};

export default {
  getHomepage,
};
