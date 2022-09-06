import { ChangeEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, useEffect, useState } from 'react';
import { useSession, signIn } from "next-auth/react"

import LoadingDots from '../components/ui/LoadingDots';

const SignIn = () => {

  const { data: session } = useSession()

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type?: string; content?: string }>({
    type: '',
    content: ''
  });
  const router = useRouter();

  const handleSignin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signIn("email", { email })
  };
    if (session) {
      window.location.assign('/')
    } else {
      return (
        <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <img
              className="mx-auto h-12 w-auto rounded-full"
              src="avatar.jpeg"
              alt="Chris Raible"
            />
            <h2 className="mt-6 text-center text-3xl tracking-tight font-bold text-zinc-200">Sign in to your account</h2>
          </div>
  
          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-zinc-900 text-zinc-200 py-8 px-4 shadow sm:rounded-lg sm:px-10">
              {message.content && (
                <div
                  className={`${
                    message.type === 'error' ? 'text-pink-500' : 'text-green-500'
                  } py-3`}
                >
                  {message.content}
                </div>
              )}
                <form className="space-y-6" onSubmit={handleSignin}>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-white">
                      Email address
                    </label>
                    <div className="mt-1">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        required
                        className="appearance-none bg-zinc-800 block w-full px-3 py-2 border border-zinc-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div>
                  <button
                      type="submit"
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Send Magic Link
                    </button>
                  </div>
                </form>
              <div className="flex flex-col items-center justify-between mt-6 space-y-6">
                <div>
                <span className="pt-1 text-center text-sm text-white">
                  <span>Don't have an account?</span>
                  {` `}
                  <Link href="/signup">
                    <a className="text-accent-9 font-bold hover:underline cursor-pointer">
                      Sign up.
                    </a>
                  </Link>
                </span>
                </div>
              </div>
  
            </div>
          </div>
        </div>
      );
    }
    
};

export default SignIn;
