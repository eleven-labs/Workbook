module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: './',
    
    frameworks: ['jasmine'],
    
    // list of files / patterns to load in the browser
    files: [
      'bower_components/jquery/dist/jquery.js',
      'bower_components/bootstrap/dist/js/bootstrap.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-sanitize/angular-sanitize.js',
      'bower_components/ckeditor/ckeditor.js',
      'bower_components/ckeditor/adapters/jquery.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/underscore/underscore.js',
      'http://maps.google.com/maps/api/js?sensor=false',
      'dist/js/**/*.js',
      'test/unit/**/*.spec.js'
    ],
    
    // use dots reporter, as travis terminal does not support escaping sequences
    // possible values: 'dots' || 'progress'
    reporters: 'progress',
    
    // these are default values, just to show available options
    
    // web server port
    port: 8089,
    
    // cli runner port
    runnerPort: 9109,
    
    urlRoot: '/__test/',
    
    // enable / disable colors in the output (reporters and logs)
    colors: true,
    
    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,
    
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,
    
    // polling interval in ms (ignored on OS that support inotify)
    autoWatchInterval: 0,
    
    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari
    // - PhantomJS
    browsers: ['PhantomJS'],
    
    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true
  });
};
