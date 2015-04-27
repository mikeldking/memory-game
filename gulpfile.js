var gulp = require('gulp'),
    browserify = require('gulp-browserify'),
    $ = require('gulp-load-plugins')(),
    concat = require('gulp-concat'),
    argv = require('minimist')(process.argv.slice(2));

// Settings
var RELEASE = !!argv.release;
var AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
];

gulp.task('browserify', function() {
    gulp.src('src/js/main.js')
        .pipe(browserify({transform: 'reactify'}))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('styles', function() {
    return gulp.src('src/styles/main.less')
        .pipe($.plumber())
        .pipe($.less({
            sourceMap: !RELEASE,
            sourceMapBasepath: __dirname
        }))
        .on('error', console.error.bind(console))
        .pipe($.autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
        .pipe($.csscomb())
        .pipe($.if(RELEASE, $.minifyCss()))
        .pipe(gulp.dest('dist/css'))
        .pipe($.size({title: 'styles'}));
});

gulp.task('build', ['browserify', 'styles']);

gulp.task('watch', function(){
    gulp.watch('src/**/*.*', ['build']);
});