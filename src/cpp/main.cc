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

using namespace std;

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

  exports.Set("libevdev_next_event", Napi::Function::New(env, [](const Napi::CallbackInfo& info) {
		struct input_event ev;
		int rc = libevdev_next_event(
			info[0].As<Napi::External<struct libevdev>>().Data(),
			(unsigned int) info[1].As<Napi::Number>().Int64Value(),
			&ev
		);
		Napi::Object object = Napi::Object::New(info.Env());
			object.Set("sec", ev.time.tv_sec);
			object.Set("usec", ev.time.tv_usec);
			object.Set("type", ev.type);
			object.Set("code", ev.code);
			object.Set("value", ev.value);
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
