import { Project } from "@prisma/client"
import { transcode } from "buffer";
import Link from 'next/link';

  
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }
  
  export default function ProjectTabs({project, current} : {project: Project, current: String}) {

    const tabs = [
        { name: 'Dashboard', href: `/projects/${project.id}`, current: current === 'Dashboard' },
        { name: 'Tasks', href: `/projects/${project.id}/tasks`, current: current === 'Tasks' },
        { name: 'Team', href: `/projects/${project.id}/team`, current: current === 'Team' },
    ]
    return (
      <div>
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">
            Select a tab
          </label>
          {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
          <select
            id="tabs"
            onChange={(e) => {
              window.location.assign(tabs.find(tab => tab.name === e.target.value).href)
            }}
            name="tabs"
            className="block w-full rounded-md bg-zinc-800 border-zinc-700 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            defaultValue={tabs.find((tab) => tab.current).name}
          >
            {tabs.map((tab) => (
              <option key={tab.name}>{tab.name}</option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => (
                <Link 
                    key={tab.name}
                    href={tab.href}
                >
                    <a
                    className={classNames(
                        tab.current
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-zinc-200 hover:text-white hover:border-gray-300',
                        'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                    )}
                    aria-current={tab.current ? 'page' : undefined}
                    >
                    {tab.name}
                    </a>
                </Link>
                
              ))}
            </nav>
          </div>
        </div>
      </div>
    )
  }