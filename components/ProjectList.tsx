import { Project } from '@prisma/client';
import Link from 'next/link';

export default function ProjectList({projects, contact}: {projects: Project[], contact?: String}) {
    if (projects.length > 0) {
        return (
            <>
               <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => (
                    <li key={project.id} className="col-span-1 bg-zinc-800 hover:bg-zinc-700 cursor-pointer rounded-lg shadow divide-y divide-gray-200">
                        <Link href={`/projects/${project.id}`}>
                            <a >
                                <div className="w-full flex items-center justify-between p-6 space-x-6">
                                    <div className="flex-1 truncate">
                                        <div className="flex items-center space-x-3">
                                            <h3 className="text-zinc-200 text-sm font-medium truncate">{project.name}</h3>
                                        </div>
                                            {(project.description && (
                                                <p className="prose mt-3 text-zinc-400 text-sm truncate">{project.description}</p>
                                            ))}
                                    </div>
                                </div>
                            </a>
                        </Link>
                        
                    </li>
                    ))}
                </ul>
            </>
        )
    } else {
        return (
            <Link href={(contact) ? `/projects/new?contact=${contact}` : '/projects/new'}>
                <a
                type="button"
                className="relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <svg className="mx-auto h-12 w-12 text-zinc-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                    </svg>
                <span className="mt-2 block text-sm font-medium text-zinc-200">Add a new Project</span>
                </a>
            </Link>
            
        )
    }
    
}