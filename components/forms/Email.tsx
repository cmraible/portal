import { MailIcon } from '@heroicons/react/outline';
import { useState } from 'react';
import LoadingDots from '../ui/LoadingDots';

export default function EmailInput({initialValue}: {initialValue: string}) {

    const [email, setEmail] = useState(initialValue)
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', content: ''})

    return (
            <form action="#">
                <label htmlFor="email" className="block text-sm font-medium text-zinc-200">
                    Email Address
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                    <div className="relative flex items-stretch flex-grow focus-within:z-10">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white">
                        <MailIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        disabled
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-none rounded-l-md pl-10 sm:text-sm border-zinc-700 bg-zinc-800 ${(initialValue === email) || message.type === 'success' ? 'rounded-r-md' : ''}`}
                        placeholder="you@example.com"
                    />
                    </div>
                    {initialValue !== email && message.type !== 'success' && (
                    <button
                        disabled={isLoading || message.type === 'success'}
                        type="submit"
                        className="disabled:bg-zinc-400 -ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-zinc-100 hover:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <span>
                            {isLoading  && (<LoadingDots />)}
                            {!isLoading && message.type !== 'success' && ('Save')}
                        </span>
                    </button>
                    )}
                </div>
                {message.type === 'error' && (
                    <p className="mt-2 text-sm text-red-600" id="email-error">
                        {message.content}
                    </p>
                )}
                {(
                    message.type === 'success' && (
                        <p className="mt-2 text-sm text-green-600" id="email-success">
                            {message.content}
                        </p>
                    )
                )}
                
            </form>
    )
}