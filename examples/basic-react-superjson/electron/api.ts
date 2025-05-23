import z from 'zod';
import { initTRPC } from '@trpc/server';
import { observable } from '@trpc/server/observable';
import { EventEmitter } from 'events';
import superjson from 'superjson';

const ee = new EventEmitter();

const t = initTRPC.create({ isServer: true, transformer: superjson });

export const router = t.router({
  greeting: t.procedure.input(z.object({ name: z.string() })).query(req => {
    const { input } = req;

    setTimeout(() => {
      ee.emit('greeting', `Greeted ${input.name}`);
    }, 1000);

    return {
      text: `Hello ${input.name}` as const,
    };
  }),
  subscription: t.procedure.subscription(() => {
    console.log('subscription');
    return observable(emit => {
      function onGreet(text: string) {
        emit.next({ text: new Date() });
        emit.next({ text });
      }

      ee.on('greeting', onGreet);

      return () => {
        ee.off('greeting', onGreet);
      };
    });
  }),
  subscription2: t.procedure.subscription(async function* () {
    yield { text: new Set([1, 2, 3]) };
    yield { text: new Date() };
    yield { text: 'WASSUP' };
    yield { text: 'WASSUP2' };
    yield { text: new Error('ERRORRRR') };
  }),
});

export type AppRouter = typeof router;
