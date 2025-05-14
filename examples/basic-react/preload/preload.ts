import { exposeElectronTRPC } from '../../../packages/electron-trpc-link/src/main';

process.once('loaded', async () => {
  exposeElectronTRPC();
});
