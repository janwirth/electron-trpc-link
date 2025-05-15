import React, { useState } from 'react';
import ReactDom from 'react-dom/client';
// import { ipcLink } from '@janwirth/electron-trpc-link/renderer';
import { ipcLink } from '../../../packages/electron-trpc-link/dist/renderer';
import superjson, { SuperJSON } from 'superjson';
import { createTRPCReact } from '@trpc/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AppRouter } from '../electron/api';

const trpcReact = createTRPCReact<AppRouter>();

function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpcReact.createClient({
      links: [ipcLink({ transformer: SuperJSON })],
    }),
  );

  return (
    <trpcReact.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <HelloElectron />
      </QueryClientProvider>
    </trpcReact.Provider>
  );
}

function HelloElectron() {
  const { data } = trpcReact.greeting.useQuery({ name: 'Electron' });
  trpcReact.subscription.useSubscription(undefined, {
    onData: data => {
      console.log(data);
    },
  });
  trpcReact.subscription2.useSubscription(undefined, {
    onError: error => {
      console.error('error', error);
    },
    onComplete: () => {
      console.log('complete');
    },
    onData: data => {
      console.log('data from generator', data);
    },
  });

  if (!data) {
    return null;
  }

  return <div>{data.text}</div>;
}

const root = ReactDom.createRoot(document.getElementById('react-root')!);
root.render(<App />);
