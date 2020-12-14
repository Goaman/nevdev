import { EventEmitter } from 'events';
import * as fs from 'fs';
import { promisify } from 'util';
import { eventTypes, constants } from './map';
const open = promisify(fs.open);
const readdir = promisify(fs.readdir);
import { Worker } from 'worker_threads';
import * as path from 'path';

const addon = require('../../build/Release/nevdev.node');

enum GrabMode {
  /**
   * Grab the device if not currently grabbed
   */
  GRAB = 3,
  /**
   * Ungrab the device if currently grabbed
   */
  UNGRAB = 4,
}

export enum ReadFlag {
  SYNC = 1 /**< Process data in sync mode */,
  NORMAL = 2 /**< Process data in normal mode */,
  FORCE_SYNC = 4 /**< Pretend the next event is a SYN_DROPPED and
					          require the caller to sync */,
  BLOCKING = 8 /**< The fd is not in O_NONBLOCK and a read may block */,
}

export interface NevEvent {
  type: number;
  code: number;
  value: number;
}

export type WriteFuntion = (event: NevEvent) => void;
export type CreateDeviceFunction = () => WriteFuntion;

export const nextEventLoop = () => new Promise((resolve) => setTimeout(resolve, 10));

export const createDevice: CreateDeviceFunction = addon.createDevice;

// const dev = addon.libevdev_new();
// addon.libevdev_set_name(dev, 'This is my device!!!');
// supportEverything(dev);
// const udev = addon.libevdev_uinput_create_from_device(dev, -2);

// console.log('udev:', udev);
// console.log('should set the name');

// (async () => {
//   const files = await readdir('/dev/input');
//   for (const file of files) {
//     if (file.startsWith('event')) {
//       const filepath = `/dev/input/${file}`;
//       const fd = await open(filepath, 'r');
//       const dev = addon.libevdev_new_from_fd(fd);
//       const name = addon.libevdev_get_name(dev);
//       console.log(filepath, ':', name);
//     }
//   }
// })();

// fs.open('/dev/input/event29', 'r', (err, fd) => {
//   if (err) throw err;
// });

const inputDirPath = '/dev/input';

export class UInput {
  // private _fd: number;
  private _dev: any;
  private _udev: any;

  constructor(name: string) {
    this._dev = addon.libevdev_new();
    this.supportKeyboards();
    addon.libevdev_set_name(this._dev, name);
    this._udev = addon.libevdev_uinput_create_from_device(this._dev, -2);
    // setInterval(() => {
    //   // console.log(
    //   //   'udev, constants.EV_KEY, constants.KEY_1, 1:',
    //   //   udev,
    //   //   constants.EV_KEY,
    //   //   constants.KEY_1,
    //   //   1,1
    //   // );
    //   console.log('should type 1');
    //   addon.libevdev_uinput_write_event(this._udev, constants.EV_KEY, constants.KEY_1, 1);
    //   addon.libevdev_uinput_write_event(this._udev, constants.EV_KEY, constants.KEY_1, 0);
    //   addon.libevdev_uinput_write_event(this._udev, constants.EV_SYN, constants.SYN_REPORT, 1);
    // }, 1000);
  }
  write(event: NevEvent): void {
    addon.libevdev_uinput_write_event(this._udev, event.type, event.code, event.value);
  }
  sync(): void {
    // console.log('test', { type: constants.EV_SYN, code: constants.SYN_REPORT, value: 0 });
    this.write({ type: constants.EV_SYN, code: constants.SYN_REPORT, value: 0 });
  }
  supportEverything(): void {
    for (const [eventTypeCode, eventInfo] of Object.entries(eventTypes)) {
      const eventTypeCodeNumber = parseInt(eventTypeCode);
      addon.libevdev_enable_event_type(this._dev, eventTypeCodeNumber);
      for (const eventCode of Object.keys(eventInfo.events)) {
        const eventCodeNumber = parseInt(eventCode);
        addon.libevdev_enable_event_code(
          this._dev,
          eventTypeCodeNumber,
          eventCodeNumber,
          addon.NULL,
        );
      }
    }
  }
  supportKeyboards(): void {
    // addon.libevdev_set_id_vendor(this._dev, 1);
    // addon.libevdev_set_id_product(this._dev, 2);
    // addon.libevdev_set_id_version(this._dev, 2);
    // addon.libevdev_set_id_bustype(this._dev, 4);

    addon.libevdev_enable_event_type(this._dev, constants.EV_FF);
    for (const [constant, value] of Object.entries(constants)) {
      addon.libevdev_enable_event_type(this._dev, constants.EV_KEY);
      if (constant.startsWith('KEY_')) {
        console.log('constants:', constants);
        console.log('libevdev_enable_event_code:', this._dev, constants.EV_KEY, value, addon.NULL);
        addon.libevdev_enable_event_code(this._dev, constants.EV_KEY, value, addon.NULL);
      }
    }
    // addon.libevdev_enable_event_code(this._dev, constants.EV_KEY, constants.KEY_1, addon.NULL);
    // addon.libevdev_enable_event_code(this._dev, constants.EV_KEY, constants.KEY_2, addon.NULL);
    // addon.libevdev_enable_event_code(this._dev, constants.EV_KEY, constants.KEY_3, addon.NULL);
    // addon.libevdev_enable_event_code(this._dev, constants.EV_KEY, constants.KEY_4, addon.NULL);
    // addon.libevdev_enable_event_code(this._dev, constants.EV_KEY, constants.KEY_5, addon.NULL);
  }
}

type EventCallback = (event: NevEvent) => void;

const _grabbedDevices: Set<Device> = new Set();

export class Device {
  private _fd: number;
  private _dev: any;
  private _emitter: EventEmitter;

  static async create(identifiable: string): Promise<Device> {
    const fd = await open(identifiable, 'r');
    return new Device(fd);
  }
  static all() {
    for (const file of fs.readdirSync(inputDirPath)) {
      console.log('file', file);
    }
  }

  constructor(fd: number) {
    this._fd = fd;
    this._dev = addon.libevdev_new_from_fd(fd);
    this._emitter = new EventEmitter();
    this.loop();
  }

  get name(): string {
    return addon.libevdev_get_name(this._fd);
  }
  set name(value: string) {
    addon.libevdev_set_name(this._fd, value);
  }
  get phys(): string {
    return addon.libevdev_get_phys(this._fd);
  }
  set phys(value: string) {
    addon.libevdev_set_phys(this._fd, value);
  }
  get uniq(): string {
    return addon.libevdev_get_uniq(this._fd);
  }
  set uniq(value: string) {
    addon.libevdev_set_uniq(this._fd, value);
  }
  get id_product(): number {
    return addon.libevdev_get_id_product(this._fd);
  }
  set id_product(value: number) {
    addon.libevdev_set_id_product(this._fd, value);
  }
  get id_vendor(): number {
    return addon.libevdev_get_id_vendor(this._fd);
  }
  set id_vendor(value: number) {
    addon.libevdev_set_id_vendor(this._fd, value);
  }
  get id_bustype(): number {
    return addon.libevdev_get_id_bustype(this._fd);
  }
  set id_bustype(value: number) {
    addon.libevdev_set_id_bustype(this._fd, value);
  }
  get id_version(): number {
    return addon.libevdev_get_id_version(this._fd);
  }
  set id_version(value: number) {
    addon.libevdev_set_id_version(this._fd, value);
  }
  get driver_version(): number {
    return addon.libevdev_get_driver_version(this._fd);
  }

  async loop(): Promise<void> {
    setInterval(() => console.log('interval'), 1000);

    // (async () => {
    // const fd = await open('/dev/input/event28', 'r');
    //   const dev = addon.libevdev_new_from_fd(fd);
    //   // eslint-disable-next-line no-constant-condition
    //   while (true) {
    //     const event: NevEvent = addon.libevdev_next_event(dev, ReadFlag.BLOCKING);
    //     console.log('event:', event);
    //     // this._emitter.emit('event', event);
    //     await nextEventLoop();
    //   }
    // })();

    const worker = new Worker(path.join(__dirname, '../../build-ts/js/LoopWorker.js'), {
      workerData: this._fd,
    });
    worker.on('message', (message) => {
      const [type, code, value] = message.split(':');
      const event: NevEvent = {
        type: parseInt(type),
        code: parseInt(code),
        value: parseInt(value),
      };
      this._emitter.emit('event', event);
    });
    // worker.postMessage('init', ['foo']);uu

    // addon.read_device_worker(this._dev, (...args: any[]) => {
    //   console.log('callback called with:', args);
    // });

    // eslint-disable-next-line no-constant-condition
    // while (true) {
    //   const event: NevEvent = addon.libevdev_next_event(this._dev, ReadFlag.BLOCKING);
    //   this._emitter.emit('event', event);
    //   await nextEventLoop();
    // }
  }

  /**
   * Close the file descriptor of this device.
   */
  // close() {
  //   evdev_close(this._fd);
  // }

  /**
   *  Grab or ungrab the device through a kernel EVIOCGRAB. This prevents other
   * clients (including kernel-internal ones such as rfkill) from receiving
   * events from this device.
   *
   * This is generally a bad idea. Don't do this.
   *
   * Grabbing an already grabbed device, or ungrabbing an ungrabbed device is
   * a noop and always succeeds.
   *
   * A grab is an operation tied to a file descriptor, not a device. If a
   * client changes the file descriptor with libevdev_change_fd(), it must
   * also re-issue a grab with libevdev_grab().
   */
  grab(): void {
    addon.libevdev_grab(this._dev, GrabMode.GRAB);
    _grabbedDevices.add(this);
  }
  /**
   * Ungrab the device.
   *
   * @see grab()
   */
  ungrab(): void {
    addon.libevdev_grab(this._dev, GrabMode.UNGRAB);
    _grabbedDevices.delete(this);
  }

  on(eventName: string, callback: EventCallback): void {
    this._emitter.on(eventName, callback);
  }
  off(eventName: string, callback: EventCallback): void {
    this._emitter.off(eventName, callback);
  }
}

// Begin reading from stdin so the process does not exit.
process.stdin.resume();

// process.on('SIGINT', () => {});

// Using a single function to handle multiple signals
function handle(signal: any) {
  console.log('_grabbedDevices:', _grabbedDevices);
  for (const device of _grabbedDevices) {
    device.ungrab();
  }
  process.exit();
}

process.on('SIGINT', handle);
process.on('SIGTERM', handle);
