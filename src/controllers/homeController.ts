import { Request, Response } from 'express';
import PingSchema from '../schema/Pings';
import ResourceSchema from '../schema/Resource';
import SpeakerSchema from '../schema/SpeakerTrips';
import YearSchema from '../schema/Year';

const getHomepage = async (req: Request, res: Response): Promise<void> => {
  if (!req.session.visitor) {
    // req.session.visitor = { user: 'unknown' };
    // const obj = (await PingSchema.find())[0];
    // await PingSchema.updateOne({
    //   id: obj._id.toString,
    //   totalPings: obj.totalPings + 1,
    // });
    // return res.redirect('https://nhsforeignaffairs.herokuapp.com');
  }

  (await ResourceSchema.find()).forEach(r => {
    console.log(r.link);
  });
  res.render('home', {
    years: await YearSchema.find(),
    speakers: (await SpeakerSchema.find()).reverse(),
    resources: await ResourceSchema.find(),
  });
};

export default {
  getHomepage,
};
