import { stripe } from '../../../lib/stripe/stripe';
import { createOrRetrieveCustomer, upsertCustomerRecord } from '../../../lib/stripe/stripe-admin';
import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]'
import prisma  from '../../../lib/prisma';


const Task = async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query
  if (req.method === 'DELETE') {
    try {
        const session = await unstable_getServerSession(req, res, authOptions)
        if (!session) throw Error('Could not get user');
        if (!(typeof id === 'string')) throw Error('Could not get task');
        const deleteTask = await prisma.task.delete({
            where: {
                id: id
            }
        })
        res.status(200).json(deleteTask)
    } catch (err: any) {
        console.log(err);
        res
          .status(500)
          .json({ error: { statusCode: 500, message: err.message } });
    }
  } else if (req.method === 'PATCH') { 
    try {
        const session = await unstable_getServerSession(req, res, authOptions)
        if (!session) throw Error('Could not get user');
        if (!(typeof id === 'string')) throw Error('Could not get task');
        const task = await prisma.task.update({
          data: {
            completed: req.body.completed,
          },
          where: {
              "id": id
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
    res.setHeader('Allow', 'DELETE');
    res.status(405).end('Method Not Allowed');
  }
};

export default Task;
