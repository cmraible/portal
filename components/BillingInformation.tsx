
import { ReactNode } from "react";
import Card from './Card'
import { useState } from "react";
import { postData } from "../lib/helpers";
import { redirect } from "next/dist/server/api-utils";

export default function BillingInformation({title}: {title: string}) {


    const [loading, setLoading] = useState(false)

  const redirectToCustomerPortal = async () => {
    setLoading(true);
    try {
      const { url, error } = await postData({
        url: '/api/stripe/create-portal-link'
      });
      window.location.assign(url);
    } catch (error) {
      if (error) return alert((error as Error).message);
    }
    setLoading(false);
  };

    return (
        <Card title={title}>
            <div className="bg-zinc-900 shadow">
            <div className="px-4 py-5 sm:p-6">
              <div className="sm:flex sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-zinc-200">Customer Portal</h3>
                  <div className="mt-2 max-w-xl text-sm text-gray-500">
                    <p>
                      Edit your billing address and payment methods
                    </p>
                  </div>
                </div>
                <div className="mt-5 sm:mt-0 sm:ml-6 sm:flex-shrink-0 sm:flex sm:items-center">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                    onClick={redirectToCustomerPortal}
                 >
                    Customer Portal
                  </button>
                </div>
              </div>
            </div>
          </div>
            
        </Card>
    )
}