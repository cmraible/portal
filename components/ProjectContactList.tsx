import { ProjectContact, User } from '@prisma/client';
import Link from 'next/link';

interface ProjectContactWithUser extends ProjectContact {
    contact: User
}

export default function ProjectContactList({contacts}: {contacts: ProjectContactWithUser[]}) {
    console.log(contacts)
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
                                Role
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-zinc-900">
                            {contacts.map((projectContact) => (
                                <tr key={projectContact.contact.email}>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-zinc-200 sm:pl-6">
                                    <Link href={`/contacts/${projectContact.contact_id}`}><a>{projectContact.contact.name}</a></Link>
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-300">
                                    <Link href={`/contacts/${projectContact.contact_id}`}><a>{projectContact.contact.email}</a></Link>
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-300">
                                    <Link href={`/contacts/${projectContact.contact_id}`}><a>{projectContact.role}</a></Link>
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
                type="button"
                className="relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <svg className="mx-auto h-12 w-12 text-zinc-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                    </svg>
                <span className="mt-2 block text-sm font-medium text-zinc-200">Add a new Contact</span>
                </a>
            </Link>
            
        )
    }
    
}