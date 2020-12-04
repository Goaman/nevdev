import * as fs from "fs";
import * as util from "util";
const close = util.promisify(fs.close);

function getDevice(filepath: fs.PathLike) {
  fs.open(filepath, fs.constants.O_NONBLOCK, (err, fd) => {
    if (err) throw err;
    new Device(fd);
  });
}

class Device {
  fd: number;

  constructor(filedescriptor: number) {
    this.fd = filedescriptor;
  }

  /**
   * Close the file descriptor of this device.
   */
  close() {
    close(this.fd);
  }

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
  grab() {

  }
  /**
   * Ungrab the device.
   *
   * @see grab()
   */
  ungrab() {

  }
}

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



