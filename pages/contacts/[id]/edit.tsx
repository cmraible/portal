import { User } from '@prisma/client';
import { unstable_getServerSession } from 'next-auth';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import Layout from '../../../components/Layout';
import prisma from '../../../lib/prisma';
import { TimerWithProjectAndTask } from '../../../types';
import { authOptions } from '../../api/auth/[...nextauth]';


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
      throw Error('Could not find project');
  } else {
      const user = await prisma.user.findUnique({
        where: {
          id: ctx.params.id
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
      return {props: { contact: JSON.parse(JSON.stringify(user)), timers: JSON.parse(JSON.stringify(timers))}}
  }
};


export default function EditContact({ contact, timers }: { contact: User, timers: TimerWithProjectAndTask[]}) {

  const router = useRouter();
  const refreshProps = () => {
    router.replace(router.asPath);
  }

  const [name, setName] = useState(contact.name)
  const [email, setEmail] = useState(contact.email)
  const [stage, setStage] = useState(contact.lifecycle_stage)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    fetch(`/api/contacts/${contact.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "name": name, 
        "email": email, 
        "lifecycle_stage": stage
      })
    })
    .then(response => response.json())
    .then(data => window.location.assign(`/contacts/${data.id}`));
  }

  return (
    <Layout
      timers={timers}
      refresh={refreshProps}
      current="Contacts" 
      meta={{title: contact.name}}
      breadcrumbs={[
        {label: "Home", href: "/"},
        {label: "Contacts", href: "/contacts"},
        {label: contact.name, href: `/contacts/${contact.id}`}
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
              <label htmlFor="about" className="block text-sm font-medium text-zinc-200">
                Email<span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  id="description"
                  name="description"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-zinc-700 bg-zinc-800 rounded-md"
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
                </select>

              </div>
            </div>

            <div className="pt-5 sm:col-span-4">
              <div className="flex justify-end">
                <Link href={`/contacts/${contact.id}`}>
                  <a
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
