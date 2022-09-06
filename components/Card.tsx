import { ReactNode } from "react";

export default function Card({children, title}: {children: ReactNode, title: string}) {
    return (
        <div className="bg-zinc-900 shadow overflow-hidden sm:rounded-md">
        <div className="bg-zinc-800 px-4 py-5 border-b border-zinc-600 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-white">{title}</h3>
        </div>
        <div className="p-3">
            {children}
        </div>
    </div>
    )
}