
import { Project, ProjectContact, User } from '@prisma/client';
import { unstable_getServerSession } from 'next-auth';
import { useRouter } from 'next/router';
import Card from '../../../components/Card';
import Layout from '../../../components/Layout';
import ProjectList from '../../../components/ProjectList';
import prisma from '../../../lib/prisma';
import { DateTime } from '../../../node_modules/luxon/build/cjs-browser/luxon';
import { TimerWithProjectAndTask } from '../../../types';
import { authOptions } from '../../api/auth/[...nextauth]';

interface ProjectContactWithProject extends ProjectContact {
  project: Project
}

interface UserWithProjects extends User {
  projects: ProjectContactWithProject[]
}

export const getServerSideProps = async (ctx) => {
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
    if (!ctx.params) {
        throw Error('Could not find contact');
    } else {
        const contact = await prisma.user.findUnique({
          where: {
            id: ctx.params.id
          },
          include: {
            projects: {
              include: {
                project: true
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
        return {props: { contact: JSON.parse(JSON.stringify(contact)), timers: JSON.parse(JSON.stringify(timers))}}
    }
};


export default function ContactPage({ contact, timers }: { contact: UserWithProjects, timers: TimerWithProjectAndTask[]}) {
  const router = useRouter();
  const refreshProps = () => {
    router.replace(router.asPath);
  }
  const projects = contact.projects.map(project => project.project)
  return (
    <Layout
      timers={timers}
      refresh={refreshProps}
      current="Contacts" 
      meta={{title: contact.name}}
      actions={[
        {label: "Edit Contact", href: `/contacts/${contact.id}/edit`}
      ]}
      breadcrumbs={[
        {label: "Home", href: "/"},
        {label: "Contacts", href: "/contacts"},
        {label: contact.name, href: `/contacts/${contact.id}`}
      ]}
    >
      <div className="flex flex-col gap-4">
        <Card title="Projects">
          <ProjectList projects={projects} contact={contact.id} />
        </Card>
        <Card title="Contact Information">
          <dl className="sm:divide-y sm:divide-zinc-700">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-zinc-400">Name</dt>
                <dd className="mt-1 text-sm text-zinc-200 sm:mt-0 sm:col-span-2">{contact.name}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-zinc-400">Email Address</dt>
                <dd className="mt-1 text-sm text-zinc-200 sm:mt-0 sm:col-span-2">{contact.email}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-zinc-400">Stage</dt>
                <dd className="mt-1 text-sm text-zinc-200 sm:mt-0 sm:col-span-2">{contact.lifecycle_stage}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-zinc-400">Created</dt>
              <dd className="mt-1 text-sm text-zinc-200 sm:mt-0 sm:col-span-2">{DateTime.fromISO(contact.created).toLocaleString(DateTime.DATETIME_SHORT)}</dd>
            </div>
          </dl>
        </Card>
      </div>
      
    </Layout>
  );
}
