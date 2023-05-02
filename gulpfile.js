'use strict';

var gulp = require('gulp');
var imageResize = require('gulp-image-resize');
var sass = require('gulp-sass')(require('sass'));
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var del = require('del');
const glob = require('glob');
const path = require('path');
const imageFolders = glob.sync('images/*/')

// gulp.task('delete', function () {
//     return del(['images/*.*']);
// });

gulp.task('resize-images', function () {

    const promises = []
    for (const bundle of imageFolders) {

        // get just the last directory of 'js/dev/bootstrap', 'js/dev/lib`, etc.
        let thisBundle = path.basename(bundle);
        console.log('thisBundle = ' + thisBundle);
        promises.push(gulp.src(bundle + '/*.*')
        .pipe(imageResize({
            width: 1920,
            imageMagick: true
        }))
        .pipe(gulp.dest(bundle + '/fulls'))
        .pipe(imageResize({
            width: 720,
            imageMagick: true
        }))
        .pipe(gulp.dest(bundle + '/thumbs')));
        
    }

    return Promise.all(promises)
    
});

// compile scss to css
gulp.task('sass', function () {
    return gulp.src('./assets/sass/main.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename({basename: 'main.min'}))
        .pipe(gulp.dest('./assets/css'));
});

// watch changes in scss files and run sass task
gulp.task('sass:watch', function () {
    gulp.watch('./assets/sass/**/*.scss', ['sass']);
});

// minify js
gulp.task('minify-js', function () {
    return gulp.src('./assets/js/main.js')
        .pipe(uglify())
        .pipe(rename({basename: 'main.min'}))
        .pipe(gulp.dest('./assets/js'));
});

// build task
gulp.task('build', gulp.series('sass', 'minify-js'));

// resize images
// gulp.task('resize', gulp.series('delete', 'resize-images'));

// default task
gulp.task('default', gulp.series('build', 'resize-images'));
