import { exposeElectronTRPC } from '@janwirth/electron-trpc-link/main';

process.once('loaded', async () => {
  exposeElectronTRPC();
});
