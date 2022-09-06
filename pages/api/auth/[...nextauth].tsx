
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import prisma from "../../../lib/prisma";
import { createOrRetrieveCustomer } from "../../../lib/stripe/stripe-admin";
import type { NextAuthOptions } from 'next-auth'
import { DateTime } from 'luxon';


export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }),
      EmailProvider({
        server: process.env.EMAIL_SERVER,
        from: process.env.EMAIL_FROM
      })
    ],
    callbacks: {
      async session({ session, token, user}) {
        session.user.id = user.id
        session.user.stripe_customer_id = (typeof user.stripe_customer_id === 'string') ? user.stripe_customer_id : null;
        session.user.billing_line_1 = (typeof user.billing_line_1 === 'string') ? user.billing_line_1 : null;
        session.user.billing_line_2 = (typeof user.billing_line_2 === 'string') ? user.billing_line_2 : null;
        session.user.country = (typeof user.country === 'string') ? user.country : null;
        session.user.city = (typeof user.city === 'string') ? user.city : null;
        session.user.state = (typeof user.state === 'string') ? user.state : null;
        session.user.postal_code = (typeof user.postal_code === 'string') ? user.postal_code : null;
        session.user.payment_method_id = (typeof user.payment_method_id === 'string') ? user.payment_method_id : null;
        session.user.is_superuser = (typeof user.is_superuser === 'boolean') ? user.is_superuser : false;
        session.user.is_staff = (typeof user.is_staff === 'boolean') ? user.is_staff : false;
        return session
      }
    },
    events: {
      createUser: (user) => {
        const result = createOrRetrieveCustomer({email: user.user.email, uuid: user.user.id})
      }
    }
}

export default NextAuth(authOptions);