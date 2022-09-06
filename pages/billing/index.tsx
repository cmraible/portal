import { unstable_getServerSession } from 'next-auth';
import Stripe from 'stripe';
import BillingInformation from '../../components/BillingInformation';
import Invoices from '../../components/Invoices';
import Layout from '../../components/Layout';
import { stripe } from '../../lib/stripe/stripe';
import { createOrRetrieveCustomer } from '../../lib/stripe/stripe-admin';
import { authOptions } from '../api/auth/[...nextauth]';
import prisma from '../../lib/prisma';
import { TimerWithProjectAndTask } from '../../types';
import { useRouter } from 'next/router';


export async function getServerSideProps(ctx) {
  // Access the user object
    const session = await unstable_getServerSession(ctx.req, ctx.res, authOptions)
    if (!session) {
      return {
        redirect: {
          destination: '/signin',
          permanent: false,
        },
      }
    }
    const customer = await createOrRetrieveCustomer({
      uuid: session.user.id,
      email: session.user.email
    })
    if (!customer) throw Error('Could not get customer');
    const invoices = await stripe.invoices.list({
      customer: customer
    })
    const timers = await prisma.timer.findMany({
      where: {
        user_id: session.user.id,
        ended: null
      },
      include: {
        project: true,
        task: true
      }
    })
    return {props: {invoices: invoices.data, timers: JSON.parse(JSON.stringify(timers)) }}
};

export default function Billing({ invoices, timers }: { invoices: Stripe.Invoice[], timers: TimerWithProjectAndTask[] }) {
  
  const router = useRouter();
  const refreshProps = () => {
    router.replace(router.asPath);
  }
  const openInvoices = invoices.filter((invoice: Stripe.Invoice) => invoice.status === 'open')
  const paidInvoices = invoices.filter((invoice: Stripe.Invoice) => invoice.status === 'paid')
  

  return (
    <Layout
      timers={timers}
      refresh={refreshProps}
      current="Billing" 
      meta={{title: "Billing"}} 
      breadcrumbs={[
        {label: "Home", href: "/home"},
        {label: "Billing", href: "/billing"},
      ]}
    >
      <div>
        <div className="flex flex-col py-4 gap-4">
          <BillingInformation title="Billing Information" />
          {openInvoices.length > 0 && (
            <Invoices invoices={openInvoices} title="Open Invoices" />
          )}
          {paidInvoices.length > 0 && (
            <Invoices invoices={paidInvoices} title="Paid Invoices" />
          )}
        </div>
      </div>
    </Layout>
  );
}
