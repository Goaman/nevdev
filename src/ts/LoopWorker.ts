import * as fs from 'fs';
import { promisify } from 'util';
import { nextEventLoop, ReadFlag, NevEvent } from './Device';
const addon = require('../../build/Release/nevdev.node');
import { parentPort, workerData } from 'worker_threads';
// parentPort.once('message', (...message: any[]) => {
//   console.log('message:', message);
// });

const open = promisify(fs.open);
const readdir = promisify(fs.readdir);

const fd = workerData;

(async (): Promise<never> => {
  console.log('fd:', fd);
  console.log('typeof fd:', typeof fd);
  const dev = addon.libevdev_new_from_fd(fd);
  console.log('startig loop');
  while (true) {
    const event: NevEvent = addon.libevdev_next_event(dev, ReadFlag.BLOCKING);
    parentPort.postMessage(`${event.type}:${event.code}:${event.value}`);

    await nextEventLoop();
  }
})();
