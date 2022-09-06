import { Session } from 'next-auth';
import { unstable_getServerSession } from "next-auth/next";
import { useState } from 'react';
import Email from '../components/forms/Email';
import Name from '../components/forms/Name';
import Layout from '../components/Layout';
import { authOptions } from './api/auth/[...nextauth]';
import prisma from '../lib/prisma';
import { useRouter } from 'next/router';
import { TimerWithProjectAndTask } from '../types';


export default function Profile({ sessionData, timers } : { sessionData: Session, timers: TimerWithProjectAndTask[] }) {

  const router = useRouter();
  const refreshProps = () => {
    router.replace(router.asPath);
  }
  
  return (
    <Layout
      timers={timers}
      refresh={refreshProps}
      current="Profile" 
      meta={{title: "Profile"}} 
      breadcrumbs={[
        {label: "Profile", href: "/profile"},
      ]}
    >
      <div className="space-y-8 divide-y divide-gray-200">
        <div className="pt-8 w-full lg:w-1/2 space-y-6">
          <div>
            <h3 className="text-lg leading-6 font-medium text-zinc-200">Contact Information</h3>
          </div>
          <div>
            <Name initialValue={sessionData.user.name} />
          </div>
          <div>
            <Email initialValue={sessionData.user.email} />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const session = await unstable_getServerSession(context.req, context.res, authOptions)
  if (!session) {
    return {
      redirect: {
        destination: '/signin',
        permanent: false,
      },
    }
  }
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
  const data = {
    sessionData: session
  }
  return {props: { sessionData: session, timers: JSON.parse(JSON.stringify(timers))}}
}
