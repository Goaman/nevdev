#ifndef DEVICE_H
#define DEVICE_H

#include <napi.h>
#include <libevdev/libevdev-uinput.h>

class Device : public Napi::ObjectWrap<Device> {
 public:
  static Napi::Object Init(Napi::Env env, Napi::Object exports);
  // static Napi::Object NewInstance(Napi::Env env, Napi::Value arg);
  // MyObject(const Napi::CallbackInfo& info);

 private:
  Napi::Value Write(const Napi::CallbackInfo& info);
  libevdev_uinput *uidev;
};

#endif
