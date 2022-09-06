import Layout from '../../components/Layout';
import { FormEvent, useState } from 'react';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import Link from 'next/link';
import ContactDropdown from '../../components/ContactDropdown'
import { useSession } from 'next-auth/react';
import LoadingDots from '../../components/ui/LoadingDots';
import { useRouter } from 'next/router'
import prisma from '../../lib/prisma';
import { TimerWithProjectAndTask } from '../../types';



export async function getServerSideProps(ctx) {
  const session = await unstable_getServerSession(ctx.req, ctx.res, authOptions)
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
  return {props: {timers: JSON.parse(JSON.stringify(timers))}}
}


export default function NewProject({ timers } : { timers: TimerWithProjectAndTask[] }) {

  const router = useRouter();
  const initialContact = (typeof router.query.contact === 'string') ? [router.query.contact] : [];

  const refreshProps = () => {
    router.replace(router.asPath);
  }

  const {data: session, status } = useSession();
  
  const [name, setName] = useState('')
  const [contacts, setContacts] = useState(initialContact)
  const [domain, setDomain] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    fetch('/api/projects', {
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "name": name,
        "domain": domain,
        "contacts": contacts
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.id) {
        window.location.assign(`/projects/${data.id}`)
      } else {
         throw Error('Unable to create project.')
      }
    })
    .catch(error => console.log(error))
    
  }
  if (session === undefined) {
    return <LoadingDots />
  }
  return (
    <Layout 
      timers={timers}
      refresh={refreshProps}
      current="Projects" 
      meta={{title: "New Project"}} 
      breadcrumbs={[
        {label: "Home", href: "/"},
        {label: "Projects", href: "/projects"},
        {label: "New Project", href: "/projects/new"}
      ]}
    >
      <form className="space-y-8 divide-y divide-gray-200" onSubmit={handleSubmit}>
        {(error && (
          <p className="text-sm text-red-500">{error}</p>
        ))}
      <div className="space-y-8 divide-y divide-gray-200">
        <div>

          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            {(session.user.is_superuser || session.user.is_staff) && (
              <div className="sm:col-span-4">
                <ContactDropdown 
                  value={contacts} 
                  onChange={(e) => setContacts(e)}
                />
              </div>
            )}

            <div className="sm:col-span-4">
              <label htmlFor="name" className="block text-sm font-medium text-zinc-200">
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
              <label htmlFor="domain" className="block text-sm font-medium text-zinc-200">
                Domain Name
              </label>
              <div className="mt-1 flex rounded-md shadow-sm bg-zinc-800">
                <input
                  type="text"
                  name="domain"
                  id="domain"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  autoComplete="name"
                  className="bg-zinc-800 flex-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full min-w-0 rounded-md sm:text-sm border-zinc-700"
                />
              </div>
            </div>
            
            <div className="pt-5 sm:col-span-4">
              <div className="flex justify-end">
                <Link href="/projects">
                  <a
                    type="button"
                    href="/projects"
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
