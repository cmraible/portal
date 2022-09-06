import { FormEvent, Fragment, useEffect, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronDoubleDownIcon } from '@heroicons/react/outline'
import { User } from '@prisma/client'
import LoadingDots from './ui/LoadingDots'



function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function ContactDropdown({onChange, value}: {onChange: (FormEvent) => void, value: String[]}) {

    const [contacts, setContacts] = useState(undefined)
    console.log(value)
    console.log(contacts)

    useEffect(() => {
        fetch('/api/contacts')
        .then(response => response.json())
        .then(data => setContacts(data))
    }, []);

    if (contacts === undefined) {
      return <LoadingDots />
    }

  return (
    <Listbox value={value} onChange={onChange} multiple>
      {({ open }) => (
        <>
          <Listbox.Label className="block text-sm font-medium text-zinc-200">Contacts</Listbox.Label>
          <div className="relative mt-1">
            <Listbox.Button className="relative w-full cursor-default rounded-md border border-zinc-700 bg-zinc-800 py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
              <span className="inline-flex w-full truncate">
                <span className="truncate">
                    {value.length === 0 && ("None")}
                    {value.length > 0 && (
                        value.map((selected) => {
                            return contacts.find(contact => contact.id === selected).name
                        }).join(', ')
                    )}
                </span>
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronDoubleDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-zinc-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {contacts.map((contact) => (
                  <Listbox.Option
                    key={contact.id}
                    className={({ active }) =>
                      classNames(
                        active ? 'text-white bg-indigo-600' : 'text-zinc-200',
                        'relative cursor-default select-none py-2 pl-3 pr-9'
                      )
                    }
                    value={contact.id}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className="flex">
                          <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'truncate')}>
                            {contact.name}
                          </span>
                          <span className={classNames(active ? 'text-indigo-200' : 'text-gray-500', 'ml-2 truncate')}>
                            {contact.email}
                          </span>
                        </div>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? 'text-white' : 'text-indigo-600',
                              'absolute inset-y-0 right-0 flex items-center pr-4'
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  )
}