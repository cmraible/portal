
import { unstable_getServerSession } from 'next-auth';
import { useSession } from 'next-auth/react';
import Layout from '../../../components/Layout';
import ProjectContactList from '../../../components/ProjectContactList';
import ProjectTabs from '../../../components/ProjectTabs';
import LoadingDots from '../../../components/ui/LoadingDots';
import prisma from '../../../lib/prisma';
import { Project, ProjectContact, User } from '@prisma/client';
import { authOptions } from '../../api/auth/[...nextauth]';
import { TimerWithProjectAndTask } from '../../../types';
import { useRouter } from 'next/router';

interface ProjectContactWithContact extends ProjectContact {
  contact: User
}

interface ProjectWithContacts extends Project {
  contacts: ProjectContactWithContact[]
}

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


export default function ProjectPage({ project, timers }: { project: ProjectWithContacts, timers: TimerWithProjectAndTask[]}) {
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
        // {label: "Edit Project", href: `/projects/${project.id}/edit`}
      ]}
      breadcrumbs={[
        {label: "Home", href: "/"},
        {label: "Projects", href: "/projects"},
        {label: project.name, href: `/projects/${project.id}`}
      ]}
    >
      <ProjectTabs project={project} current="Team" />
      <div className="flex flex-col gap-4">
        <ProjectContactList contacts={project.contacts} />
      </div>
    </Layout>
  );
}
