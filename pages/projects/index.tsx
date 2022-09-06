import { unstable_getServerSession } from 'next-auth';
import Layout from '../../components/Layout';
import ProjectList from '../../components/ProjectList';
import prisma from '../../lib/prisma';
import { Project, Timer } from '@prisma/client';
import { authOptions } from '../api/auth/[...nextauth]';
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
    if (session.user.is_superuser) {
      const projects = await prisma.project.findMany()
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
      return {props: { projects: JSON.parse(JSON.stringify(projects)), timers: JSON.parse(JSON.stringify(timers)) }}
    } else {
      const projects = await prisma.project.findMany({
        where: {
          contacts: {
            some: {
              contact: {
                id: session.user.id
              }
            }
          }
        }
      })
      
      console.log(timers)
      return {props: { projects: JSON.parse(JSON.stringify(projects)), timers: JSON.parse(JSON.stringify(timers)) }}

    }
}


export default function Projects({ projects, timers }: { projects: Project[], timers: TimerWithProjectAndTask[]}) {
  const router = useRouter()
  const refreshProps = () => {
    router.replace(router.asPath);
  }
  return (
    <Layout 
      timers={timers}
      refresh={refreshProps}
      current="Projects" 
      meta={{title: "Projects"}} 
      actions={[
        {label: "Add Project", href: "/projects/new", type: 'primary' }
      ]}
      breadcrumbs={[
        {label: "Home", href: "/"},
        {label: "Projects", href: "/projects"}
      ]}
    >
      <ProjectList projects={projects} />
    </Layout>
  );
}
