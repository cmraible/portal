import { Project, Task, Timer } from '@prisma/client';
import { ClockIcon } from '@heroicons/react/outline';
import { DateTime } from '../node_modules/luxon/build/cjs-browser/luxon';
import { StopIcon } from '@heroicons/react/solid';
import { useEffect, useState } from 'react';
import { TimerWithProjectAndTask } from '../types';


export default function TimerAlert({ timer, refresh } : { timer: TimerWithProjectAndTask, refresh: () => void }) {
  const now = DateTime.local()
  const started = DateTime.fromISO(timer.started)
  const [elapsed, setElapsed] = useState(now.diff(started, ["hours", "minutes", "seconds"]))

  useEffect(() => {
    setInterval(() => setElapsed(DateTime.local().diff(started, ["hours", "minutes", "seconds"])), 1000);
  }, [elapsed])

  const handleStopTimer = () => {
    fetch(`/api/timers/${timer.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ended: DateTime.local().toISO()
      })
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .then(data => refresh())
  }

  return (
    <>
        <div className="flex flex-row items-center h-16 px-6 w-full bg-indigo-500 text-white">
          <div className="flex flex-row w-full items-center gap-4">
            <ClockIcon className="h-8" />
            <div className="flex flex-col">
              <p>{timer.project.name}</p>
              <p className="text-sm">{timer.task.description}</p>
            </div>
          </div>
          <div className="flex flex-row items-center gap-4">
            <p>{elapsed.toFormat("h:mm:ss")}</p>
            <button onClick={handleStopTimer}>
              <StopIcon className="h-8" />
            </button>
          </div>
            
            
        </div>
    </>
  );
}
