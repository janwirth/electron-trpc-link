import z from 'zod';
import { initTRPC } from '@trpc/server';
import { observable } from '@trpc/server/observable';
import { EventEmitter } from 'events';

const ee = new EventEmitter();

const t = initTRPC.create({ isServer: true });

export const router = t.router({
  greeting: t.procedure.input(z.object({ name: z.string() })).query(req => {
    const { input } = req;
    setTimeout(() => {
      ee.emit('greeting', `Greeted ${input.name}`);
      console.log('greeting', `Greeted ${input.name}`);
    }, 1000);

    return {
      text: `Hello ${input.name}` as const,
    };
  }),
  subscription2: t.procedure.subscription(() => {
    return observable(emit => {
      function onGreet(text: string) {
        console.log('greeting', text);
        emit.next({ text });
      }

      ee.on('greeting', onGreet);

      return () => {
        ee.off('greeting', onGreet);
      };
    });
  }),
  subscription: t.procedure.subscription(async function* () {
    yield { text: 'WASSUP' };
    yield { text: 'WASSUP2' };
  }),
});

export type AppRouter = typeof router;
