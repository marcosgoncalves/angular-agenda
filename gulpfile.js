// Installs the required missing modules
(function () {
    var r = require;
    require = function (n) {
        try {
            return r(n);
        } catch (err) {
            var cmd = 'npm i ' + n + ' --save';
            console.log('\n');
            console.log('** Required module "' + n + '" not found. Trying to install it **\n');
            console.log('running: ' + cmd + '\n');
            r('child_process').execSync(cmd, {stdio: [0, 1, 2]});
            console.log('\n');
            return r(n);
        }
    };
})();

// Load plugins
var gulp = require('gulp'),
    karma = require('gulp-karma'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    lr = require('tiny-lr'),
    server = lr();

// Update depenencies
gulp.task('npmUpdate', function () {
    var update = require('gulp-update');
    gulp.watch('./package.json').on('change', function (file) {
        update.write(file);
    });
});
gulp.task('update', ['npmUpdate']);

// Tests
var testFiles = ['test/*.js'];
gulp.task('test', function () {
    // Be sure to return the stream
    return gulp.src(testFiles)
        .pipe(karma({
            configFile: 'karma.conf.js',
            action: 'run'
        }))
        .on('error', function (err) {
            // Make sure failed tests cause gulp to exit non-zero
            throw err;
        });
});



// Styles
gulp.task('styles', function () {
    return gulp.src('src/styles/main.scss')
        .pipe(sass({
            style: 'expanded',
        }))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest('dist/styles'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(minifycss())
        .pipe(livereload(server))
        .pipe(gulp.dest('dist/styles'))
        .pipe(notify({
            message: 'Styles task complete'
        }));
});

// Scripts
gulp.task('scripts', function () {
    return gulp.src('src/scripts/**/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/scripts'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(livereload(server))
        .pipe(gulp.dest('dist/scripts'))
        .pipe(notify({
            message: 'Scripts task complete'
        }));
});

// Images
gulp.task('images', function () {
    return gulp.src('src/images/**/*')
        .pipe(cache(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(livereload(server))
        .pipe(gulp.dest('dist/images'))
        .pipe(notify({
            message: 'Images task complete'
        }));
});

// Clean
gulp.task('clean', function () {
    return gulp.src(['dist/styles', 'dist/scripts', 'dist/images'], {
            read: false
        })
        .pipe(clean());
});

// Default task
gulp.task('default', ['clean'], function () {
    //gulp.run('styles', 'scripts', 'images');
    /* gulp.src(testFiles)
        .pipe(karma({
            configFile: 'karma.conf.js',
            action: 'watch'
        })); */
});

// Watch
gulp.task('watch', function () {
    // Listen on port 35729
    server.listen(35729, function (err) {
        if (err) {
            return console.log(err);
        }

        // Watch .scss files
        gulp.watch('src/styles/**/*.scss', function (event) {
            console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
            gulp.run('styles');
        });

        // Watch .js files
        gulp.watch('src/scripts/**/*.js', function (event) {
            console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
            gulp.run('scripts');
        });

        // Watch image files
        gulp.watch('src/images/**/*', function (event) {
            console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
            gulp.run('images');
        });
    });
});