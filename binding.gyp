{
    "targets": [{
        "target_name": "nevdev",
        # "cflags!": [ "-fno-exceptions" ],
        # "cflags_cc!": [ "-fno-exceptions" ],
        "sources": [
            "src/cppsrc/main.cpp",
        ],
        # 'include_dirs': [
        #     "<!@(node -p \"require('node-addon-api').include\")"
        # ],
        # 'libraries': [],
        # 'dependencies': [
        #     "<!(node -p \"require('node-addon-api').gyp\")"
        # ],
        # 'defines': [ 'NAPI_DISABLE_CPP_EXCEPTIONS' ]
    }]
}