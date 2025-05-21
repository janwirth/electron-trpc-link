import React, { useState } from 'react';
import ReactDom from 'react-dom/client';
import { ipcLink } from '../../../packages/electron-trpc-link/src/renderer';
// import { ipcLink } from '../../../packages/electron-trpc-link/dist/renderer';
import { createTRPCReact, loggerLink } from '@trpc/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AppRouter } from '../electron/api';

const trpcReact = createTRPCReact<AppRouter>();

function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpcReact.createClient({
      links: [loggerLink(), ipcLink()],
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
  // const { error } = trpcReact.errorQuery.useQuery();
  trpcReact.subscription.useSubscription(undefined, {
    onError: error => {
      console.error('error', error);
    },
    onComplete: () => {
      console.log('complete');
    },
    onData: data => {
      console.log('data from observable', data);
    },
  });
  trpcReact.errorSubscription.useSubscription(undefined, {
    onError: error => {
      console.error('expected error', error);
    },
    onComplete: () => {
      console.log('BAD COMPLETED');
    },
    onData: data => {
      console.log('BAD DATA', data);
    },
  });
  const errorMutation = trpcReact.errorMutation.useMutation();
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
  console.log('data', data);

  if (!data) {
    return null;
  }

  return (
    <div>
      {/* <div data-testid="error">GOT ERROR {error?.message}</div>; */}
      <div data-testid="greeting">GOT DATA {data.text}</div>;
      <button onClick={() => errorMutation.mutate()}>ERROR MUTATION</button>
    </div>
  );
}

const root = ReactDom.createRoot(document.getElementById('react-root')!);

root.render(<App />);
