import { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react"

import '../styles/main.css';

const App = ({ 
  Component, 
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <div className="bg-black text-zinc-300 h-screen">
        <Component {...pageProps} />
      </div>
    </SessionProvider>
    
  );
};

export default App;
