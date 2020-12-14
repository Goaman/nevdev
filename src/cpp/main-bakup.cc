// #define _GNU_SOURCE /* for asprintf */

#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <fcntl.h>
#include <unistd.h>
#include <dirent.h>
#include <errno.h>
#include <linux/input.h>
#include <linux/uinput.h>
#include <napi.h>
#include <libevdev/libevdev.h>
#include <libevdev/libevdev-uinput.h>
#include "device.h"

#include <iostream>
using namespace std;
using namespace Napi;



#define BITS_PER_LONG (sizeof(long) * 8)
#define NBITS(x) ((((x)-1)/BITS_PER_LONG)+1)
#define OFF(x)  ((x)%BITS_PER_LONG)
#define LONG(x) ((x)/BITS_PER_LONG)
#define test_bit(bit, array)	((array[LONG(bit)] >> OFF(bit)) & 1)

#define DEV_INPUT_EVENT "/dev/input"
#define EVENT_DEV_NAME "event"


void emit(int fd, int type, int code, int val)
{
   struct input_event ie;

   ie.type = type;
   ie.code = code;
   ie.value = val;
   /* timestamp values below are ignored */
   ie.time.tv_sec = 0;
   ie.time.tv_usec = 0;

   write(fd, &ie, sizeof(ie));
}


int is_event_device(const struct dirent *dir) {
	return strncmp(EVENT_DEV_NAME, dir->d_name, 5) == 0;
}



char* scan_devices(void) {
	struct dirent **namelist;
	int i, ndev, devnum;
	char *filename;

	ndev = scandir(DEV_INPUT_EVENT, &namelist, is_event_device, alphasort);
	if (ndev <= 0) {
		return NULL;
	}

	printf("Available devices:\n");

	for (i = 0; i < ndev; i++) {
		char fname[64];
		int fd = -1;
		char name[256] = "???";

		snprintf(fname, sizeof(fname), "%s/%s", DEV_INPUT_EVENT, namelist[i]->d_name);
		fd = open(fname, O_RDONLY);
		if (fd >= 0) {
			ioctl(fd, EVIOCGNAME(sizeof(name)), name);
			close(fd);
		}
		printf("%s:  %s\n", fname, name);
		free(namelist[i]);
	}

	fprintf(stderr, "Select the device event number [0-%d]: ", ndev - 1);
	scanf("%d", &devnum);

	if (devnum >= ndev || devnum < 0) {
		return NULL;
	}

	asprintf(&filename, "%s/%s%d", DEV_INPUT_EVENT, EVENT_DEV_NAME, devnum);
	return filename;
}

static int print_device_info(int fd) {
	int i, j;
	int version;
	unsigned short id[4];
	unsigned long bit[EV_MAX][NBITS(KEY_MAX)];

	if (ioctl(fd, EVIOCGVERSION, &version)) {
		perror("can't get version");
		return 1;
	}
	printf("Input driver version is %d.%d.%d\n", 
	       version >> 16, (version >> 8) & 0xff, version & 0xff);

	ioctl(fd, EVIOCGID, id);
	printf("Input device ID: bus 0x%x vendor 0x%x product 0x%x version 0x%x\n",
		id[ID_BUS], id[ID_VENDOR], id[ID_PRODUCT], id[ID_VERSION]);

	memset(bit, 0, sizeof(bit));
	ioctl(fd, EVIOCGBIT(0, EV_MAX), bit[0]);
	printf("Supported events:\n");
	for (i = 0; i < EV_MAX; i++) {
 		if (test_bit(i, bit[0])) {
			printf("  Event type %d\n", i);
			if (!i) continue;
			ioctl(fd, EVIOCGBIT(i, KEY_MAX), bit[i]);
			for (j = 0; j < KEY_MAX; j++) {
				if (test_bit(j, bit[i])) {
					printf("%d, ", j);
				}
			}
			printf("\n");
		}
	}
	return 0;
}

int print_events(int fd) {
	struct input_event ev;
	unsigned int size;

	printf("Testing ... (interrupt to exit)\n");

	while (1) {
		size = read(fd, &ev, sizeof(struct input_event));

		if (size < sizeof(struct input_event)) {
			printf("expected %u bytes, got %u\n", sizeof(struct input_event), size);
			perror("\nerror reading");
			return EXIT_FAILURE;
		}

		printf("Event: time %ld.%06ld, ", ev.time.tv_sec, ev.time.tv_usec);
		printf("type: %i, code: %i, value: %i\n", ev.type, ev.code, ev.value);
	}
}

int main () {
	int fd, grabbed;
	char *filename;

	if (getuid() != 0) {
		fprintf(stderr, "Not running as root, no devices may be available.\n");
	}

	filename = scan_devices();
	if (!filename) {
		fprintf(stderr, "Device not found\n");
		return EXIT_FAILURE;
	}

	if ((fd = open(filename, O_RDONLY)) < 0) {
		perror("");
		if (errno == EACCES && getuid() != 0) {
			fprintf(stderr, "You do not have access to %s. Try "
					"running as root instead.\n", filename);
		}
		return EXIT_FAILURE;
	}

	free(filename);

	if (print_device_info(fd)) {
		return EXIT_FAILURE;
	}

	grabbed = ioctl(fd, EVIOCGRAB, (void *) 1);
	ioctl(fd, EVIOCGRAB, (void *) 0);
	if (grabbed) {
		printf("This device is grabbed by another process. Try switching VT.\n");
		return EXIT_FAILURE;
	}

	return print_events(fd);
}


Napi::String HelloWorld(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
		// scan_devices();
    Napi::String returnValue = Napi::String::New(env, "hello world");
    return returnValue;
}
Napi::String ScannDevice(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    struct libevdev *dev, *dev2;
    int fd, uinput_fd;

    // fd = open("/dev/input/event12", O_RDONLY);
    // libevdev_new_from_fd(fd);

    Napi::String returnValue = Napi::String::New(env, "should scan devices");
    return returnValue;
}
void ReadDevice(const Napi::CallbackInfo& info) {
	Napi::Env env = info.Env();
	// Napi::Function path = info[0].As<Napi::String>();
	Napi::Function cb = info[1].As<Napi::Function>();

	// print(path)

	struct libevdev *dev, *dev2;
	int fd, uinput_fd;

	struct input_event ev;
	unsigned int size;

	printf("Testing ... (interrupt to exit)\n");

		char typeStr[10];
		char codeStr[10];
		char valueStr[10];


	while (1) {
		size = read(open("/dev/input/event29", O_RDONLY), &ev, sizeof(struct input_event));

		if (size < sizeof(struct input_event)) {
			printf("expected %u bytes, got %u\n", sizeof(struct input_event), size);
			perror("\nerror reading");
			// return EXIT_FAILURE;
		}

		Napi::Object obj = Napi::Object::New(env);

		sprintf(typeStr, "%d", ev.type);
		sprintf(codeStr, "%d", ev.code);
		sprintf(valueStr, "%d", ev.value);

		obj.Set(Napi::String::New(env, "type"), Napi::Number::New(env, ev.type));
		obj.Set(Napi::String::New(env, "code"), Napi::Number::New(env, ev.code));
		obj.Set(Napi::String::New(env, "value"), Napi::Number::New(env, ev.value));

		cb.Call(env.Global(), {obj});

		// printf("Event: time %ld.%06ld, ", ev.time.tv_sec, ev.time.tv_usec);
		// printf("type: %i, code: %i, value: %i\n", ev.type, ev.code, ev.value);
	}

	// fd = open("/dev/input/event12", O_RDONLY);
	// libevdev_new_from_fd(fd);

  //  uint16_t i = 256;

  //  return(0);


	// Napi::String returnValue = Napi::String::New(env, "find a way to return undefined");
	// return returnValue;
}

// Napi::String CreateDevice(const Napi::CallbackInfo& info) {
// 	Napi::Env env = info.Env();
// 	return Napi::String::New(env, "hello world");
// }

Napi::String WriteFunction(const Napi::CallbackInfo& info) {
	Napi::Env env = info.Env();



	return Napi::String::New(env, "hello world");
}

Napi::Function CreateDevice(const Napi::CallbackInfo& info) {
	Napi::Env env = info.Env();

	int err;
	struct libevdev *dev;
	struct libevdev_uinput *uidev;
	dev = libevdev_new();
	libevdev_set_name(dev, "amazingdevic1e1");
	libevdev_enable_event_type(dev, EV_REL);
	libevdev_enable_event_code(dev, EV_REL, REL_X, NULL);
	libevdev_enable_event_code(dev, EV_REL, REL_Y, NULL);
	libevdev_enable_event_type(dev, EV_KEY);
	libevdev_enable_event_code(dev, EV_KEY, KEY_1, NULL);
	libevdev_enable_event_code(dev, EV_KEY, KEY_2, NULL);
	libevdev_enable_event_code(dev, EV_KEY, KEY_3, NULL);
	libevdev_enable_event_code(dev, EV_KEY, KEY_4, NULL);
	libevdev_enable_event_code(dev, EV_KEY, KEY_5, NULL);
	libevdev_enable_event_code(dev, EV_KEY, BTN_LEFT, NULL);
	libevdev_enable_event_code(dev, EV_KEY, BTN_MIDDLE, NULL);
	libevdev_enable_event_code(dev, EV_KEY, BTN_RIGHT, NULL);

	err = libevdev_uinput_create_from_device(dev,
                                         LIBEVDEV_UINPUT_OPEN_MANAGED,
                                         &uidev);
	if (err != 0) { printf("error while creating device %d", err);}

	// err = libevdev_uinput_write_event(uidev, EV_KEY, KEY_1, 1);
	// if (err != 0) { printf("error while KEY_1"); return; }
	// err = libevdev_uinput_write_event(uidev, EV_KEY, KEY_1, 0);
	// if (err != 0) { printf("error while KEY_1"); return; }
	// err = libevdev_uinput_write_event(uidev, EV_SYN, SYN_REPORT, 0);
	// if (err != 0) { printf("error while SYN_REPORT"); return; }

	// auto fn = ;

	// return Napi::Function::New(env, []() {
	// 	printf("writing");
	// }, "theFunction");

	return Napi::Function::New(info.Env(), [uidev] (const Napi::CallbackInfo& info) {

       	//do something...
        // auto target = info[0].As<Object>();
				// auto propertyKey = info[1].As<String>();
				// auto descriptor = info[2].As<Object>();
        // auto backup = descriptor.Get("value").As<Function>();
				printf("should write twice key1\n");

				int err;
				err = libevdev_uinput_write_event(uidev, EV_KEY, KEY_1, 1);
				if (err != 0) { printf("error while KEY_1 down: %d\n", err);}
				err = libevdev_uinput_write_event(uidev, EV_KEY, KEY_1, 0);
				if (err != 0) { printf("error while KEY_1 up: %d \n ", err);}
				err = libevdev_uinput_write_event(uidev, EV_SYN, SYN_REPORT, 0);
				if (err != 0) { printf("error while SYN_REPORT: %d", err); }

        // descriptor.Set("value", Napi::Function::New(env, [backup, descriptor, objectA] (const Napi::CallbackInfo& info) -> Value {
        		// I want to access backup, objectA, but they were already either deleted or changed to something new
        // }

        // return descriptor;
    });


	// sleep(100);

	// libevdev_uinput_destroy(uidev);







	// struct uinput_setup usetup;

  // int fd = open("/dev/uinput", O_WRONLY | O_NONBLOCK);

  //  /*
  //   * The ioctls below will enable the device that is about to be
  //   * created, to pass key events, in this case the space key.
  //   */
  //  ioctl(fd, UI_SET_EVBIT, EV_KEY);
  //  ioctl(fd, UI_SET_KEYBIT, KEY_U);

  //  memset(&usetup, 0, sizeof(usetup));
  //  usetup.id.bustype = BUS_USB;
  //  usetup.id.vendor = 0x1234; /* sample vendor */
  //  usetup.id.product = 0x5678; /* sample product */
  //  strcpy(usetup.name, "Example device");

  //  ioctl(fd, UI_DEV_SETUP, &usetup);
  //  ioctl(fd, UI_DEV_CREATE);

  //  /*
  //   * On UI_DEV_CREATE the kernel will create the device node for this
  //   * device. We are inserting a pause here so that userspace has time
  //   * to detect, initialize the new device, and can start listening to
  //   * the event, otherwise it will not notice the event we are about
  //   * to send. This pause is only needed in our example code!
  //   */
	// printf("print something\n");
  //  sleep(1);
	// printf("after a sec\n");

  //  /* Key press, report the event, send key release, and report again */
  //  emit(fd, EV_KEY, KEY_U, 1);
  //  emit(fd, EV_SYN, SYN_REPORT, 0);
  //  emit(fd, EV_KEY, KEY_U, 0);
  //  emit(fd, EV_SYN, SYN_REPORT, 0);
	// printf("should print key space\n");
  //  sleep(1);
	// printf("after a sec\n");
  //  emit(fd, EV_KEY, KEY_U, 1);
  //  emit(fd, EV_SYN, SYN_REPORT, 0);
  //  emit(fd, EV_KEY, KEY_U, 0);
  //  emit(fd, EV_SYN, SYN_REPORT, 0);
	// printf("should print key space\n");
  //  sleep(1);
	// printf("after a sec\n");
  //  emit(fd, EV_KEY, KEY_U, 1);
  //  emit(fd, EV_SYN, SYN_REPORT, 0);
  //  emit(fd, EV_KEY, KEY_U, 0);
  //  emit(fd, EV_SYN, SYN_REPORT, 0);
	// printf("should print key space\n");
  //  sleep(100);
	// printf("after a sec\n");

  //  /*
  //   * Give userspace some time to read the events before we destroy the
  //   * device with UI_DEV_DESTOY.
  //   */

  //  ioctl(fd, UI_DEV_DESTROY);
  //  close(fd);

  //  return 0;

	// Napi::Function fn = Napi::Function::New(env, WriteFunction, "theFunction");
  // return fn;
}

Napi::Object UInputInit(Napi::Env env, Napi::Object exports) {



  return exports;
}


Napi::Object Init(Napi::Env env, Napi::Object exports) {
	exports.Set("createDevice", Napi::Function::New(env, CreateDevice));

	// -------------------------------------------------------------------------
	// Evdev
	// -------------------------------------------------------------------------

	// -------------------------------------------------------------------------
	// Evdev Uinput
	// -------------------------------------------------------------------------

  exports.Set("libevdev_new", Napi::Function::New(env, [](const Napi::CallbackInfo& info){
		return Napi::External<struct libevdev>::New(info.Env(),
			libevdev_new()
		);
  }));
  exports.Set("libevdev_new_from_fd", Napi::Function::New(env, [](const Napi::CallbackInfo& info){
		struct libevdev *libevdev;
		libevdev_new_from_fd(
			info[0].As<Napi::Number>().Int64Value(),
			&libevdev
		);
		return Napi::External<struct libevdev>::New(info.Env(), libevdev);
  }));
  exports.Set("libevdev_get_name", Napi::Function::New(env, [](const Napi::CallbackInfo& info){
		const char* name = libevdev_get_name(
			info[0].As<Napi::External<struct libevdev>>().Data()
		);
		return Napi::String::New(info.Env(), name);
  }));

  exports.Set("libevdev_set_name", Napi::Function::New(env, [](const Napi::CallbackInfo& info){
		const string name = info[1].As<Napi::String>();
		libevdev_set_name(
			info[0].As<Napi::External<struct libevdev>>().Data(),
			&name[0]
		);
  }));
  exports.Set("libevdev_enable_event_type", Napi::Function::New(env, [](const Napi::CallbackInfo& info){
		libevdev_enable_event_type(
			info[0].As<Napi::External<struct libevdev>>().Data(),
			(unsigned int) info[1].As<Napi::Number>().Int64Value()
		);
  }));
  exports.Set("libevdev_enable_event_code", Napi::Function::New(env, [](const Napi::CallbackInfo& info){
		libevdev_enable_event_code(
			info[0].As<Napi::External<struct libevdev>>().Data(),
			(unsigned int) info[1].As<Napi::Number>().Int64Value(),
			(unsigned int) info[2].As<Napi::Number>().Int64Value(),
			info[3].As<Napi::External<void *>>().Data()
		);
  }));
  // exports.Set("libevdev_uinput_create_from_device", Napi::Function::New(env, [](const Napi::CallbackInfo& info){
	// 	return Napi::Number::New(info.Env(),
	// 		libevdev_uinput_create_from_device(
	// 			info[0].As<Napi::External<struct libevdev>>().Data(),
	// 			(unsigned int) info[1].As<Napi::Number>().Int64Value(),
	// 			info[2].As<Napi::External<struct libevdev_uinput*>>().Data()
	// 		)
	// 	);
  // }));
  exports.Set("libevdev_uinput_create_from_device", Napi::Function::New(env, [](const Napi::CallbackInfo& info){
		struct libevdev_uinput *libevdev_uinput;
		libevdev_uinput_create_from_device(
			info[0].As<Napi::External<struct libevdev>>().Data(),
			(unsigned int) info[1].As<Napi::Number>().Int64Value(),
			&libevdev_uinput
		);
		return Napi::External<struct libevdev_uinput>::New(info.Env(),
			libevdev_uinput
		);
  }));
  exports.Set("libevdev_uinput_write_event", Napi::Function::New(env, [](const Napi::CallbackInfo& info){
		return Napi::Number::New(info.Env(),
			libevdev_uinput_write_event(
				info[0].As<Napi::External<struct libevdev_uinput>>().Data(),
				(unsigned int) info[1].As<Napi::Number>().Int64Value(),
				(unsigned int) info[2].As<Napi::Number>().Int64Value(),
				(int) info[3].As<Napi::Number>().Int64Value()
			)
		);
  }));

  exports.Set("makename", Napi::Function::New(env, [](const Napi::CallbackInfo& info){
		int err;
		struct libevdev *dev;
		struct libevdev_uinput *uidev;
		dev = libevdev_new();
		libevdev_set_name(dev, "this is as name");
		libevdev_enable_event_type(dev, EV_REL);
		libevdev_enable_event_code(dev, EV_REL, REL_X, NULL);
		libevdev_enable_event_code(dev, EV_REL, REL_Y, NULL);
		libevdev_enable_event_type(dev, EV_KEY);
		libevdev_enable_event_code(dev, EV_KEY, KEY_1, NULL);
		libevdev_enable_event_code(dev, EV_KEY, KEY_2, NULL);
		libevdev_enable_event_code(dev, EV_KEY, KEY_3, NULL);
		libevdev_enable_event_code(dev, EV_KEY, KEY_4, NULL);
		libevdev_enable_event_code(dev, EV_KEY, KEY_5, NULL);
		libevdev_enable_event_code(dev, EV_KEY, BTN_LEFT, NULL);
		libevdev_enable_event_code(dev, EV_KEY, BTN_MIDDLE, NULL);
		libevdev_enable_event_code(dev, EV_KEY, BTN_RIGHT, NULL);
		err = libevdev_uinput_create_from_device(dev,
																					LIBEVDEV_UINPUT_OPEN_MANAGED,
																					&uidev);
  }));

	// -------------------------------------------------------------------------
	// Utils
	// -------------------------------------------------------------------------

  exports.Set("NULL", Napi::External<void *>::New(env, NULL));

	return exports;
}


Napi::Object InitAll(Napi::Env env, Napi::Object exports) {
  return Init(env, exports);
  // return ClassExample::Init(env, exports);
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, InitAll)
