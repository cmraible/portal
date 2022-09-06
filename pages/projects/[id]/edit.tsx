import { ProjectContact, User } from '@prisma/client';
import { unstable_getServerSession } from 'next-auth';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import ContactDropdown from '../../../components/ContactDropdown';
import Layout from '../../../components/Layout';
import prisma from '../../../lib/prisma';
import { TimerWithProjectAndTask } from '../../../types';
import { Project } from '@prisma/client';
import { authOptions } from '../../api/auth/[...nextauth]';
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
      return {props: { project: JSON.parse(JSON.stringify(project)), timers: JSON.parse(JSON.stringify(timers))}}
  }
};


export default function EditProject({ project, timers }: { project: ProjectWithContacts, timers: TimerWithProjectAndTask[]}) {

  const router = useRouter();

  const refreshProps = () => {
    router.replace(router.asPath);
  }

  const [name, setName] = useState(project.name)
  const [description, setDescription] = useState(project.description || '')
  const [contacts, setContacts] = useState(project.contacts.map(contact => contact.contact.id))
  const [domain, setDomain] = useState(project.domain)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    fetch(`/api/projects/${project.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "name": name, 
        "description": description, 
        "contacts": contacts,
        "domain": domain
      })
    })
    .then(response => response.json())
    .then(data => window.location.assign(`/projects/${project.id}`));
  }

  return (
    <Layout 
      timers={timers}
      refresh={refreshProps}
      current="Projects" 
      meta={{title: project.name}}
      breadcrumbs={[
        {label: "Home", href: "/"},
        {label: "Projects", href: "/projects"},
        {label: project.name, href: `/projects/${project.id}`}
      ]}
    >
        <form className="space-y-8 divide-y divide-gray-200" onSubmit={handleSubmit}>
        {(error && (
          <p className="text-sm text-red-500">{error}</p>
        ))}
      <div className="space-y-8 divide-y divide-gray-200">
        <div>

          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="username" className="block text-sm font-medium text-zinc-200">
                Project Name<span className="text-red-500">*</span>
              </label>
              <div className="mt-1 flex rounded-md shadow-sm bg-zinc-800">
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                  className="bg-zinc-800 flex-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full min-w-0 rounded-md sm:text-sm border-zinc-700"
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="about" className="block text-sm font-medium text-zinc-200">
                Description
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-zinc-700 bg-zinc-800 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="username" className="block text-sm font-medium text-zinc-200">
                Domain Name
              </label>
              <div className="mt-1 flex rounded-md shadow-sm bg-zinc-800">
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  autoComplete="name"
                  className="bg-zinc-800 flex-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full min-w-0 rounded-md sm:text-sm border-zinc-700"
                />
              </div>
            </div>
            <div className="pt-5 sm:col-span-4">
              <div className="flex justify-end">
                <Link href={`/projects/${project.id}`}>
                  <a
                    href={`/projects/${project.id}`}  
                    type="button"
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </a>
                </Link>
                
                <button
                  type="submit"
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
          
        </div>
        </div>
      </form>
    </Layout>
  );
}
