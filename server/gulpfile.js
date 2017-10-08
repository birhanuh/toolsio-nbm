var gulp = require('gulp'), 
  nodemon = require('gulp-nodemon'),
  babel = require('gulp-babel'),
  Cache = require('gulp-file-cache')
  jest = require('jest-cli')

var selenium = require('selenium-standalone'),
  webdriver = require('gulp-webdriver')

var cache = new Cache();

// Development 
gulp.task('compile', function () {
  var stream = gulp.src(['./src/**/*.js', '!./src/__test__']) // your ES2015 code 
    .pipe(cache.filter()) // remember files 
    .pipe(babel({})) // compile new ones 
    .pipe(cache.cache()) // cache them 
    .pipe(gulp.dest('./dist')) // write them 
  return stream // important for gulp-nodemon to wait for completion 
})

gulp.task('server', ['compile'], function () {
  var stream = nodemon({
    script: 'dist/', // run ES5 code 
    watch: 'src', // watch ES2015 code 
    tasks: ['compile'],
    env: { 'NODE_ENV': 'development' } // compile synchronously onChange 
  })
 
  return stream
})

// Test
gulp.task('server-with-test-db', function () {
  nodemon({
    script: 'dist/',
    env: { 'NODE_ENV': 'test' }
  })
})

var jestConfig = {
  rootDir: './src/__test__'
}

gulp.task('jest', function(done) {
  
  process.env.DB_HOST = 'mongodb://localhost/'
  process.env.DB_TEST = 'toolsio_test'

  jest.runCLI({ config : jestConfig }, ".", function() {
    done()
  })
})

// gulp.task('tdd', function(done) {
//   gulp.watch([ jestConfig.rootDir + "/**/*.js" ], [ 'jest' ]);
// })

gulp.task('selenium', function (done) {
  selenium.install({
    logger: function (message) { }
  }, function (err) {
    if (err) return done(err)

    selenium.start(function (err, child) {
      if (err) return done(err)
      selenium.child = child;
      done()
    })
  })
})

gulp.task('test:e2e', ['server-with-test-db', 'selenium'], function() {
  
  process.env.DB_HOST = 'mongodb://localhost/'
  process.env.DB_TEST= 'toolsio_test'

  return gulp.src('wdio.conf.js').pipe(webdriver())
})

gulp.task('it-test', ['test:e2e'], function () {
  selenium.child.kill()
})