#include <nan.h>
#include <string>
#include <cstring>
#include <iostream>
#include <cstdlib>
#include "../src/libsass/sass_interface.h"

// using namespace v8;
// using namespace std;
// using namespace Sass;

// char* CreateString(Local<Value> value) {
//   size_t count;
//   return NanCString(value, &count);
// }

// void prepareOptions(Local<Object> options, sass_context* ctx) {
//     ctx->source_string = CreateString(options->Get(NanNew("data")));
//     ctx->options.image_path = CreateString(options->Get(NanNew("imagePath")));
//     ctx->options.output_style = options->Get(NanNew("style"))->Int32Value();
//     ctx->options.source_comments = options->Get(NanNew("comments"))->Int32Value();
//     ctx->options.omit_source_map_url = options->Get(NanNew("omit_source_map_url"))->Int32Value();
//     ctx->options.is_indented_syntax_src = options->Get(NanNew("is_indented_syntax_src"))->Int32Value();
//     ctx->options.include_paths = CreateString(options->Get(NanNew("paths")));
//     ctx->options.precision = options->Get(NanNew("precision"))->Int32Value();
//     ctx->options.source_map_file = CreateString(options->Get(NanNew("source_map_file")));
// }

// Simple synchronous access to the `Estimate()` function
NAN_METHOD(RenderSync) {
  NanScope();

  // sass_context* ctx = sass_new_context();

  // prepareOptions(args[0]->ToObject(), ctx);

  // sass_compile(ctx);

  // if (ctx->error_status == 0) {
  //   Local<String> output = NanNew<String>(ctx->output_string);
  //   sass_free_context(ctx);
  //   NanReturnValue(output);
  // }

  // Local<String> error = NanNew<String>(ctx->error_message);
  // sass_free_context(ctx);
  // NanThrowError(error);
  NanReturnUndefined();
}

NAN_METHOD(importedCallback) {
  NanScope();

  // char *source = CreateString(args[0]);
  // char *converted = sass2scss(source, SASS2SCSS_PRETTIFY_1);
  // delete[] source;

  // Local<Value> output = Local<Value>::New(String::New(converted));
  NanReturnValue(output);
}
