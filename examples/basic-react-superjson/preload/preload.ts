import { exposeElectronTRPC } from '../../../packages/electron-trpc-link/dist/main';

process.once('loaded', async () => {
  exposeElectronTRPC();
});
