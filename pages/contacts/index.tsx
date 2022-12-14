import { User } from '@prisma/client';
import { unstable_getServerSession } from 'next-auth';
import { useRouter } from 'next/router';
import ContactList from '../../components/ContactList';
import Layout from '../../components/Layout';
import prisma from '../../lib/prisma';
import { TimerWithProjectAndTask } from '../../types';
import { authOptions } from '../api/auth/[...nextauth]';

export async function getServerSideProps(ctx) {
    // Access the user object
    const session = await unstable_getServerSession(ctx.req, ctx.res, authOptions)
    if (!session || !session.user.is_superuser) {
      return {
        redirect: {
          destination: '/signin',
          permanent: false,
        },
      }
    }
    const users = await prisma.user.findMany({
      where: {
        is_superuser: false,
        is_staff: false
      }
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
    return {props: { contacts: JSON.parse(JSON.stringify(users)), timers: JSON.parse(JSON.stringify(timers)) }}
}


export default function Contacts({ contacts, timers }: { contacts: User[], timers: TimerWithProjectAndTask[]}) {

  const router = useRouter();
  const refreshProps = () => {
    router.replace(router.asPath);
  }

  return (
    <Layout
      timers={timers}
      refresh={refreshProps}
      current="Contacts" 
      meta={{title: "Contacts"}} 
      actions={[
        {label: "Add Contact", href: "/contacts/new", type: 'primary' }
      ]}
      breadcrumbs={[
        {label: "Home", href: "/"},
        {label: "Contacts", href: "/contacts"}
      ]}
    >
      <ContactList contacts={contacts} />
    </Layout>
  );
}
