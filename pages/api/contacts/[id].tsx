import { stripe } from '../../../lib/stripe/stripe';
import { createOrRetrieveCustomer, upsertCustomerRecord } from '../../../lib/stripe/stripe-admin';
import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]'
import prisma  from '../../../lib/prisma';


const Contact = async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query
  if (req.method === 'PATCH') {
    try {
      const session = await unstable_getServerSession(req, res, authOptions)
      if (!session) throw Error('Could not get user');
      if (!session.user.is_superuser) throw Error('Unauthorized')
      if (!(typeof id === 'string')) throw Error('Could not get contact');
      const contact = await prisma.user.update({
        data: {
          name: req.body.name,
          email: req.body.email,
          lifecycle_stage: req.body.lifecycle_stage
        },
        where: {
            id: id
        }
      })
      return res.status(200).json(contact);
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

export default Contact;
