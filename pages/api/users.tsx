import { stripe } from '../../lib/stripe/stripe';
import { createOrRetrieveCustomer, upsertCustomerRecord } from '../../lib/stripe/stripe-admin';
import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]'


const User = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'PATCH') {
    try {
      const session = await unstable_getServerSession(req, res, authOptions)
      if (!session) throw Error('Could not get user');
      const customer = await createOrRetrieveCustomer({
        uuid: session.user.id,
        email: session.user.email
      });
      if (!customer) throw Error('Could not get customer'); 
      const updatedCustomer = await stripe.customers.update(customer, {
        name: req.body.name,
        address: {
            line1: req.body.line1,
            line2: req.body.line2,
            country: req.body.country,
            city: req.body.city,
            state: req.body.state,
            postal_code: req.body.postal_code
        }
      })
      upsertCustomerRecord(updatedCustomer);
      return res.status(200).json({});
    } catch (err: any) {
      console.log(err);
      res
        .status(500)
        .json({ error: { statusCode: 500, message: err.message } });
    }
  } else {
    res.setHeader('Allow', 'PATCH');
    res.status(405).end('Method Not Allowed');
  }
};

export default User;
