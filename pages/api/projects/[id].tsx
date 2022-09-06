import { stripe } from '../../../lib/stripe/stripe';
import { createOrRetrieveCustomer, upsertCustomerRecord } from '../../../lib/stripe/stripe-admin';
import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]'
import prisma  from '../../../lib/prisma';


const Project = async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query
  if (req.method === 'PATCH') {
    try {
      const session = await unstable_getServerSession(req, res, authOptions)
      if (!session) throw Error('Could not get user');
      if (!(typeof id === 'string')) throw Error('Could not get project');
      const project = await prisma.project.update({
        data: {
          name: req.body.name,
          description: req.body.description,
          domain: req.body.domain,
        },
        where: {
            "id": id
        }
      })
      return res.status(200).json(project);
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
