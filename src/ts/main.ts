// import * as map from './map';

import * as fs from 'fs';
import { promisify } from 'util';
import { Device, UInput, nextEventLoop, NevEvent } from './Device';
import { constants, eventTypes, eventDefinitions } from './map';

// const addon = require('../../build/Release/nevdev.node');

export { Device, constants, eventTypes };

// const open = promisify(fs.open);
// const readdir = promisify(fs.readdir);

// (async () => {
//   const device = await Device.create('/dev/input/event28');
//   // device.grab();
//   // device.ungrab();
//   const uinput = new UInput('amazing device2');
//   device.on('event', async (event) => {
//     console.log('should write twiceevent:', event);
//     // setTimeout(()=>{

//     // uinput.write({
//     //   type: constants.EV_KEY,
//     //   code: event.code + 1,
//     //   value: 1,
//     // });
//     // uinput.sync();
//     // uinput.write({
//     //   type: constants.EV_KEY,
//     //   code: event.code + 1,
//     //   value: 0,
//     // });
//     // uinput.sync();
//     // })
//     // setTimeout
//     // const otherEvent: NevEvent = {
//     //   type: constants.EV_KEY,
//     //   code: constants.KEY_5,
//     //   value: 1,
//     // };
//     // uinput.write(otherEvent);
//     // uinput.sync();
//     // const otherEvent2: NevEvent = {
//     //   type: constants.EV_KEY,
//     //   code: constants.KEY_5,
//     //   value: 0,
//     // };
//     // uinput.write(otherEvent2);
//     // uinput.sync();

//     // uinput.write(event);
//     // uinput.sync();
//     // uinput.write(event);
//     // uinput.sync();
//     // uinput.write(event);
//     // uinput.sync();
//     await nextEventLoop();

//     // uinput.write(event);
//     // uinput.sync();
//     // uinput.write(event);
//     // uinput.sync();
//     // uinput.write(event);
//     // uinput.sync();
//     // uinput.write(event);
//     // uinput.sync();
//     // uinput.write(event);
//     // uinput.sync();
//   });
// })();

// // export async function listDevices(): string[] {
// //   const files = await readdir('/dev/input');
// //   const names: string[] = [];
// //   for (const file of files) {
// //     if (file.startsWith('event')) {
// //       const filepath = `/dev/input/${file}`;
// //       const fd = await open(filepath, 'r');
// //       const dev = addon.libevdev_new_from_fd(fd);
// //       const name = addon.libevdev_get_name(dev);
// //       console.log(filepath, ':', name);
// //     }
// //   }
// // }

// // export async function isDevice(path: string): boolean {
// //   throw new Error('to implement');
// // }

// // addon.makename();
// // addon.makename();

// // setInterval(() => {
// //   // console.log(
// //   //   'udev, constants.EV_KEY, constants.KEY_1, 1:',
// //   //   udev,
// //   //   constants.EV_KEY,
// //   //   constants.KEY_1,
// //   //   1,1
// //   // );
// //   console.log('should type 1');
// //   // addon.libevdev_uinput_write_event(udev, constants.EV_KEY, constants.KEY_1, 1);
// //   // addon.libevdev_uinput_write_event(udev, constants.EV_KEY, constants.KEY_1, 0);
// //   // addon.libevdev_uinput_write_event(udev, constants.EV_SYN, constants.SYN_REPORT, 1);
// // }, 1000);
