import { CalendarIcon, CheckCircleIcon, ClockIcon, PencilIcon, TrashIcon } from "@heroicons/react/outline";
import { Task } from '@prisma/client';
import { DateTime, Duration } from '../node_modules/luxon/build/cjs-browser/luxon';
import { Project } from "@prisma/client";
import { useSession } from "next-auth/react";
import { TaskWithTimers } from "../types";

export default function TaskList({project, tasks, refresh, timer}: {project: Project, tasks: TaskWithTimers[], refresh?: () => void, timer: Boolean}) {
    const {data: session } = useSession();


    const handleDelete = (task_id) => {
        fetch(`/api/tasks/${task_id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => refresh());
    }

    const handleComplete = (task_id) => {
        fetch(`/api/tasks/${task_id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                completed: DateTime.local().toISO()
            })
        })
        .then(response => response.json())
        .then(data => refresh());
    }

    const handleStartTimer = async (task_id) => {
      fetch(`/api/timers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          project_id: project.id,
          task_id: task_id,
          started: DateTime.local().toISO()
        })
      })
      .then(response => response.json())
      .then(data => console.log(data))
      .then(data => refresh())
    }

  return (
    <div className="overflow-hidden bg-zinc-800 shadow sm:rounded-md">
      <ul role="list" className="divide-y divide-zinc-700">
        {tasks.map((task) => {
          const duration = task.timers.map((timer) => {
            if (timer.ended) {
              return DateTime.fromISO(timer.ended).diff(DateTime.fromISO(timer.started), ["hours", "minutes", "seconds"])
            } else {
              return DateTime.local().diff(DateTime.fromISO(timer.started), ["hours", "minutes", "seconds"])
            }
          }).reduce((prev, cur) => {
            return prev.plus(cur)
          }, Duration.fromMillis(0));
          

          return (
          <li key={task.id}>
              <div className="flex items-center px-4 py-4 sm:px-6">
                <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                  <div className="truncate">
                    <div className="flex text-sm">
                      <p className="truncate font-medium text-zinc-200">{task.description}</p>
                    </div>
                    {task.due_date && (
                        <div className="mt-2 flex">
                        <div className="flex items-center text-sm text-gray-500">
                          <CalendarIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                          <p>
                            Due on <time dateTime={DateTime.fromISO(task.due_date)}>{task.due_date}</time>
                          </p>
                        </div>
                      </div>
                    )}
                    
                    
                  </div>
                </div>
                <div className="ml-5 flex-shrink-0 flex-row flex">
                    {duration && (
                        <div className="flex">
                        <div className="flex items-center text-sm text-gray-500">
                        {(timer && (session.user.is_superuser === true || session.user.is_staff === true)) && (
                          <button className="px-2 rounded-full" onClick={() => handleStartTimer(task.id)}>
                              <ClockIcon className="h-5 w-5 text-zinc-200 hover:text-indigo-500" />
                          </button>
                        )}
                          <p>
                            {duration.valueOf() > (1000 * 60 * 60) ? duration.toFormat("h:mm:ss") : duration.toFormat("m:ss")}
                          </p>
                        </div>
                      </div>
                    )}
                    {task.completed === null && (
                        <button className="px-2 rounded-full" onClick={() => handleComplete(task.id)}>
                            <CheckCircleIcon className="h-5 w-5 text-zinc-200 hover:text-green-500" />
                        </button>
                    )}
                    {/* <button className="px-2 rounded-full">
                        <PencilIcon className="h-5 w-5 text-zinc-200 hover:text-yellow-500" />
                    </button> */}
                    <button className="px-2 rounded-full" onClick={() => handleDelete(task.id)}>
                        <TrashIcon className="h-5 w-5 text-zinc-200 hover:text-red-500" />
                    </button>
                </div>
              </div>
          </li>
        )})}
      </ul>
    </div>
  )
}