import { EventEmitter } from 'events';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { Worker } from 'worker_threads';
import { eventCodes, eventMap } from './eventMap';

const addon = require('../../build/Release/nevdev.node');

const open = promisify(fs.open);

/**
 * Libevdev grab constants (LIBEVDEV_GRAB and LIBEVDEV_UNGRAB).
 */
enum GrabMode {
  /**
   * Grab the device if not currently grabbed.
   */
  GRAB = 3,
  /**
   * Ungrab the device if currently grabbed.
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

/**
 * Equivalent to struct input_event defined in /usr/include/linux/input.h.
 */
export interface EvdevEvent {
  /**
   * The seconds at with the event has been made.
   */
  sec?: number;
  /**
   * The microseconds at with the event has been made.
   */
  usec?: number;
  /**
   * The type of event as defined in /usr/include/linux/input-event-codes.h
   * (e.g. EV_KEY, EV_SYN, ...)
   */
  type: number;
  /**
   * The code of event (e.g. KEY_A, BTN_LEFT, ...)
   */
  code: number;
  /**
   * The value which the meaning is relative to the type and code of the event.
   */
  value: number;
}

const defaultInputDirPath = '/dev/input';

export class UInput {
  private _dev: any;
  private _udev: any;

  constructor(name: string) {
    this._dev = addon.libevdev_new();
    this.supportKeyboards();
    // this.supporMouses();
    addon.libevdev_set_name(this._dev, name);
    this._udev = addon.libevdev_uinput_create_from_device(this._dev, -2);
  }
  write(event: EvdevEvent): void {
    addon.libevdev_uinput_write_event(this._udev, event.type, event.code, event.value);
  }
  sync(): void {
    this.write({ type: eventCodes.EV_SYN, code: eventCodes.SYN_REPORT, value: 0 });
  }
  enableEventType(type: number): void {
    addon.libevdev_enable_event_type(this._dev, type);
  }
  enableEventCode(type: number, code: number, data = addon.NULL): void {
    addon.libevdev_enable_event_code(this._dev, type, code, addon.NULL);
  }
  supportKeyboards(): void {
    this.enableEventType(eventCodes.EV_KEY);
    for (const [constant, value] of Object.entries(eventCodes)) {
      if (constant.startsWith('KEY_') || constant.startsWith('BTN_')) {
        this.enableEventCode(eventCodes.EV_KEY, value as number, addon.NULL);
      }
    }
  }
  // supporMouses(): void {
  //   // this.enableEventType(eventCodes.EV_FF);
  //   this.enableEventType(eventCodes.EV_REL);
  //   for (const [constant, value] of Object.entries(eventCodes)) {
  //     if (constant.startsWith('REL_')) {
  //       this.enableEventCode(eventCodes.EV_REL, value as number, addon.NULL);
  //     }
  //   }
  //   this.enableEventType(eventCodes.EV_MSC);
  //   this.enableEventCode(eventCodes.EV_MSC, eventCodes.MSC_SCAN, addon.NULL);
  // }
}

type EventCallback = (event: EvdevEvent) => void;

export class Device {
  static grabbedDevices: Set<Device> = new Set();

  private _fd: number;
  private _dev: any;
  private _emitter: EventEmitter;
  private _listening = false;
  private _worker: Worker;

  static async create(identifiable: string): Promise<Device> {
    const fd = await open(identifiable, 'r');
    return new Device(fd);
  }
  static all(): Promise<Device[]> {
    return Promise.all(
      fs
        .readdirSync(defaultInputDirPath)
        .filter(
          (filename) => filename.startsWith('event'),
          // fs.accessSync(`${inputDirPath}/${filename}`, fs.constants.R_OK),
        )
        .map((filename) => `${defaultInputDirPath}/${filename}`)
        .filter((filepath) => {
          let readable = false;
          try {
            fs.accessSync(filepath, fs.constants.R_OK);
            readable = true;
          } catch (e) {
            console.warn('impossible` to access file ', filepath);
          }
          return readable;
        })
        .map((filepath) => Device.create(filepath)),
    );
  }

  constructor(fd: number) {
    this._fd = fd;
    this._dev = addon.libevdev_new_from_fd(fd);
    this._emitter = new EventEmitter();
    // this.loop();
  }

  get name(): string {
    return addon.libevdev_get_name(this._dev);
  }
  set name(value: string) {
    addon.libevdev_set_name(this._dev, value);
  }
  get phys(): string {
    return addon.libevdev_get_phys(this._dev);
  }
  set phys(value: string) {
    addon.libevdev_set_phys(this._dev, value);
  }
  get uniq(): string {
    return addon.libevdev_get_uniq(this._dev);
  }
  set uniq(value: string) {
    addon.libevdev_set_uniq(this._dev, value);
  }
  get id_product(): number {
    return addon.libevdev_get_id_product(this._dev);
  }
  set id_product(value: number) {
    addon.libevdev_set_id_product(this._dev, value);
  }
  get id_vendor(): number {
    return addon.libevdev_get_id_vendor(this._dev);
  }
  set id_vendor(value: number) {
    addon.libevdev_set_id_vendor(this._dev, value);
  }
  get id_bustype(): number {
    return addon.libevdev_get_id_bustype(this._dev);
  }
  set id_bustype(value: number) {
    addon.libevdev_set_id_bustype(this._dev, value);
  }
  get id_version(): number {
    return addon.libevdev_get_id_version(this._dev);
  }
  set id_version(value: number) {
    addon.libevdev_set_id_version(this._dev, value);
  }
  get driver_version(): number {
    return addon.libevdev_get_driver_version(this._dev);
  }
  free() {
    return addon.libevdev_free(this._dev);
  }

  listen(): void {
    if (this._listening) return;
    this._listening = true;
    this._worker = new Worker(path.join(__dirname, '../../build-ts/js/EventWorker.js'), {
      workerData: this._fd,
    });
    this._worker.on('message', (message) => {
      const [type, code, value] = message.split(':');
      const event: EvdevEvent = {
        type: parseInt(type),
        code: parseInt(code),
        value: parseInt(value),
      };
      this._emitter.emit('event', event);
    });
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
    Device.grabbedDevices.add(this);
  }
  /**
   * Ungrab the device.
   *
   * @see grab()
   */
  ungrab(): void {
    addon.libevdev_grab(this._dev, GrabMode.UNGRAB);
    Device.grabbedDevices.delete(this);
  }

  onEvent(callback: EventCallback): void {
    this._emitter.on('event', callback);
  }
  removeAllListeners(): void {
    this._emitter.removeAllListeners('event');
  }
  terminate() {
    this._worker.terminate();
  }
  // capabilities() {}
  // activeKeys() {}
  // leds() {}
  // setLed() {}
}

// Begin reading from stdin so the process does not exit.
process.stdin.resume();

// process.on('SIGINT', () => {});

// Using a single function to handle multiple signals
