"use strict";

var modRewrite = require("connect-modrewrite");

module.exports = function (grunt) {

    var base = grunt.option("baseDir") || "",
        protractorConf = grunt.option("ci") ?
                        "tests/e2e/protractor.saucelabs.conf.js" :
                        "tests/e2e/protractor.conf.js" ;

    grunt.initConfig({

        pkg: grunt.file.readJSON("package.json"),

        config: {
            outputDir: "dist/",
            applicationFiles: grunt.file.readJSON("scripts.json").application,
            vendorFiles: grunt.file.readJSON("scripts.json").vendor
        },

        connect: {
            options: {
                hostname: "0.0.0.0",
                port: 8000,
                base: base
            },
            server: {
                options: {
                    livereload: true,
                    middleware: function ( connect, options, middlewares ) {
                        var rules = (base === "dist") ?
                            [ "^/[^\.]*$ /index.html" ] :
                            [ "^/app/[^\.]*$ /app/index.html" ];
                        middlewares.unshift( modRewrite( rules ) );
                        return middlewares;
                    }
                }
            },
            servertest: {
                options: {
                    keepalive: false,
                    livereload: false,
                    base: "dist",
                    middleware: function ( connect, options, middlewares ) {
                        var rules = [ "^/[^\.]*$ /index.html" ];
                        middlewares.unshift( modRewrite( rules ) );
                        return middlewares;
                    }
                }
            }
        },

        watch: {
            options: {
                nospawn: false,
                livereload: true
            },
            css: {
                files: [
                    "app/index.html",

                    "app/less/*.less",
                    "app/less/**/*.less",
                    "app/less/**/**/*.less",

                    "app/partials/*.html",
                    "app/partials/**/*.html",
                    "app/partials/**/**/*.html",

                    "modules/*.html",
                    "modules/**/*.html",
                    "modules/**/**/*.html"
                ],
                tasks: ["less:development"]
            },
            javascript: {
                files: [
                    "app/js/*.js",
                    "app/js/**/*.js",
                    "app/js/**/**/*.js",

                    "tests/unit/*.js",
                    "tests/unit/**/*.js",
                    "tests/unit/**/**/*.js"
                ],
                tasks: ["test:development"]
            }
        },

        less: {
            options: {
                paths: ["app/less/"],
                cleancss: false,
                banner: "/*! <%= pkg.name %> - v<%= pkg.version %> - " +
                    "<%= grunt.template.today(\"yyyy-mm-dd\") %> */\n"
            },
            development: {
                files: { "app/css/all.css": "app/less/main.less" },
                options: {
                    sourceMap: true,
                    sourceMapFilename: "app/css/all.css.map",
                    sourceMapURL: "all.css.map",
                    outputSourceFiles: true
                }
            },
            production: {
                files: { "<%= config.outputDir %>css/all.min.css": "app/less/main.less" },
                options: {
                    cleancss: true
                }
            }
        },

        jshint: {
            options: {
                jshintrc: ".jshintrc"
            },
            dist: {
                src: ["<%= config.applicationFiles %>"]
            }
        },

        jasmine: {
            options: {
                vendor: ["<%= config.vendorFiles %>"],
                helpers:["app/components/angular-mocks/angular-mocks.js"],
                specs: ["tests/unit/**/*.js"],
                keepRunner: true,
            },
            development: {
                src: ["<%= config.applicationFiles %>"],
                options: {
                    template: require("grunt-template-jasmine-istanbul"),
                    templateOptions: {
                        coverage: "coverage/coverage.json",
                        report: [
                            {
                                type: "lcov",
                                options: {
                                    dir: "coverage"
                                }
                            },
                            {
                                type: "text-summary"
                            }
                        ]
                    }
                }
            },
            production: {
                src: ["<%= config.outputDir %><%= pkg.name %>.min.js"]
            }
        },

        protractor: {
            options: {
                keepAlive: false,
                noColor: false
            },
            dist: {
                options: {
                    configFile: protractorConf
                }
            }
        },

        concat: {
            options: {
                sourceMap: false,
                separator: ";",
                banner: "/*! <%= pkg.name %> - v<%= pkg.version %> - " +
                    "<%= grunt.template.today(\"yyyy-mm-dd\") %> */\n"
            },
            production: {
                src: [
                    "<%= config.applicationFiles %>"
                ],
                dest: "<%= config.outputDir %><%= pkg.name %>.js"
            }
        },

        uglify: {
            options: {
                sourceMap: false,
                sourceMapIncludeSources: true,
                enclose: { window: "window" },
                banner: "/*! <%= pkg.name %> - v<%= pkg.version %> - " +
                    "<%= grunt.template.today(\"yyyy-mm-dd\") %> */\n"
            },
            production: {
                files: {
                    "<%= config.outputDir %><%= pkg.name %>.min.js":
                    [
                        "<%= config.applicationFiles %>"
                    ]
                }
            }
        },

        copy: {
            images: {
                files: [{
                    expand: true,
                    cwd: "app/img",
                    src: ["**/*", "!test/**"],
                    dest: "<%= config.outputDir %>img/"
                }]
            },
            partials: {
                files: [{
                    expand: true,
                    cwd: "app/partials",
                    src: ["*.html"],
                    dest: "<%= config.outputDir %>partials/"
                }]
            },
            e2e: {
                files: [{
                    expand: true,
                    src: [
                        "<%= config.vendorFiles %>"
                    ],
                    dest: "<%= config.outputDir %>",
                    rename: function(dest, src) {
                        return dest + src.replace("app/","");
                    }
                }]
            }
        },

        clean: {
            beforeBuild: {
                src: ["<%= config.outputDir %>", "docs"]
            },
            afterTest: {
                src: ["<%= config.outputDir %>"]
            }
        },

        processhtml: {
            options: {
                strip: true
            },
            production: {
                files: {
                    "<%= config.outputDir %>index.html": ["app/index.html"]
                }
            },
            e2e: {
                files: {
                    "<%= config.outputDir %>index.html": ["app/index.html"]
                }
            }
        },

        yuidoc: {
            compile: {
                name: "<%= pkg.name %>",
                description: "<%= pkg.description %>",
                version: "<%= pkg.version %>",
                url: "<%= pkg.homepage %>",
                options: {
                    paths: "app/js/",
                    themedir: "node_modules/yuidoc-bootstrap-theme",
                    helpers: ["node_modules/yuidoc-bootstrap-theme/helpers/helpers.js"],
                    outdir: "docs/"
                }
            }
        },

        bump: {
            options: {
                files: ["package.json", "bower.json"],
                updateConfigs: ["pkg"],
                commit: true,
                commitFiles: ["-a"],
                createTag: true,
                push: true,
                pushTo: "origin master"
            }
        }


    });

    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-connect");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-yuidoc");
    grunt.loadNpmTasks("grunt-contrib-jasmine");
    grunt.loadNpmTasks("grunt-protractor-runner");
    grunt.loadNpmTasks("grunt-processhtml");
    grunt.loadNpmTasks('grunt-bump');

    grunt.registerTask("build", [
        "clean:beforeBuild",
        "concat",
        "uglify"
    ]);

    grunt.registerTask("release", [
        "bump-only",
        "build",
        "bump-commit"
    ]);

    grunt.registerTask("copyBuild", [
        "copy:images",
        "copy:partials"
    ]);

    grunt.registerTask("server", [
        "less:development",
        "connect:server",
        "watch:css"
    ]);

    grunt.registerTask("serverjs", [
        "less:development",
        "connect:server",
        "watch:javascript"
    ]);

    grunt.registerTask("serverall", [
        "less:development",
        "connect:server",
        "watch"
    ]);

    grunt.registerTask("test", [
        "clean:beforeBuild",
        "jshint",
        "uglify",
        "jasmine:production",
        "clean:afterTest"
    ]);

    grunt.registerTask("test:development", [
        "jshint",
        "jasmine:development"
    ]);

    grunt.registerTask("e2e", [
        "uglify",
        "less:production",
        "copy",
        "processhtml:e2e",
        "connect:servertest",
        "protractor:dist",
        "clean:afterTest"
    ]);

    grunt.registerTask("default", ["build"]);

};
