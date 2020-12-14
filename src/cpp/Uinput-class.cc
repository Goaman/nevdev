#include <napi.h>
// #include "UInput.h"

// Napi::Object UInput::Init(Napi::Env env, Napi::Object exports) {

//   Napi::Function func = DefineClass(
//       env, "UInput", {InstanceMethod("write", &UInput::Write)});

//   Napi::FunctionReference* constructor = new Napi::FunctionReference();
//   *constructor = Napi::Persistent(func);
//   env.SetInstanceData(constructor);

//   exports.Set("UInput", func);
//   return exports;
// }

// Napi::Value UInput::Write(const Napi::CallbackInfo& info) {
//   Napi::Env env = info.Env();
//   this->counter_ = this->counter_ + 1;

//   return Napi::Number::New(env, this->counter_);
// }


#include "UInput.h"

Napi::Object UInput::Init(Napi::Env env, Napi::Object exports) {

  Napi::Function func =
      DefineClass(env,
                  "UInput", {
                    InstanceMethod("destroy", &UInput::Destroy),
                    InstanceMethod("writeEvent", &UInput::WriteEvent),
                    InstanceMethod("getSyspath", &UInput::GetSyspath),
                    InstanceMethod("getDevnode", &UInput::GetDevnode),
                    InstanceMethod("getFd", &UInput::GetFd),
                    // InstanceMethod("value", &UInput::GetValue),
                    // InstanceMethod("multiply", &UInput::Multiply)
                  });

  Napi::FunctionReference* constructor = new Napi::FunctionReference();
  *constructor = Napi::Persistent(func);
  env.SetInstanceData(constructor);

  exports.Set("UInput", func);
  return exports;
}

UInput::UInput(const Napi::CallbackInfo& info)
    : Napi::ObjectWrap<UInput>(info) {
  Napi::Env env = info.Env();

  int length = info.Length();

  if (length <= 0 || !info[0].IsNumber()) {
    Napi::TypeError::New(env, "Number expected").ThrowAsJavaScriptException();
    return;
  }

  Napi::Number value = info[0].As<Napi::Number>();
  this->value_ = value.DoubleValue();
}


Napi::Value UInput::Destroy(const Napi::CallbackInfo& info) {
  double num = this->value_;

  return Napi::Number::New(info.Env(), num);
}
Napi::Value UInput::WriteEvent(const Napi::CallbackInfo& info) {
  double num = this->value_;

  return Napi::Number::New(info.Env(), num);
}
Napi::Value UInput::GetSyspath(const Napi::CallbackInfo& info) {
  double num = this->value_;

  return Napi::Number::New(info.Env(), num);
}
Napi::Value UInput::GetDevnode(const Napi::CallbackInfo& info) {
  double num = this->value_;

  return Napi::Number::New(info.Env(), num);
}
Napi::Value UInput::GetFd(const Napi::CallbackInfo& info) {
  double num = this->value_;

  return Napi::Number::New(info.Env(), num);
}


// Napi::Value UInput::GetValue(const Napi::CallbackInfo& info) {
//   double num = this->value_;

//   return Napi::Number::New(info.Env(), num);
// }

// Napi::Value UInput::PlusOne(const Napi::CallbackInfo& info) {
//   this->value_ = this->value_ + 1;

//   return UInput::GetValue(info);
// }

// Napi::Value UInput::Multiply(const Napi::CallbackInfo& info) {
//   Napi::Number multiple;
//   if (info.Length() <= 0 || !info[0].IsNumber()) {
//     multiple = Napi::Number::New(info.Env(), 1);
//   } else {
//     multiple = info[0].As<Napi::Number>();
//   }

//   Napi::Object obj = info.Env().GetInstanceData<Napi::FunctionReference>()->New(
//       {Napi::Number::New(info.Env(), this->value_ * multiple.DoubleValue())});

//   return obj;
// }
