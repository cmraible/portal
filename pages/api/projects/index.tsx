import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import prisma from '../../../lib/prisma';
import { authOptions } from '../auth/[...nextauth]';


const Project = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const session = await unstable_getServerSession(req, res, authOptions)
      if (!session) throw Error('Could not get user');
      if (!session.user.is_superuser && !session.user.is_staff) {
        const project = await prisma.project.create({
          data: {
            name: req.body.name,
            description: req.body.description,
            domain: req.body.domain,
            creator: {connect: { id: session.user.id }},
            contacts: {
              create: [
                {contact: { connect: { id: session.user.id }}}
              ]
            }
          },
          include: {
            contacts: true
          }
        })
        return res.status(200).json(project);
      } else {
        const project = await prisma.project.create({
          data: {
            name: req.body.name,
            description: req.body.description,
            domain: req.body.domain,
            creator: {connect: { id: session.user.id }},
            contacts: {
              create:
                req.body.contacts.map((contact) => {
                  return {contact: { connect: { id: contact }}}
                })
            }
          },
          include: {
            contacts: true
          }
        })
        return res.status(200).json(project);
      }
      
    } catch (err: any) {
      console.log(err);
      res
        .status(500)
        .json({ error: { statusCode: 500, message: err.message } });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};

export default Project;
