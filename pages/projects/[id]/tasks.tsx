
import { Project, Task } from '@prisma/client';
import { unstable_getServerSession } from 'next-auth';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import TaskCreate from '../../../components/forms/TaskCreate';
import Layout from '../../../components/Layout';
import ProjectTabs from '../../../components/ProjectTabs';
import TaskList from '../../../components/TaskList';
import LoadingDots from '../../../components/ui/LoadingDots';
import prisma from '../../../lib/prisma';
import { TaskWithTimers, TimerWithProjectAndTask } from '../../../types';
import { authOptions } from '../../api/auth/[...nextauth]';

interface ProjectWithTasks extends Project {
  tasks: TaskWithTimers[]
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
            },
            tasks: {
              include: {
                timers: true
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


export default function ProjectPage({ project, timers }: { project: ProjectWithTasks, timers: TimerWithProjectAndTask[]}) {
  const {data: session, status} = useSession();
  const router =  useRouter();

  const refreshProps = () => {
    router.replace(router.asPath);
  }

  if (session === undefined) {
    return <LoadingDots />
  }

  const openTasks = project.tasks.filter(task => task.completed === null)
  const completedTasks = project.tasks.filter(task => task.completed !== null)
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
      <ProjectTabs project={project} current="Tasks" />
      <div className="py-4 flex flex-col gap-4">
        <TaskCreate project={project} onSuccess={refreshProps} />

      {openTasks.length > 0 && (
        <>
        <p className="text-sm">Open Tasks:</p>
        <TaskList timer={true} project={project} refresh={refreshProps} tasks={openTasks} />
        </>
      )}

      {completedTasks.length > 0 && (
        <>
        <p className="text-sm">Completed Tasks:</p>
        <TaskList timer={false} project={project} refresh={refreshProps} tasks={completedTasks} />
        </>
      )}

      </div>
      
    </Layout>
  );
}
