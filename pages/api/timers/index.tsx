import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import prisma from '../../../lib/prisma';
import { authOptions } from '../auth/[...nextauth]';


const Timer = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const session = await unstable_getServerSession(req, res, authOptions)
      if (!session) throw Error('Could not get user');
      if (!session.user.is_superuser) throw Error('Unauthorized')
      const task = await prisma.timer.create({
        data: {
          project: { connect: { id: req.body.project_id} },
          task: { connect: { id: req.body.task_id} },
          user: { connect: { id: session.user.id } },
          started: req.body.started,
          ended: req.body.completed || null
        }
      })
      return res.status(200).json(task);
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

export default Timer;
