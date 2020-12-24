import { ReadFlag, EvdevEvent } from './Device';
const addon = require('../../build/Release/nevdev.node');
import { parentPort, workerData } from 'worker_threads';

const nextEventLoop = (): Promise<void> => new Promise((resolve) => setImmediate(resolve));

if (typeof workerData !== 'number') {
  throw new Error(
    'The data provided for the event worker must be a number representing the file descriptor to read from.',
  );
}
const fd: number = workerData;

(async (): Promise<never> => {
  const dev = addon.libevdev_new_from_fd(fd);
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const event: EvdevEvent = addon.libevdev_next_event(dev, ReadFlag.BLOCKING);
    parentPort.postMessage(`${event.type}:${event.code}:${event.value}:${event.sec}:${event.usec}`);

    await nextEventLoop();
  }
})();
