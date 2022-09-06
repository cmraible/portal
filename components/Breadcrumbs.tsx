import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';
import { Breadcrumb } from '../types';
import Link from 'next/link';
interface Props {
    breadcrumbs?: Breadcrumb[]
}

export default function Breadcrumbs({breadcrumbs}: Props) {
    if (!breadcrumbs || breadcrumbs.length === 1) {
        return (<></>)
    }
    return (
        <>
            <nav className="sm:hidden" aria-label="Back">
                <Link href={breadcrumbs[breadcrumbs.length - 2].href}>
                    <a href={breadcrumbs[breadcrumbs.length - 2].href} className="flex items-center text-sm font-medium text-gray-400 hover:text-gray-200">
                        <ChevronLeftIcon className="flex-shrink-0 -ml-1 mr-1 h-5 w-5 text-gray-500" aria-hidden="true" />
                        Back
                    </a>
                </Link>
                
            </nav>
            <nav className="hidden sm:flex" aria-label="Breadcrumb">
                <ol role="list" className="flex items-center space-x-4">
                    {(breadcrumbs && breadcrumbs.map((crumb, index) => {
                        if (index === 0) {
                            return (
                                <li key={crumb.label}>
                                    <div className="flex">
                                        <Link href={crumb.href}>
                                            <a className="text-sm font-medium text-gray-500 hover:text-gray-700">
                                                {crumb.label}
                                            </a>
                                        </Link>
                                    </div>
                                </li>
                            )
                        } else {
                            return (
                                <li key={crumb.label}>
                                    <div className="flex items-center">
                                        <ChevronRightIcon className="flex-shrink-0 h-5 w-5 text-gray-500" aria-hidden="true" />
                                        <Link href={crumb.href}>
                                            <a className="ml-4 text-sm font-medium text-gray-400 hover:text-gray-200">
                                                {crumb.label}
                                            </a>
                                        </Link>
                                        
                                    </div>
                                </li>
                            )
                        }
                    }))}
                </ol>
            </nav>
        </>
        
    )
}