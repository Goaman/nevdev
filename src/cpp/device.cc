#include <napi.h>
// #include "device.h"

// Napi::Object Device::Init(Napi::Env env, Napi::Object exports) {

//   Napi::Function func = DefineClass(
//       env, "Device", {InstanceMethod("write", &Device::Write)});

//   Napi::FunctionReference* constructor = new Napi::FunctionReference();
//   *constructor = Napi::Persistent(func);
//   env.SetInstanceData(constructor);

//   exports.Set("Device", func);
//   return exports;
// }

// Napi::Value Device::Write(const Napi::CallbackInfo& info) {
//   Napi::Env env = info.Env();
//   this->counter_ = this->counter_ + 1;

//   return Napi::Number::New(env, this->counter_);
// }


#include "device.h"

Napi::Object Device::Init(Napi::Env env, Napi::Object exports) {

  Napi::Function func =
      DefineClass(env,
                  "Device", {
                    InstanceMethod("plusOne", &Device::PlusOne),
                    // InstanceMethod("value", &Device::GetValue),
                    // InstanceMethod("multiply", &Device::Multiply)
                  });

  Napi::FunctionReference* constructor = new Napi::FunctionReference();
  *constructor = Napi::Persistent(func);
  env.SetInstanceData(constructor);

  exports.Set("Device", func);
  return exports;
}

Device::Device(const Napi::CallbackInfo& info)
    : Napi::ObjectWrap<Device>(info) {
  Napi::Env env = info.Env();

  int length = info.Length();

  if (length <= 0 || !info[0].IsNumber()) {
    Napi::TypeError::New(env, "Number expected").ThrowAsJavaScriptException();
    return;
  }

  Napi::Number value = info[0].As<Napi::Number>();
  this->value_ = value.DoubleValue();
}

Napi::Value Device::GetValue(const Napi::CallbackInfo& info) {
  double num = this->value_;

  return Napi::Number::New(info.Env(), num);
}

Napi::Value Device::PlusOne(const Napi::CallbackInfo& info) {
  this->value_ = this->value_ + 1;

  return Device::GetValue(info);
}

Napi::Value Device::Multiply(const Napi::CallbackInfo& info) {
  Napi::Number multiple;
  if (info.Length() <= 0 || !info[0].IsNumber()) {
    multiple = Napi::Number::New(info.Env(), 1);
  } else {
    multiple = info[0].As<Napi::Number>();
  }

  Napi::Object obj = info.Env().GetInstanceData<Napi::FunctionReference>()->New(
      {Napi::Number::New(info.Env(), this->value_ * multiple.DoubleValue())});

  return obj;
}
