import Layout from '../components/Layout';
import { authOptions } from './api/auth/[...nextauth]'
import { unstable_getServerSession } from "next-auth/next"
import prisma from '../lib/prisma';
import { Timer } from '@prisma/client';
import { useRouter } from 'next/router';
import { TimerWithProjectAndTask } from '../types';

export default function Home({ timers }: { timers: TimerWithProjectAndTask[] }) {

  const router = useRouter();
  const refreshProps = () => {
    router.replace(router.asPath);
  }
    return (
      <Layout 
        timers={timers}
        refresh={refreshProps}
        current="Home"
        meta={{title: "Home"}} 
        breadcrumbs={[
          {label: "Home", href: "/"},
        ]}
      >
        <div>
          <div className="flex flex-col py-4">
          </div>
        </div>
      </Layout>
    );
}

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
  if (session.user.is_superuser || session.user.is_staff) {
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
    return {props: { timers: JSON.parse(JSON.stringify(timers)) }}
  } else {
    const timers = await prisma.timer.findMany({
      where: {
        user_id: session.user.id
      },
      include: {
        project: true,
        task: true
      }
    })
    return {props: { timers: JSON.parse(JSON.stringify({})) }}

  }
}


