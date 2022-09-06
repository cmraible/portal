import { stripe } from '../../../lib/stripe/stripe';
import { createOrRetrieveCustomer } from '../../../lib/stripe/stripe-admin';
import { getURL } from '../../../lib/helpers';
import { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from '../auth/[...nextauth]'
import { unstable_getServerSession } from "next-auth/next"

const createPortalLink = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const session = await unstable_getServerSession(req, res, authOptions)
      if (!session) {
        res.status(401).json({ message: "You must be logged in." });
        return;
      }
      if (!session) throw Error('Could not get user');
      const customer = await createOrRetrieveCustomer({
        uuid: session.user.id || '',
        email: session.user.email || ''
      });

      if (!customer) throw Error('Could not get customer');
      const { url } = await stripe.billingPortal.sessions.create({
        customer,
        return_url: `${getURL()}/billing`
      });

      return res.status(200).json({ url });
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

export default createPortalLink;
