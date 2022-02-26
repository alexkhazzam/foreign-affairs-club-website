import { Request, Response } from 'express';
import YearSchema from '../../schema/Year';
import bcrypt from 'bcrypt';
import SpeakerTrips from '../../schema/SpeakerTrips';

const getHomepage = (req: Request, res: Response) => {
  res.render('./admin/home', {});
};

const getMemberPage = async (req: Request, res: Response): Promise<void> => {
  console.log(req.session.client);
  res.render('./admin/members', {
    years: (await YearSchema.find()).map(year => {
      year._id = year._id.toString();
      return year;
    }),
    yearCreated: req.query.yearCreated === 'yes',
    error: req.query.error === 'yes',
  });
};

const postAdminSession = (req: Request, res: Response) => {
  try {
    let data: string = '';
    req.on('data', (chunk: Buffer): void => {
      data += chunk;
    });
    req.on('end', async () => {
      const parsedData = JSON.parse(data);
      console.log(parsedData.password);
      console.log(req.session.client.password);
      if (
        await bcrypt.compare(
          parsedData.password.trim(),
          req.session.client.password
        )
      ) {
        res.status(200).send();
      } else {
        res.status(500).send();
      }
    });
  } catch (e) {
    res.status(500).send();
  }
};

const postMemberPage = async (req: Request, res: Response): Promise<void> => {
  const parsedData = { ...req.body };

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
        res.redirect('/admin/members/?yearCreated=yes');
      })
      .catch(e => {
        res.redirect('/admin/members/?error=yes');
      });
  } else {
    let data: string = '';
    req.on('data', (chunk: Buffer): void => {
      data += chunk;
    });
    req.on('end', async () => {
      data = JSON.parse(data);
      YearSchema.deleteOne({ _id: data.id })
        .then(() => {
          res.status(200).send();
        })
        .catch(() => {
          res.status(500).send();
        });
    });
  }
};

const getSpeakersPage = async (req: Request, res: Response): Promise<void> => {
  res.render('./admin/speakers', {
    speakers: (await SpeakerTrips.find())
      .filter(st => st.type === 'speaker')
      .map(speaker => {
        speaker._id = speaker._id.toString();
        return speaker;
      }),
    speakerCreated: req.query.speakerCreated === 'yes',
    error: req.query.error === 'yes',
  });
};

const postSpeakersPage = (req: Request, res: Response) => {
  const parsedData = { ...req.body };
  console.log(parsedData);

  if (
    parsedData.hasOwnProperty('name') &&
    parsedData.hasOwnProperty('description') &&
    parsedData.hasOwnProperty('date')
  ) {
    parsedData.type = 'speaker';
    SpeakerTrips.create(parsedData)
      .then(() => {
        res.redirect('/admin/speakers/?speakerCreated=yes');
      })
      .catch(e => {
        res.redirect('/admin/speakers/?error=yes');
      });
  } else {
    let data: string = '';
    req.on('data', (chunk: Buffer): void => {
      data += chunk;
    });
    req.on('end', async () => {
      data = JSON.parse(data);
      SpeakerTrips.deleteOne({ _id: data.id })
        .then(() => {
          res.status(200).send();
        })
        .catch(() => {
          res.status(500).send();
        });
    });
  }
};

const getTripsPage = async (req: Request, res: Response) => {
  res.render('admin/trips', {
    trips: (await SpeakerTrips.find())
      .filter(st => st.type === 'trip')
      .map(trip => {
        trip._id = trip._id.toString();
        return trip;
      }),
    tripCreated: req.query.tripCreated === 'yes',
    error: req.query.error === 'yes',
  });
};

const postTripsPage = async (req: Request, res: Response) => {
  const parsedData = { ...req.body };

  if (
    parsedData.hasOwnProperty('date') &&
    parsedData.hasOwnProperty('name') &&
    parsedData.hasOwnProperty('description')
  ) {
    parsedData.type = 'trip';
    SpeakerTrips.create(parsedData)
      .then(() => {
        res.redirect('/admin/trips/?tripCreated=yes');
      })
      .catch(() => {
        res.redirect('/admin/trips/?error=yes');
      });
  } else {
    let data: string = '';
    req.on('data', (chunk: Buffer): void => {
      data += chunk;
    });
    req.on('end', async () => {
      data = JSON.parse(data);
      SpeakerTrips.deleteOne({ _id: data.id })
        .then(() => {
          res.status(200).send();
        })
        .catch(() => {
          res.status(500).send();
        });
    });
  }
};

const getMiscPage = (req: Request, res: Response) => {
  res.render('./admin/misc', {});
};

export default {
  getHomepage,
  postMemberPage,
  getMemberPage,
  postAdminSession,
  getSpeakersPage,
  postSpeakersPage,
  getTripsPage,
  postTripsPage,
  getMiscPage,
};
