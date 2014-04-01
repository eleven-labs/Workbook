module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-recess');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-html2js');

  // Default task.
  grunt.registerTask('default', ['build','jshint','karma:unit']);
  grunt.registerTask('build', ['clean:build','html2js','concat','recess:build','copy:assets','clean:build_templates']);
  grunt.registerTask('release', ['clean:build','html2js','uglify','concat:index','concat:stylesheets', 'recess:min','copy:assets','clean:build_templates','jshint','karma:unit']);
  grunt.registerTask('test-watch', ['karma:watch']);

  // Print a timestamp (useful for when watching)
  grunt.registerTask('timestamp', function() {
    grunt.log.subhead(Date());
  });

  var karmaConfig = function(configFile, customOptions) {
    var options = { configFile: configFile, keepalive: true };
    var travisOptions = process.env.TRAVIS && { browsers: ['Firefox'], reporters: 'dots' };
    return grunt.util._.extend(options, customOptions, travisOptions);
  };

  // Project configuration.
  grunt.initConfig({
    distdir: 'dist',
    pkg: grunt.file.readJSON('package.json'),
    banner:
    '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
    '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
    ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;\n' +
    ' * Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n */\n',
    src: {
      js: ['src/**/*.js'],
      jsTpl: ['<%= distdir %>/templates/**/*.js'],
      specs: ['test/**/*.spec.js'],
      scenarios: ['test/**/*.scenario.js'],
      html: ['src/index.html'],
      tpl: {
        app: ['src/app/**/*.tpl.html'],
        angularUI: ['bower_components/angular-ui-bootstrap/template/**/*.html']
      },
      less: ['src/stylesheets/main.less'], // recess:build doesn't accept ** in its file patterns
      lessWatch: ['src/stylesheets/**/*.less']
    },
    clean: {
      build: ['<%= distdir %>/*'],
      build_templates: ['<%= distdir %>/templates']
    },
    copy: {
      assets: {
        files: [
          { dest: '<%= distdir %>', src : '**', expand: true, cwd: 'src/assets/' },
          { dest: '<%= distdir %>/fonts', src : '**', expand: true, cwd: 'bower_components/bootstrap/dist/fonts' }
        ]
      }
    },
    karma: {
      unit: { options: karmaConfig('karma.conf.js') },
      watch: { options: karmaConfig('karma.conf.js', { singleRun:false, autoWatch: true}) }
    },
    html2js: {
      app: {
        options: {
          base: 'src/app'
        },
        src: ['<%= src.tpl.app %>'],
        dest: '<%= distdir %>/templates/app.js',
        module: 'templates.app'
      },
      angularUI: {
        options: {
          base: 'bower_components/angular-ui-bootstrap'
        },
        src: ['<%= src.tpl.angularUI %>'],
        dest: '<%= distdir %>/templates/angular.ui.js',
        module: 'templates.angular.ui'
      }
    },
    concat: {
      dist: {
        options: {
          banner: "<%= banner %>"
        },
        src:['<%= src.js %>', '<%= src.jsTpl %>'],
        dest:'<%= distdir %>/js/<%= pkg.name %>.js'
      },
      index: {
        src: ['src/index.html'],
        dest: '<%= distdir %>/index.html',
        options: {
          process: true
        }
      },
      angular: {
        src:[
          'bower_components/angular/angular.js',
          'bower_components/angular-sanitize/angular-sanitize.js',
          'bower_components/angular-route/angular-route.js',
          'bower_components/angular-bootstrap-media/dist/angular-bootstrap-media.js'
        ],
        dest: '<%= distdir %>/js/vendor/angular-lib.js'
      },
      ckeditor: {
        src:[
          'bower_components/ckeditor/ckeditor.js',
          'bower_components/ckeditor/adapters/jquery.js'
        ],
        dest: '<%= distdir %>/js/vendor/ckeditor-lib.js'
      },
      bootstrap: {
        src:[
          'bower_components/bootstrap/dist/js/bootstrap.js'
        ],
        dest: '<%= distdir %>/js/vendor/bootstrap-lib.js'
      },
      jquery: {
        src:[
          'bower_components/jquery/dist/jquery.js'
        ],
        dest: '<%= distdir %>/js/vendor/jquery-lib.js'
      },
      stylesheets: {
        src:[
          'bower_components/bootstrap/dist/css/bootstrap.min.css',
          'bower_components/bootstrap/dist/css/bootstrap-theme.min.css'
        ],
        dest: '<%= distdir %>/css/lib.css'
      }
    },
    uglify: {
      dist:{
        options: {
          banner: "<%= banner %>"
        },
        src:['<%= src.js %>' ,'<%= src.jsTpl %>'],
        dest:'<%= distdir %>/js/<%= pkg.name %>.js'
      },
      angular: {
        src:['<%= concat.angular.src %>'],
        dest: '<%= distdir %>/js/vendor/angular-lib.js'
      },
      ckeditor: {
        src:['<%= concat.ckeditor.src %>'],
        dest: '<%= distdir %>/js/vendor/ckeditor-lib.js'
      },
      bootstrap: {
        src:['<%= concat.bootstrap.src %>'],
        dest: '<%= distdir %>/js/vendor/bootstrap-lib.js'
      },
      jquery: {
        src:['<%= concat.jquery.src %>'],
        dest: '<%= distdir %>/js/vendor/jquery-lib.js'
      }
    },
    recess: {
      build: {
        files: {
          '<%= distdir %>/css/<%= pkg.name %>.css': ['<%= src.less %>'] 
        },
        options: {
          compile: true
        }
      },
      min: {
        files: {
          '<%= distdir %>/css/<%= pkg.name %>.css': ['<%= src.less %>']
        },
        options: {
          compress: true
        }
      }
    },
    watch:{
      all: {
        files:['<%= src.js %>', '<%= src.specs %>', '<%= src.lessWatch %>', '<%= src.tpl.app %>', '<%= src.html %>'],
        tasks:['default','timestamp']
      },
      build: {
        files:['<%= src.js %>', '<%= src.specs %>', '<%= src.lessWatch %>', '<%= src.tpl.app %>', '<%= src.html %>'],
        tasks:['build','timestamp']
      }
    },
    jshint:{
      files:['gruntFile.js', '<%= src.js %>', '<%= src.jsTpl %>', '<%= src.specs %>', '<%= src.scenarios %>'],
      options:{
        curly:false,
        eqeqeq:true,
        immed:true,
        latedef:true,
        newcap:true,
        noarg:true,
        sub:true,
        boss:true,
        eqnull:true,
        globals:{}
      }
    }
  });

};
