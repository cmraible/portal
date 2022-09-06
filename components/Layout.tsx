
import Sidebar from './Sidebar';
import Head from 'next/head';

import { ReactNode } from 'react';
import { PageAction, PageMeta, Breadcrumb } from '../types';
import { Timer, Task, Project } from '@prisma/client';
import { useSession } from "next-auth/react"
import PageHeader from './PageHeader';
import LoadingDots from './ui/LoadingDots';
import TimerAlert from './TimerAlert';

interface TimerWithTaskAndProject extends Timer {
  task: Task,
  project: Project
}

interface Props {
  children: ReactNode;
  meta: PageMeta;
  current?: string;
  actions?: PageAction[];
  breadcrumbs?: Breadcrumb[];
  timers: TimerWithTaskAndProject[];
  refresh: () => void;
}

export default function Layout({ children, timers, meta: pageMeta, current, actions, breadcrumbs, refresh }: Props) {
  
  const { data: session, status } = useSession();

  const meta = {
    description: '',
    ...pageMeta
  };

  if (session === undefined) {
    return (<LoadingDots />)
  }

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="robots" content="follow, index" />
        <link href="/avatar.jpeg" rel="shortcut icon" />
        <meta content={meta.description} name="description" />
        <meta property="og:site_name" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:title" content={meta.title} />
      </Head>
      <Sidebar session={session} current={current || ''} />
      
      <div className="md:pl-64 flex flex-col">
      {timers && timers.length > 0 && (
        <TimerAlert refresh={refresh} timer={timers[0]} />
      )}
        {/* Begin main content area */}
        <main className="flex-1 text-white">
            <div className="max-w-7xl p-4">
              {/* Replace with your content */}
                <PageHeader title={meta.title} actions={actions} breadcrumbs={breadcrumbs} />
                {children}
              {/* /End replace */}
            </div>
        </main>
        {/* End Main content area */}
      </div>
    </>
  );
}
