#include <node.h>
#include <nan.h>
#include "./sync.h"

using v8::FunctionTemplate;
using v8::Handle;
using v8::Object;
using v8::String;

// Expose synchronous and asynchronous access to our
// Estimate() function
void InitAll(Handle<Object> exports) {
  exports->Set(NanNew<String>("renderSync"),
    NanNew<FunctionTemplate>(RenderSync)->GetFunction());

  exports->Set(NanNew<String>("importedCallback"),
    NanNew<FunctionTemplate>(importedCallback)->GetFunction());
}

NODE_MODULE(binding, InitAll)
