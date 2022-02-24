import { Request, Response } from 'express';
import YearSchema from '../schema/Year';

const getMemberPage = async (req: Request, res: Response): Promise<void> => {
  res.render('members', {
    years: await YearSchema.find(),
  });
};

export default {
  getMemberPage,
};
