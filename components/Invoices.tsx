import Stripe from "stripe";
import Card from './Card';
import {DateTime} from '../node_modules/luxon/build/cjs-browser/luxon'


export default function Invoices({invoices, title}: {invoices: Stripe.Invoice[], title: string}) {

  return (
    <>
    <Card title={title || "Invoices"}>
        <ul role="list" className="divide-y divide-gray-200">
        {invoices.map((invoice: Stripe.Invoice) => {
            const due_date = invoice.due_date ? DateTime.fromSeconds(invoice.due_date) : ''
            return (
                <li key={invoice.id}>
                    <a href={invoice.hosted_invoice_url || undefined} target="_blank" className="block">
                        <div className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                                <div className="flex flex-row gap-4">
                                    <p className={`${invoice.status === 'paid' ? "line-through" : ''} text-sm font-medium text-indigo-600 truncate`}>{invoice.number}</p>
                                    <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${invoice.status === 'paid'? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                                        {invoice.status}
                                    </p>
                                </div>
                                <div className="ml-2 flex-shrink-0 flex flex-col text-right">
                                    <p className={`${invoice.status === 'paid' ? "line-through" : ''} font-bold`}>${invoice.total/100}</p>
                                    <p className={`${invoice.status === 'paid' ? "line-through" : ''} text-sm text-zinc-400`}>Due {due_date.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </a>
                </li>       
            )
        })}
        </ul>
    </Card>
    </>
  );
}
