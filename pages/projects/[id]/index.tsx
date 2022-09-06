
import { unstable_getServerSession } from 'next-auth';
import { useSession } from 'next-auth/react';
import Card from '../../../components/Card';
import Layout from '../../../components/Layout';
import ProjectTabs from '../../../components/ProjectTabs';
import LoadingDots from '../../../components/ui/LoadingDots';
import prisma from '../../../lib/prisma';
import { DateTime } from '../../../node_modules/luxon/build/cjs-browser/luxon';
import { Project } from '@prisma/client';
import { authOptions } from '../../api/auth/[...nextauth]';
import { useRouter } from 'next/router';
import { TimerWithProjectAndTask } from '../../../types';

export const getServerSideProps = async (ctx) => {
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
    if (!ctx.params) {
        throw Error('Could not find project');
    } else {
        const project = await prisma.project.findUnique({
          where: {
            id: ctx.params.id
          },
          include: {
            contacts: {
              include: {
                contact: true
              }
            }
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
        if (project.contacts.some((contact) => contact.contact_id === session.user.id) || session.user.is_superuser === true) {
          return {props: { project: JSON.parse(JSON.stringify(project)), timers: JSON.parse(JSON.stringify(timers))}}
        } else {
          return {
            redirect: {
              destination: '/projects',
              permanent: false,
            },
          }
        }
    }
};


export default function ProjectPage({ project, timers }: { project: Project, timers: TimerWithProjectAndTask}) {
  const router = useRouter();

  const refreshProps = () => {
    router.replace(router.asPath);
  }

  const {data: session, status} = useSession();
  if (session === undefined) {
    return <LoadingDots />
  }
  return (
    <Layout
      timers={timers}
      refresh={refreshProps}
      current="Projects" 
      meta={{title: project.name}}
      actions={[
        {label: "Edit Project", href: `/projects/${project.id}/edit`}
      ]}
      breadcrumbs={[
        {label: "Home", href: "/"},
        {label: "Projects", href: "/projects"},
        {label: project.name, href: `/projects/${project.id}`}
      ]}
    >
      <ProjectTabs project={project} current="Dashboard" />
      <div className="p-4">
      <div className="flex flex-col gap-4">
        <Card title="Project Information">
          <dl className="sm:divide-y sm:divide-zinc-700">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-zinc-400">Project name</dt>
                <dd className="mt-1 text-sm text-zinc-200 sm:mt-0 sm:col-span-2">{project.name}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-zinc-400">Description</dt>
                <dd className="mt-1 text-sm text-zinc-200 sm:mt-0 sm:col-span-2">{project.description}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-zinc-400">Domain</dt>
                <dd className="mt-1 text-sm text-zinc-200 sm:mt-0 sm:col-span-2 hover:underline">
                    <a target="_blank" href={`http://${project.domain}`}>
                    {project.domain}
                    </a>
                </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-zinc-400">Created</dt>
              <dd className="mt-1 text-sm text-zinc-200 sm:mt-0 sm:col-span-2">{DateTime.fromISO(project.created).toLocaleString(DateTime.DATETIME_SHORT)}</dd>
            </div>
          </dl>
        </Card>
      </div>
      </div>
      
      


                
    </Layout>
  );
}
