

import Breadcrumbs from './Breadcrumbs';
import { Breadcrumb, PageAction } from '../types';
import Link from 'next/link';

interface Props {
  title: string;
  actions?: PageAction[];
  breadcrumbs?: Breadcrumb[];
}

export default function PageHeader({ title, actions, breadcrumbs }: Props) {

  return (
    <>
    <div className="pb-6">
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <div className="mt-2 md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold leading-7 text-zinc-200 sm:text-3xl sm:tracking-tight sm:truncate">
                {title}
                </h1>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
                {actions?.map((action) => {
                    const btnClass = (action.type === 'primary') ? 
                        "inline-flex items-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" :
                        "inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    return (
                        <Link 
                            key={action.label}
                            href={action.href}
                        >
                            <a
                                type="button"
                                className={btnClass}
                            >
                                {action.label}
                            </a>
                        </Link>
                        
                    )
                })}
            </div>
        </div>
    </div>
        
    </>
  );
}
