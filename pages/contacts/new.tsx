import Layout from '../../components/Layout';
import { FormEvent, useState } from 'react';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import Link from 'next/link';
import { TimerWithProjectAndTask } from '../../types';
import { useRouter } from 'next/router';
import prisma from '../../lib/prisma';


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
  return {props: { timers: JSON.parse(JSON.stringify(timers))}}
}


export default function NewContact({ timers }: {timers: TimerWithProjectAndTask[]}) {

  const router = useRouter();
  const refreshProps = () => {
    router.replace(router.asPath);
  }
  
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [stage, setStage] = useState('Lead')
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    fetch('/api/contacts', {
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "name": name,
        "email": email,
        "lifecycle_stage": stage
      })
    })
    .then(response => response.json())
    .then(data => window.location.assign(`/contacts/${data.id}`))
    
  }
  return (
    <Layout
      timers={timers}
      refresh={refreshProps}
      current="Contacts" 
      meta={{title: "New Contact"}} 
      breadcrumbs={[
        {label: "Home", href: "/"},
        {label: "Contacts", href: "/contacts"},
        {label: "New Contact", href: "/contacts/new"}
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
                Email<span className="text-red-500">*</span>
              </label>
              <div className="mt-1 flex rounded-md shadow-sm bg-zinc-800">
                <input
                  type="text"
                  name="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="name"
                  className="bg-zinc-800 flex-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full min-w-0 rounded-md sm:text-sm border-zinc-700"
                />
              </div>
            </div>
            <div className="sm:col-span-4">
              <label htmlFor="username" className="block text-sm font-medium text-zinc-200">
                Name
              </label>
              <div className="mt-1 flex rounded-md shadow-sm bg-zinc-800">
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  className="bg-zinc-800 flex-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full min-w-0 rounded-md sm:text-sm border-zinc-700"
                />
              </div>
            </div>
            <div className="sm:col-span-4">
              <label htmlFor="username" className="block text-sm font-medium text-zinc-200">
                Lifecycle Stage<span className="text-red-500">*</span>
              </label>
              <div className="mt-1 flex rounded-md shadow-sm bg-zinc-800">
                <select
                  name="lifecycle_stage"
                  id="lifecycle_stage"
                  required
                  value={stage}
                  onChange={(e) => setStage(e.target.value)}
                  className="bg-zinc-800 flex-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full min-w-0 rounded-md sm:text-sm border-zinc-700"
                >
                  <option value="Lead">Lead</option>
                  <option value="Opportunity">Opportunity</option>
                  <option value="Client">Client</option>
                  <option value="Staff">Staff</option>
                </select>

              </div>
            </div>
            <div className="pt-5 sm:col-span-4">
              <div className="flex justify-end">
                <Link href="/contacts">
                  <a
                    type="button"
                    href="/contacts"
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
