'use strict';

var gulp = require('gulp');
var imageResize = require('gulp-image-resize');
var imagemin = require('gulp-imagemin');
const webp = require('imagemin-webp');
const extReplace = require('gulp-ext-replace');
var sass = require('gulp-sass')(require('sass'));
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
const glob = require('glob');
const path = require('path');
const sourceFolders = glob.sync('_images/*/')

gulp.task('resize-images-webp', async function () {

    for (const bundle of sourceFolders) {

        // get just the last directory of 'js/dev/bootstrap', 'js/dev/lib`, etc.
        let thisBundle = path.basename(bundle);
        console.log('thisBundle = ' + thisBundle);
        const files = await gulp.src(bundle + '/*.*')
        .pipe(imagemin([
            webp({preset: 'photo', quality: 85, resize: {width: 2560, height:0},method: 6}),
          ]))
        .pipe(extReplace('.webp'))
        .pipe(gulp.dest((bundle + '/fulls').replace('_images','images')));
        
        const files_2 = await gulp.src(bundle + '/*.*')
        .pipe(imagemin([
            webp({preset: 'photo', quality: 85, resize: {width: 960, height:0},method: 6}),
          ]))
        .pipe(extReplace('.webp'))
        .pipe(gulp.dest((bundle + '/thumbs').replace('_images','images')));
        
    }

    
});


gulp.task('resize-images', async function () {
    for (const bundle of sourceFolders) {

        // get just the last directory of 'js/dev/bootstrap', 'js/dev/lib`, etc.
        let thisBundle = path.basename(bundle);
        console.log('thisBundle = ' + thisBundle);
        gulp.src(bundle + '/*.*')
        .pipe(imageResize({
            width: 1920,
            imageMagick: true
        }))
        .pipe(imagemin([
            imagemin.mozjpeg({quality: 85, progressive: true}),
            imagemin.optipng({optimizationLevel: 5})]
        ))
        .pipe(gulp.dest((bundle + '/fulls').replace('_images','images')));
        
        gulp.src(bundle + '/*.*')
        .pipe(imageResize({
            width: 720,
            imageMagick: true
        }))
        .pipe(imagemin([
            imagemin.mozjpeg({quality: 85, progressive: true}),
            imagemin.optipng({optimizationLevel: 5})]
        ))
        .pipe(gulp.dest((bundle + '/thumbs').replace('_images','images')));
        
    }

    //return Promise.all(promises).then(z => {console.log('Resize complete: ', z.length)})
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
gulp.task('default', gulp.series('build', 'resize-images','resize-images-webp'));
