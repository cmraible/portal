import { Dialog, Menu, Transition } from '@headlessui/react';
import { BriefcaseIcon, ClockIcon, CreditCardIcon, MenuAlt2Icon, UserIcon, HomeIcon, UsersIcon, XIcon } from '@heroicons/react/outline';
import { User } from '@prisma/client';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { Fragment, useState } from 'react';


function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Sidebar({ session, current} : { session: Session, current: string}) {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  var navigation = [
    { name: 'Home', href: '/', icon: HomeIcon, current: current === 'Home'},
    { name: 'Projects', href:'/projects', icon: BriefcaseIcon, current: current === 'Projects'},
  ]

  if (session.user.is_superuser || session.user.is_staff) {
    navigation.splice(1,0, {name: 'Contacts', href: '/contacts', icon: UsersIcon, current: current === 'Contacts'})
  } else {
    navigation.push({ name: 'Billing', href: '/billing', icon: CreditCardIcon, current: current === 'Billing' })
  }
  
  const userNavigation = [
    { name: 'My Profile', href: '/profile'},
    { name: 'Sign out', onClick: () => signOut() },
  ]

  return (
    <>
        {/* Open sidebar button — hidden on md+ */}
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-black border-b border-zinc-900 md:hidden">
            <button
            type="button"
            className="px-4 border-r border-b border-zinc-900 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            onClick={() => setSidebarOpen(true)}
            >
            <span className="sr-only">Open sidebar</span>
                <MenuAlt2Icon className="h-6 w-6" aria-hidden="true" />
            </button>
        </div>
        {/* End sidebar button */}
        <div className="z-40">
        {/* Mobile sidebar slides into frame when button pressed (controlled by parent) */}
        {/* Hidden on md+ */}
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog as="div" className="relative z-40 md:hidden" onClose={setSidebarOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>

            <div className="fixed inset-0 flex z-40">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-black">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    {/* Close Icon */}
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                      <button
                        type="button"
                        className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
                      </button>
                    </div>
                    {/* End Close Icon */}
                  </Transition.Child>
                  {/* Logo / Branding */}
                  <div className="flex-shrink-0 flex items-center px-4">
                    <img
                      className="h-8 w-auto rounded-full"
                      src="avatar.jpeg"
                      alt="Workflow"
                    />
                  </div>
                  {/* End Logo / Branding */}
                  <div className="mt-5 flex-1 h-0 overflow-y-auto">
                    {/* Navigation */}
                    <nav className="px-2 space-y-1">
                      {navigation.map((item) => (
                        <Link href={item.href} key={item.name}>
                          <a
                            className={classNames(
                              item.current
                                ? 'bg-gray-900 text-zinc-300'
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                              'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                            )}
                          >
                            <item.icon
                              className={classNames(
                                item.current ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300',
                                'mr-4 flex-shrink-0 h-6 w-6'
                              )}
                              aria-hidden="true"
                            />
                            {item.name}
                          </a>
                        </Link>
                        
                      ))}
                    </nav>
                    {/* End Navigation */}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
              <div className="flex-shrink-0 w-14" aria-hidden="true">
                {/* Dummy element to force sidebar to shrink to fit close icon */}
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static si±debar for desktop - hidden on sm */}
        <div className="hidden z-40 md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r border-zinc-900">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex-1 flex flex-col min-h-0 bg-black">
            {/* Top bar */}
            <div className="flex items-center justify-between h-16 flex-shrink-0 px-4 bg-black">
            <Menu as="div" className="relative">
                <div className="bg-white rounded-full">
                    <Menu.Button className="max-w-xs bg-white flex flex-grow-9 items-center text-sm h-8 w-8 rounded-full focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-white">
                    <div
                      className="p-1 rounded-full text-zinc-600 hover:ring-2 hover:ring-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                      >
                      <span className="sr-only">View notifications</span>
                      <UserIcon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    </Menu.Button>
                </div>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className="origin-top-left absolute left-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-zinc-900 ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {userNavigation.map((item) => (
                        <Menu.Item key={item.name}>
                        {({ active }) => (
                            <a
                            href={item.href}
                            onClick={item.onClick}
                            className={classNames(
                                active ? 'bg-zinc-700' : '',
                                'block px-4 py-2 text-sm text-zinc-200'
                            )}
                            >
                            {item.name}
                            </a>
                        )}
                        </Menu.Item>
                    ))}
                    </Menu.Items>
                </Transition>
                </Menu>
              <button
                type="button"
                className="p-1 rounded-full text-zinc-300 hover:text-white hover:ring-2 hover:ring-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                >
                <span className="sr-only">View notifications</span>
                {/* <BellIcon className="h-6 w-6" aria-hidden="true" /> */}
              </button>
            </div>
            {/* End Top Bar */}
            {/* Navigation */}
            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-2 py-4 space-y-1">
                {navigation.map((item) => (
                  <Link href={item.href} key={item.name}>
                    <a
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        item.current ? 'bg-zinc-900 text-zinc-300' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                      )}
                    >
                      <item.icon
                        className={classNames(
                          item.current ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300',
                          'mr-3 flex-shrink-0 h-6 w-6'
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </a>
                  </Link>
                ))}
              </nav>
            </div>
            {/* End Navigation */}
          </div>
        </div>
      </div>
    </>
  );
}
