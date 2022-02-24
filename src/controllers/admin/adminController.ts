import { Request, Response } from 'express';
import YearSchema from '../../schema/Year';
import SpeakerSchema from '../../schema/Speaker';

const getHomepage = (req: Request, res: Response) => {
  res.render('./admin/home', {});
};

const getMemberPage = async (req: Request, res: Response): Promise<void> => {
  res.render('./admin/members', {
    years: (await YearSchema.find()).map(year => {
      year._id = year._id.toString();
      return year;
    }),
  });
};

const postMemberPage = async (req: Request, res: Response): Promise<void> => {
  let data: string = '';

  req.on('data', (chunk: Buffer): void => {
    data += chunk;
  });

  req.on('end', () => {
    let parsedData = JSON.parse(data);
    console.log(parsedData);
    if (
      parsedData.hasOwnProperty('officers') &&
      parsedData.hasOwnProperty('members') &&
      parsedData.hasOwnProperty('year')
    ) {
      parsedData.officers = parsedData.officers
        .split(',')
        .map((officer: string): string => officer.trim());

      parsedData.members = parsedData.members
        .split(',')
        .map((member: string): string => member.trim());

      YearSchema.create(parsedData)
        .then(() => {
          res.status(200).send();
        })
        .catch(e => {
          console.log(e);
          res.status(500).send();
        });
    } else {
      YearSchema.deleteOne({
        _id: parsedData.id,
      })
        .then(() => {
          res.status(200).send();
        })
        .catch(e => {
          console.log(e);
          res.status(500).send();
        });
    }
  });
};

const getSpeakersPage = async (req: Request, res: Response): Promise<void> => {
  res.render('./admin/speakers', {
    speakers: (await SpeakerSchema.find()).map(year => {
      year._id = year._id.toString();
      return year;
    }),
  });
};

const postSpeakersPage = (req: Request, res: Response) => {
  let data: string = '';

  req.on('data', (chunk: Buffer): void => {
    data += chunk;
  });

  req.on('end', () => {
    let parsedData = JSON.parse(data);

    console.log(parsedData);
    if (
      parsedData.hasOwnProperty('name') &&
      parsedData.hasOwnProperty('description') &&
      parsedData.hasOwnProperty('date')
    ) {
      SpeakerSchema.create(parsedData)
        .then(() => {
          res.status(200).send();
        })
        .catch(e => {
          console.log(e);
          res.status(500).send();
        });
    } else {
      SpeakerSchema.deleteOne({
        _id: parsedData.id,
      })
        .then(() => {
          res.status(200).send();
        })
        .catch(e => {
          console.log(e);
          res.status(500).send();
        });
    }
  });
};

const getMiscPage = (req: Request, res: Response) => {
  res.render('./admin/misc', {});
};

export default {
  getHomepage,
  postMemberPage,
  getMemberPage,
  getSpeakersPage,
  postSpeakersPage,
  getMiscPage,
};
