{
    "targets": [{
        "target_name": "nevdev",
        "sources": [
            "src/cpp/main.cpp",
        ],
        "cflags": [
            '<!@(pkg-config --cflags libevdev)',
        ],
        "cflags!": [
            "-fno-exceptions",
        ],
        "cflags_cc!": [ "-fno-exceptions" ],
        'include_dirs': [
            "<!@(node -p \"require('node-addon-api').include\")"
        ],
        'ldflags': [
            '<!@(pkg-config --libs-only-L --libs-only-other libevdev)'
        ],
        'libraries': [
            '<!@(pkg-config --libs-only-l libevdev)'
        ],
        'dependencies': [
            "<!(node -p \"require('node-addon-api').gyp\")"
        ],
        'defines': [ 'NAPI_DISABLE_CPP_EXCEPTIONS' ]
    }]
}
