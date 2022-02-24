import { Request, Response } from 'express';
import SpeakerSchema from '../schema/Speaker';
import YearSchema from '../schema/Year';

const getHomepage = async (req: Request, res: Response): Promise<void> => {
  res.render('home', {
    years: await YearSchema.find(),
    speakers: (await SpeakerSchema.find()).reverse(),
  });
};

export default {
  getHomepage,
};
