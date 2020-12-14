import * as fs from 'fs';
import * as util from 'util';
const close = util.promisify(fs.close);

// function getDevice(filepath: fs.PathLike) {
//   fs.open(filepath, fs.constants.O_NONBLOCK, (err, fd) => {
//     if (err) throw err;
//     new Device(fd);
//   });
// }
