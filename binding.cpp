#include <node.h>
#include <v8.h>
#include <string>
#include <cstring>
#include <iostream>
#include <cstdlib>
#include "libsass/sass_interface.h"

using namespace v8;
using namespace std;

void prepareOptions( const Arguments& args, sass_context* ctx ) {
  char *source;
  char *path;
  int output_style;
  int source_comments;

  // 处理data
  String::AsciiValue astr(args[0]);
  source = new char[strlen(*astr)+1];
  strcpy(source, *astr);

  // 处理path
  String::AsciiValue cstr(args[1]);
  path = new char[strlen(*cstr)+1];
  strcpy(path, *cstr);

  // 处理style, comments
  output_style = args[2]->Int32Value();
  source_comments = args[3]->Int32Value();

  ctx->source_string = source;
  ctx->options.image_path = new char[0];
  ctx->options.output_style = output_style;
  ctx->options.source_comments = source_comments;
  ctx->options.include_paths = path;
}

Handle<Value> RenderSync(const Arguments& args) {
  HandleScope scope;

  sass_context* ctx = sass_new_context();

  prepareOptions( args, ctx );

  sass_compile(ctx);

  delete ctx->source_string;
  ctx->source_string = NULL;
  delete ctx->options.include_paths;
  ctx->options.include_paths = NULL;

  if (ctx->error_status == 0) {
    Local<Value> output = Local<Value>::New(String::New(ctx->output_string));
    sass_free_context(ctx);
    return scope.Close( output );
  }

  Local<String> error = String::New(ctx->error_message);
  sass_free_context(ctx);
  ThrowException(Exception::TypeError(error));

  return scope.Close(Undefined());
}

void init(Handle<Object> exports) {
  exports->Set(String::NewSymbol("renderSync"),
      FunctionTemplate::New(RenderSync)->GetFunction());
}

NODE_MODULE(binding, init)