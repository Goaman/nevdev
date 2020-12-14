// #define _GNU_SOURCE /* for asprintf */

#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <iostream>
#include <fcntl.h>
#include <unistd.h>
#include <dirent.h>
#include <errno.h>
#include <thread>
#include <linux/input.h>
#include <linux/uinput.h>
#include <napi.h>
#include <libevdev/libevdev.h>
#include <libevdev/libevdev-uinput.h>
#include "device.h"

using namespace std;


#define BITS_PER_LONG (sizeof(long) * 8)
#define NBITS(x) ((((x)-1)/BITS_PER_LONG)+1)
#define OFF(x)  ((x)%BITS_PER_LONG)
#define LONG(x) ((x)/BITS_PER_LONG)
#define test_bit(bit, array)	((array[LONG(bit)] >> OFF(bit)) & 1)

#define DEV_INPUT_EVENT "/dev/input"
#define EVENT_DEV_NAME "event"

using namespace Napi;




constexpr size_t ARRAY_LENGTH = 10;

// Data structure representing our thread-safe function context.
struct TsfnContext {

  TsfnContext(Napi::Env env) {
		// deferred(Napi::Promise::Deferred::New(env));
    for (size_t i = 0; i < ARRAY_LENGTH; ++i)
      ints[i] = i;
  };

  // Native Promise returned to JavaScript
  // Napi::Promise::Deferred deferred;

	struct libevdev *dev;

  // Native thread
  std::thread nativeThread;

  // Some data to pass around
  int ints[ARRAY_LENGTH];

  Napi::ThreadSafeFunction tsfn;
};

// The thread entry point. This takes as its arguments the specific
// threadsafe-function context created inside the main thread.
void threadEntry(TsfnContext *context);

// The thread-safe function finalizer callback. This callback executes
// at destruction of thread-safe function, taking as arguments the finalizer
// data and threadsafe-function context.
void FinalizerCallback(Napi::Env env, void *finalizeData, TsfnContext *context);

// The thread entry point. This takes as its arguments the specific
// threadsafe-function context created inside the main thread.
void threadEntry(TsfnContext *context) {

  // This callback transforms the native addon data (int *data) to JavaScript
  // values. It also receives the treadsafe-function's registered callback, and
  // may choose to call it.
  auto callback = [](Napi::Env env, Napi::Function jsCallback, input_event *ev) {
    Napi::Object object = Napi::Object::New(env);
    object.Set("type", Napi::Number::New(env, ev->type));
    object.Set("code", Napi::Number::New(env, ev->code));
    object.Set("value", Napi::Number::New(env, ev->value));
    jsCallback.Call({object});
  };
  // auto callback2 = [](Napi::Env env, Napi::Function jsCallback, libevdev *dev) {
  //   Napi::Object object = Napi::Object::New(env);
  //   object.Set("type", Napi::Number::New(env, ev->type));
  //   object.Set("code", Napi::Number::New(env, ev->code));
  //   object.Set("value", Napi::Number::New(env, ev->value));
  //   jsCallback.Call({object});
  // };

  // struct input_event ev = {
  //   type: 0,
  //   code: 0,
  //   value: 0,
  // };

  // napi_status status = context->tsfn.BlockingCall(
  //   &ev,
  //   callback
  // );

  // if (status != napi_ok) {
  //   Napi::Error::Fatal("ThreadEntry", "Napi::ThreadSafeNapi::Function.BlockingCall() failed");
  // }

  int fd = libevdev_get_fd(context->dev);

  int rc;
  do {
    printf("callingme %d", fd);
    struct input_event ev;
    rc = libevdev_next_event(context->dev, LIBEVDEV_READ_FLAG_NORMAL, &ev);
    rc = 50;
    if (rc == 0) {
      printf("Event: %s %s %d\n",
            libevdev_event_type_get_name(ev.type),
            libevdev_event_code_get_name(ev.type, ev.code),
            ev.value);
      napi_status status = context->tsfn.BlockingCall(
        &ev,
        callback
      );

      if (status != napi_ok) {
        Napi::Error::Fatal("ThreadEntry", "Napi::ThreadSafeNapi::Function.BlockingCall() failed");
      }
    }
  } while (rc == 1 || rc == 0 || rc == -EAGAIN);

	// Napi::Object object = Napi::Object::New(info.Env());
	// if (rc == 0) {
	// 	object.Set("type", ev.type);
	// 	object.Set("code", ev.code);
	// 	object.Set("value", ev.value);
	// } else {
	// 	object.Set("error", 1);
	// }
	// return object;


  // for (size_t index = 0; index < ARRAY_LENGTH; ++index) {
  //   // Perform a call into JavaScript.
  //   napi_status status =
  //       context->tsfn.BlockingCall(&ev, callback);

  //   if (status != napi_ok) {
  //     Napi::Error::Fatal("ThreadEntry", "Napi::ThreadSafeNapi::Function.BlockingCall() failed");
  //   }

	// 	// Perform a call into JavaScript.
  //   status =
  //       context->tsfn.BlockingCall(&context->ints[index], callback);

  //   if (status != napi_ok) {
  //     Napi::Error::Fatal("ThreadEntry", "Napi::ThreadSafeNapi::Function.BlockingCall() failed");
  //   }
  //   // Sleep for some time.
  //   // std::this_thread::sleep_for(std::chrono::milliseconds(200));
  // }

  // Release the thread-safe function. This decrements the internal thread
  // count, and will perform finalization since the count will reach 0.
  context->tsfn.Release();
}

void FinalizerCallback(Napi::Env env, void *finalizeData,
                       TsfnContext *context) {
  // Join the thread
  context->nativeThread.join();

  // Resolve the Promise previously returned to JS via the CreateTSFN method.
  // context->deferred.Resolve(Napi::Boolean::New(env, true));
  delete context;
}





Napi::Object Init(Napi::Env env, Napi::Object exports) {
	// -------------------------------------------------------------------------
	// Evdev
	// -------------------------------------------------------------------------

  exports.Set("libevdev_new", Napi::Function::New(env, [](const Napi::CallbackInfo& info) {
		return Napi::External<struct libevdev>::New(info.Env(),
			libevdev_new()
		);
  }));
  exports.Set("libevdev_new_from_fd", Napi::Function::New(env, [](const Napi::CallbackInfo& info) {
		struct libevdev *libevdev;
		libevdev_new_from_fd(
			info[0].As<Napi::Number>().Int64Value(),
			&libevdev
		);
		return Napi::External<struct libevdev>::New(info.Env(), libevdev);
  }));
  exports.Set("libevdev_free", Napi::Function::New(env, [](const Napi::CallbackInfo& info) {
		libevdev_free(info[0].As<Napi::External<struct libevdev>>().Data());
  }));
  exports.Set("libevdev_grab", Napi::Function::New(env, [](const Napi::CallbackInfo& info) {
		libevdev_grab(
			info[0].As<Napi::External<struct libevdev>>().Data(),
			(libevdev_grab_mode) info[1].As<Napi::Number>().Int64Value()
		);
  }));
  exports.Set("libevdev_set_fd", Napi::Function::New(env, [](const Napi::CallbackInfo& info) {
		libevdev_set_fd(
			info[0].As<Napi::External<struct libevdev>>().Data(),
			(int) info[1].As<Napi::Number>().Int64Value()
		);
  }));
  exports.Set("libevdev_change_fd", Napi::Function::New(env, [](const Napi::CallbackInfo& info) {
		libevdev_change_fd(
			info[0].As<Napi::External<struct libevdev>>().Data(),
			(int) info[1].As<Napi::Number>().Int64Value()
		);
  }));
  exports.Set("libevdev_get_fd", Napi::Function::New(env, [](const Napi::CallbackInfo& info) {
		return Napi::Number::New(info.Env(),
			libevdev_get_fd(
				info[0].As<Napi::External<struct libevdev>>().Data()
			)
		);
  }));

  exports.Set("read_device_worker", Napi::Function::New(env, [](const Napi::CallbackInfo& info) {
		Napi::Env env = info.Env();

    libevdev *dev = info[0].As<Napi::External<struct libevdev>>().Data();

    int rc;
    do {
      // printf("callingme %d", fd);
      struct input_event ev;
      rc = libevdev_next_event(dev, LIBEVDEV_READ_FLAG_NORMAL, &ev);
      if (rc == 0) {
        printf("Event: %s %s %d\n",
              libevdev_event_type_get_name(ev.type),
              libevdev_event_code_get_name(ev.type, ev.code),
              ev.value);
      }
    } while (rc == 1 || rc == 0 || rc == -EAGAIN);


		// // Construct context data
		// auto testData = new TsfnContext(env);
    // testData->dev = info[0].As<Napi::External<struct libevdev>>().Data();

		// // Create a new ThreadSafeFunction.
		// testData->tsfn =
		// 		Napi::ThreadSafeFunction::New(env,                    // Environment
		// 														info[1].As<Napi::Function>(), // JS function from caller
		// 														"read_device_worker",                 // Resource name
		// 														0,        // Max queue size (0 = unlimited).
		// 														1,        // Initial thread count
		// 														testData, // Context,
		// 														FinalizerCallback, // Finalizer
		// 														(void *)nullptr    // Finalizer data
		// 		);
		// testData->nativeThread = std::thread(threadEntry, testData);

		// Return the deferred's Promise. This Promise is resolved in the thread-safe
		// function's finalizer callback.
		// return testData->deferred.Promise();
  }));

  exports.Set("libevdev_next_event", Napi::Function::New(env, [](const Napi::CallbackInfo& info) {
		struct input_event ev;
		int rc = libevdev_next_event(
			info[0].As<Napi::External<struct libevdev>>().Data(),
			(unsigned int) info[1].As<Napi::Number>().Int64Value(),
			&ev
		);
		Napi::Object object = Napi::Object::New(info.Env());
		// if (rc == 0) {
			object.Set("type", ev.type);
			object.Set("code", ev.code);
			object.Set("value", ev.value);
		// } else {
			// object.Set("type", 0);
			// object.Set("code", 0);
			// object.Set("value", 0);
		// }
		return object;
  }));
  exports.Set("libevdev_has_event_pending", Napi::Function::New(env, [](const Napi::CallbackInfo& info) {
		return Napi::Number::New(info.Env(),
			libevdev_has_event_pending(
				info[0].As<Napi::External<struct libevdev>>().Data()
			)
		);
  }));


	// Evdev: get/set infos
	// -------------------------------------------------------------------------

  exports.Set("libevdev_get_name", Napi::Function::New(env, [](const Napi::CallbackInfo& info) {
		const char* name = libevdev_get_name(
			info[0].As<Napi::External<struct libevdev>>().Data()
		);
		return Napi::String::New(info.Env(), name);
  }));
  exports.Set("libevdev_set_name", Napi::Function::New(env, [](const Napi::CallbackInfo& info) {
		const string name = info[1].As<Napi::String>();
		libevdev_set_name(
			info[0].As<Napi::External<struct libevdev>>().Data(),
			&name[0]
		);
  }));
  exports.Set("libevdev_get_phys", Napi::Function::New(env, [](const Napi::CallbackInfo& info) {
		const char* name = libevdev_get_phys(
			info[0].As<Napi::External<struct libevdev>>().Data()
		);
		return Napi::String::New(info.Env(), name);
  }));
  exports.Set("libevdev_set_phys", Napi::Function::New(env, [](const Napi::CallbackInfo& info) {
		const string name = info[1].As<Napi::String>();
		libevdev_set_phys(
			info[0].As<Napi::External<struct libevdev>>().Data(),
			&name[0]
		);
  }));
  exports.Set("libevdev_get_uniq", Napi::Function::New(env, [](const Napi::CallbackInfo& info) {
		const char* name = libevdev_get_uniq(
			info[0].As<Napi::External<struct libevdev>>().Data()
		);
		return Napi::String::New(info.Env(), name);
  }));
  exports.Set("libevdev_set_uniq", Napi::Function::New(env, [](const Napi::CallbackInfo& info) {
		const string name = info[1].As<Napi::String>();
		libevdev_set_uniq(
			info[0].As<Napi::External<struct libevdev>>().Data(),
			&name[0]
		);
  }));
  exports.Set("libevdev_get_id_product", Napi::Function::New(env, [](const Napi::CallbackInfo& info) {
		return Napi::Number::New(info.Env(),
			libevdev_get_id_product(
				info[0].As<Napi::External<struct libevdev>>().Data()
			)
		);
  }));
  exports.Set("libevdev_set_id_product", Napi::Function::New(env, [](const Napi::CallbackInfo& info) {
		libevdev_set_id_product(
			info[0].As<Napi::External<struct libevdev>>().Data(),
			(unsigned int) info[1].As<Napi::Number>().Int64Value()
		);
  }));
  exports.Set("libevdev_get_id_vendor", Napi::Function::New(env, [](const Napi::CallbackInfo& info) {
		return Napi::Number::New(info.Env(),
			libevdev_get_id_vendor(
				info[0].As<Napi::External<struct libevdev>>().Data()
			)
		);
  }));
  exports.Set("libevdev_set_id_vendor", Napi::Function::New(env, [](const Napi::CallbackInfo& info) {
		libevdev_set_id_vendor(
			info[0].As<Napi::External<struct libevdev>>().Data(),
			(unsigned int) info[1].As<Napi::Number>().Int64Value()
		);
  }));
  exports.Set("libevdev_get_id_bustype", Napi::Function::New(env, [](const Napi::CallbackInfo& info) {
		return Napi::Number::New(info.Env(),
			libevdev_get_id_bustype(
				info[0].As<Napi::External<struct libevdev>>().Data()
			)
		);
  }));
  exports.Set("libevdev_set_id_bustype", Napi::Function::New(env, [](const Napi::CallbackInfo& info) {
		libevdev_set_id_bustype(
			info[0].As<Napi::External<struct libevdev>>().Data(),
			(int) info[1].As<Napi::Number>().Int64Value()
		);
  }));
  exports.Set("libevdev_get_id_version", Napi::Function::New(env, [](const Napi::CallbackInfo& info) {
		return Napi::Number::New(info.Env(),
			libevdev_get_id_version(
				info[0].As<Napi::External<struct libevdev>>().Data()
			)
		);
  }));
  exports.Set("libevdev_set_id_version", Napi::Function::New(env, [](const Napi::CallbackInfo& info) {
		libevdev_set_id_version(
			info[0].As<Napi::External<struct libevdev>>().Data(),
			(unsigned int) info[1].As<Napi::Number>().Int64Value()
		);
  }));
  exports.Set("libevdev_get_driver_version", Napi::Function::New(env, [](const Napi::CallbackInfo& info) {
		return Napi::Number::New(info.Env(),
			libevdev_get_driver_version(
				info[0].As<Napi::External<struct libevdev>>().Data()
			)
		);
  }));

  exports.Set("libevdev_has_property", Napi::Function::New(env, [](const Napi::CallbackInfo& info) {
		return Napi::Number::New(info.Env(),
			libevdev_has_property(
				info[0].As<Napi::External<struct libevdev>>().Data(),
				 (unsigned int) info[1].As<Napi::Number>().Int64Value()
			)
		);
  }));


  exports.Set("libevdev_enable_event_type", Napi::Function::New(env, [](const Napi::CallbackInfo& info) {
		libevdev_enable_event_type(
			info[0].As<Napi::External<struct libevdev>>().Data(),
			(unsigned int) info[1].As<Napi::Number>().Int64Value()
		);
  }));
  exports.Set("libevdev_enable_event_code", Napi::Function::New(env, [](const Napi::CallbackInfo& info) {
		libevdev_enable_event_code(
			info[0].As<Napi::External<struct libevdev>>().Data(),
			(unsigned int) info[1].As<Napi::Number>().Int64Value(),
			(unsigned int) info[2].As<Napi::Number>().Int64Value(),
			info[3].As<Napi::External<void *>>().Data()
		);
  }));

	// -------------------------------------------------------------------------
	// Evdev Uinput
	// -------------------------------------------------------------------------
  exports.Set("libevdev_uinput_create_from_device", Napi::Function::New(env, [](const Napi::CallbackInfo& info) {
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
  exports.Set("libevdev_uinput_write_event", Napi::Function::New(env, [](const Napi::CallbackInfo& info) {
		return Napi::Number::New(info.Env(),
			libevdev_uinput_write_event(
				info[0].As<Napi::External<struct libevdev_uinput>>().Data(),
				(unsigned int) info[1].As<Napi::Number>().Int64Value(),
				(unsigned int) info[2].As<Napi::Number>().Int64Value(),
				(int) info[3].As<Napi::Number>().Int64Value()
			)
		);
  }));

	// -------------------------------------------------------------------------
	// Utils
	// -------------------------------------------------------------------------

  exports.Set("NULL", Napi::External<void *>::New(env, NULL));

	return exports;
}


Napi::Object InitAll(Napi::Env env, Napi::Object exports) {
  return Init(env, exports);
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, InitAll)
