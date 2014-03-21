module.exports = function (grunt) {
    var fs = require('fs');
    var path = require("path");
    var pkg = require("./package.json");
    var _ = require('lodash');

    // Path to the client src
    var srcPath = path.resolve(__dirname, "src");

    // Constants
    var NW_VERSION = "0.8.4";

    // Load grunt modules
    grunt.loadNpmTasks('hr.js');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-node-webkit-builder');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-manifest');

    var hrConfig = {
        // Base directory for the application
        "base": srcPath,

        // Application name
        "name": "Codebox",

        // Mode debug
        "debug": true,

        // Main entry point for application
        "main": "main",

        // Build output directory
        "build": path.resolve(__dirname, "build"),

        // Static files mappage
        "static": {
            "images": path.resolve(srcPath, "resources", "images")
        },

        // Stylesheet entry point
        "style": path.resolve(srcPath, "resources/stylesheets/main.less"),

        // Modules paths
        'paths': {
            "platform": "platforms/chrome",
        },
        "shim": {},
        'args': {},
        'options': {}
    };

    // Init GRUNT configuraton
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        hr: {
            node: _.extend({}, hrConfig, {
                'index': grunt.file.read(path.resolve(srcPath, "platforms/node/index.html")),
                'paths': {
                    "platform": "platforms/node"
                }
            }),
            chrome: _.extend({}, hrConfig, {
                'index': grunt.file.read(path.resolve(srcPath, "platforms/chrome/index.html")),
                'paths': {
                    "platform": "platforms/chrome"
                }
            })
        },
        manifest: {
            generate: {
                options: {
                    basePath: path.resolve(__dirname, "appBuilds/releases/codebox/chrome"),
                    cache: [],
                    network: ['*'],
                    preferOnline: false,
                    verbose: false,
                    timestamp: true,
                    hash: true,
                    master: ['index.html']
                },
                src: [
                    '**/*.js',
                    '**/*.css',
                    '**/*.png',
                    '*.js'
                ],
                dest: path.resolve(__dirname, "appBuilds/releases/codebox/chrome/manifest.appcache")
            }
        },
        nodewebkit: {
            mac: {
                options: {
                    build_dir: './appBuilds',
                    mac: true,
                    win: false,
                    linux32: false,
                    linux64: false,
                    mac_icns: "./build/static/images/icons/mac.icns",
                    credits: "./src/credits.html",
                    version: NW_VERSION,
                    zip: false
                },
                src: [
                    "./**",

                    // grunt.file.copy duplicates symbolic and hard links
                    // so we need to copy it with the shell
                    "!./extras/**",
                    "!./appBuilds/**",
                    "!./node_modules/grunt-*/**",
                    "!./node_modules/grunt/**",
                    "!./node_modules/nw-gyp/**"
                ]
            },
            linux32: {
                options: {
                    build_dir: './appBuilds',
                    mac: false,
                    win: false,
                    linux32: true,
                    linux64: false,
                    version: NW_VERSION,
                    zip: false
                },
                src: [
                    "./**",
                    "!./appBuilds/**",
                    "!./node_modules/grunt-*/**",
                    "!./node_modules/grunt/**",
                    "!./node_modules/nw-gyp/**"
                ]
            },
            linux64: {
                options: {
                    build_dir: './appBuilds',
                    mac: false,
                    win: false,
                    linux32: false,
                    linux64: true,
                    version: NW_VERSION,
                    zip: false
                },
                src: [
                    "./**",
                    "!./appBuilds/**",
                    "!./node_modules/grunt-*/**",
                    "!./node_modules/grunt/**",
                    "!./node_modules/nw-gyp/**"
                ]
            }

        },
        exec: {
            nwbuild: {
                command: "./scripts/nwbuild.sh "+NW_VERSION,
                cwd: './',
                stdout: true,
                stderr: true
            },
            build_extras: {
                command: "./scripts/build_extras.sh",
                cwd: './',
                stdout: true,
                stderr: true
            },
            copy_extras: {
                // Copy and preserve symbolic links
                command: "mv ./extras ./appBuilds/releases/Codebox/mac/Codebox.app/Contents/Resources/app.nw/extras",
                cwd: '.',
                stdout: true,
                stderr: true
            },
            build_mac_release: {
                command: "./scripts/build_mac_dmg.sh",
                cwd: './',
                stdout: true,
                stderr: true
            },
            build_linux32_release: {
                command: "./scripts/build_linux32_tar.sh",
                cwd: './',
                stdout: true,
                stderr: true
            },
            build_linux64_release: {
                command: "./scripts/build_linux64_tar.sh",
                cwd: './',
                stdout: true,
                stderr: true
            },
            build_chrome_release: {
                command: "./scripts/build_chrome.sh",
                cwd: './',
                stdout: true,
                stderr: true
            }
        },
        clean: {
            releases: [
                "./appBuilds/releases"
            ]
        },
        copy: {
            // Installer for linux
            linux32Installer: {
                cwd: './',
                src: 'scripts/install_linux.sh',
                dest: './appBuilds/releases/Codebox/linux32/Codebox/install.sh'
            },
            linux32Start: {
                cwd: './',
                src: 'scripts/linux_start.sh',
                dest: './appBuilds/releases/Codebox/linux32/Codebox/start.sh'
            },
            // Installer for linux
            linux32Icon: {
                cwd: './',
                src: './build/static/images/icons/128.png',
                dest: './appBuilds/releases/Codebox/linux32/Codebox/icon.png'
            },
            // Installer for linux
            linux64Installer: {
                cwd: './',
                src: 'scripts/install_linux.sh',
                dest: './appBuilds/releases/Codebox/linux64/Codebox/install.sh'
            },
            // Entry point for linux
            linux64Start: {
                cwd: './',
                src: 'scripts/linux_start.sh',
                dest: './appBuilds/releases/Codebox/linux64/Codebox/start.sh'
            },

            // Installer for linux
            linux64Icon: {
                cwd: './',
                src: './build/static/images/icons/128.png',
                dest: './appBuilds/releases/Codebox/linux64/Codebox/icon.png'
            },
        }
    });

    // Build
    grunt.registerTask('build', [
        'hr'
    ]);

    // Desktop app generation
    grunt.registerTask('build-mac', [
        'hr:node',
        'exec:nwbuild',
        'exec:build_extras',
        'nodewebkit:mac',
        'exec:copy_extras',
        'exec:build_mac_release'
    ]);
    grunt.registerTask('build-linux32', [
        'hr:node',
        'exec:nwbuild',
        'nodewebkit:linux32',
        'copy:linux32Installer',
        'copy:linux32Start',
        'copy:linux32Icon',
        'exec:build_linux32_release'
    ]);
    grunt.registerTask('build-linux64', [
        'hr:node',
        'exec:nwbuild',
        'nodewebkit:linux64',
        'copy:linux64Installer',
        'copy:linux64Start',
        'copy:linux64Icon',
        'exec:build_linux64_release'
    ]);
    grunt.registerTask('build-chrome', [
        'hr:chrome',
        'exec:build_chrome_release',
        'manifest'
    ]);

    grunt.registerTask('default', [
        'build'
    ]);
};
