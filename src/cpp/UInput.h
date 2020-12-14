#include <napi.h>
#include <libevdev/libevdev.h>
#include <libevdev/libevdev-uinput.h>

Napi::Object UInput::Init(Napi::Env env, Napi::Object exports);
