import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import prisma from '../../../lib/prisma';
import { authOptions } from '../auth/[...nextauth]';


const Contact = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const session = await unstable_getServerSession(req, res, authOptions)
      if (!session) throw Error('Could not get user');
      if (!session.user.is_superuser) throw Error('Unauthorized')
      const contact = await prisma.user.create({
        data: {
          name: req.body.name,
          email: req.body.email,
          lifecycle_stage: req.body.lifecycle_stage,
          is_staff: req.body.lifecycle_stage === 'Staff' ? true : false
        }
      })
      return res.status(200).json(contact);
    } catch (err: any) {
      console.log(err);
      res
        .status(500)
        .json({ error: { statusCode: 500, message: err.message } });
    }
  } else if (req.method === 'GET') { 
    try {
      const session = await unstable_getServerSession(req, res, authOptions)
      if (!session) throw Error('Could not get user');
      const contacts = await prisma.user.findMany({
        where: {
          is_staff: false,
          is_superuser: false
        }
      })
      return res.status(200).json(contacts)
    } catch (err: any) {
      console.log(err)
      res.status(500)
        .json({ error: {statusCode: 500, message: err.message } });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};

export default Contact;
