import { UserIcon } from '@heroicons/react/outline';
import { FormEvent, useState } from 'react';
import LoadingDots from '../ui/LoadingDots';

export default function Name({initialValue}: { initialValue: string }) {

    const [name, setName] = useState(initialValue || '')
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', content: ''})


    const handleSubmit = async (e: FormEvent) => {
        setIsLoading(true)
        setMessage({type: '', content: ''});
        e.preventDefault()
        if (name) {
            fetch('/api/users', {
                method: 'PATCH', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name
                })
            })
            .then(response => response.json())
            .then(response => setIsLoading(false))
            .catch(error => setMessage({type: 'error', content: error.message}))
        }
    }

    const userLoading = false;

    return (
            <form onSubmit={handleSubmit} action="#">
                <label htmlFor="email" className="block text-sm font-medium text-zinc-200">
                    Full Name
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                    <div className="relative flex items-stretch w-full focus-within:z-10">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white">
                        <UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={name}
                        disabled={userLoading}
                        onChange={(e) => setName(e.target.value)}
                        className={`focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-none rounded-l-md pl-10 sm:text-sm border-zinc-700 bg-zinc-800`}
                        placeholder="John Smith"
                    />
                    </div>
                    <button
                        disabled={isLoading}
                        type="submit"
                        className="disabled:bg-zinc-400 -ml-px relative inline-flex flex-shrink-0 items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-zinc-100 hover:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <span>
                            {isLoading  && (<LoadingDots />)}
                            {!isLoading && ('Save')}
                        </span>
                    </button>
                </div>
                {message.type === 'error' && (
                    <p className="mt-2 text-sm text-red-600" id="name-error">
                        {message.content}
                    </p>
                )}
                {(
                    message.type === 'success' && (
                        <p className="mt-2 text-sm text-green-600" id="name-success">
                            {message.content}
                        </p>
                    )
                )}
                
            </form>
    )
}