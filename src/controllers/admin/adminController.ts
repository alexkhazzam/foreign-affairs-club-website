import { Request, Response } from 'express';
import YearSchema from '../../schema/Year';
import bcrypt from 'bcrypt';
import SpeakerTrips from '../../schema/SpeakerTrips';
import AdminSchema from '../../schema/Admin';
import OfficerSchema from '../../schema/Officer';
import PingSchema from '../../schema/Pings';
import email from '../../helpers/email';
import ResourceSchema from '../../schema/Resource';

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
  const body = { ...req.body };
  if (body.hasOwnProperty('email') && req.session.client) {
    if (req.session.client.adminAccess === 'top-level') {
      AdminSchema.create({ email: body.email })
        .then(async () => {
          await email(
            body.email,
            'Email Authorized',
            'You have been invited to become an admin of the Foreign Affairs Club website. Register at https://nhsforeignaffairs.herokuapp.com/register with your school email and login at href="https://nhsforeignaffairs.herokuapp.com/login'
          );
          res.redirect('/admin/settings/?emailAdded=yes');
        })
        .catch(e => {
          res.redirect('/admin/settings/?error=yes');
        });
    } else {
      res.redirect('/admin/settings/?notAuthorized=yes');
    }
  } else {
    try {
      let data: string = '';
      req.on('data', (chunk: Buffer): void => {
        data += chunk;
      });
      req.on('end', async () => {
        const parsedData = JSON.parse(data);
        if (parsedData.hasOwnProperty('password')) {
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
        }
      });
    } catch (e) {
      res.status(500).send();
    }
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

const getSettingsPage = async (req: Request, res: Response) => {
  res.render('admin/settings', {
    admins: await OfficerSchema.find(),
    emailAdded: req.query.emailAdded === 'yes',
    notAuthorized: req.query.notAuthorized === 'yes',
    error: req.query.error === 'yes',
    pings: (await PingSchema.find())[0].totalPings.toString(),
    username: process.env.NODEMAILER_USER,
    password: process.env.NODEMAILER_PASS,
  });
};

const postSettingsPage = (req: Request, res: Response) => {
  res.render('admin/settings', {});
};

const getResourcesPage = async (req: Request, res: Response) => {
  res.render('admin/resources', {
    resources: (await ResourceSchema.find()).map(resource => {
      resource._id = resource._id.toString();
      return resource;
    }),
    error: req.query.error === 'yes',
    resourceCreated: req.query.resourceCreated === 'yes',
  });
};

const postResourcesPage = (req: Request, res: Response) => {
  const body = { ...req.body };

  if (
    body.hasOwnProperty('title') &&
    body.hasOwnProperty('type') &&
    body.hasOwnProperty('link') &&
    body.hasOwnProperty('date')
  ) {
    ResourceSchema.create(body)
      .then(() => {
        res.redirect('/admin/resources/?resourceCreated=yes');
      })
      .catch(() => {
        res.redirect('/admin/resources/?error=yes');
      });
  } else {
    let data: string = '';

    req.on('data', (chunk: Buffer): void => {
      data += chunk;
    });
    req.on('end', async () => {
      data = JSON.parse(data);

      ResourceSchema.deleteOne({ _id: data.id })
        .then(() => {
          res.status(200).send();
        })
        .catch(() => {
          res.status(500).send();
        });
    });
  }
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
  getSettingsPage,
  postSettingsPage,
  getResourcesPage,
  postResourcesPage,
};
