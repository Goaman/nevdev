#include <napi.h>
#include <libevdev/libevdev.h>
#include <libevdev/libevdev-uinput.h>

Napi::Object UInput::Init(Napi::Env env, Napi::Object exports) {
  exports.Set("libevdev_uinput_create_from_device", [](const Napi::CallbackInfo& info){
    const struct libevdev *dev = info[0].As<Napi::External>().DoubleValue();
    int fd = (int) info[1].As<Napi::Number>().Int64Value();
    struct libevdev_uinput** uinput_dev = info[1].As<Napi::External>().Int64Value();

    // libevdev_uinput_create_from_device();
  });
  return exports;
}
