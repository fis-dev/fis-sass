#include <node.h>
#include <nan.h>
#include "./lib/sync.h"

using v8::FunctionTemplate;
using v8::Handle;
using v8::Object;
using v8::String;

// Expose synchronous and asynchronous access to our
// Estimate() function
void InitAll(Handle<Object> exports) {
  exports->Set(NanNew<String>("renderSync"),
    NanNew<FunctionTemplate>(RenderSync)->GetFunction());

  exports->Set(NanNew<String>("sass2scss"),
    NanNew<FunctionTemplate>(Sass2scss)->GetFunction());
}

NODE_MODULE(binding, InitAll)
