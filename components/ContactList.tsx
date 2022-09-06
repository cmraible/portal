import { User } from '@prisma/client';
import Link from 'next/link';

export default function ContactList({contacts}: {contacts: User[]}) {
    if (contacts.length > 0) {
        return (
            <>
               <div className="mt-8 flex flex-col">
                    <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                        <table className="min-w-full divide-y divide-zinc-700">
                            <thead className="bg-zinc-800">
                            <tr>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-zinc-200 sm:pl-6">
                                Name
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-200">
                                Email
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-200">
                                Stage
                                </th>
                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                <span className="sr-only">Edit</span>
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-700 bg-zinc-900">
                            {contacts.map((person) => (
                                <tr key={person.email}>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-zinc-200 sm:pl-6">
                                    <Link href={`/contacts/${person.id}`}><a>{person.name}</a></Link>
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-300">
                                    <Link href={`/contacts/${person.id}`}><a>{person.email}</a></Link>
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-300">{person.lifecycle_stage}</td>
                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                    <Link href={`/contacts/${person.id}/edit`}><a className="text-indigo-500 hover:text-indigo-700">
                                    Edit<span className="sr-only">, {person.name}</span>
                                    </a></Link>
                                </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        </div>
                    </div>
                    </div>
                </div>
            </>
        )
    } else {
        return (
            <Link href="/contacts/new">
                <a
                href="/contacts/new"
                type="button"
                className="relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <svg className="mx-auto h-12 w-12 text-zinc-200"  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                    </svg>


                <span className="mt-2 block text-sm font-medium text-zinc-200">Add a new Contact</span>
                </a>
            </Link>
        )
    }
    
}