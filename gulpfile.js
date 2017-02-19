'use strict';

const gulp = require('gulp');
const tar = require('gulp-tar');          // https://www.npmjs.com/package/gulp-tar
const gzip = require('gulp-gzip');         // https://www.npmjs.com/package/gulp-gzip
const notify = require('gulp-notify');

const browserSync = require('browser-sync').create();
const del = require('del');

const distPath = 'dist/';

gulp.task('clean', () =>
  del(['dist/**'])
);

gulp.task('copyFiles', () =>
  gulp.src('./src/**/*')
    .pipe(gulp.dest(distPath))
);

gulp.task('browser-sync', () => {
  browserSync.init(['dist/css/**.css', 'dist/js/**.js', 'dist/**.html'], {  // Look for changes in dist directories
    server: 'dist'  // Reload browser when any JS is modified or inject CSS when any stylesheet is modified
  });
});

gulp.task('watch', ['browser-sync'], () => {
  gulp.watch('src/css/*.css');
  gulp.watch('src/js/*.js');
  gulp.watch('src/*.html');
});

gulp.task('compress', () =>
  gulp.src('dist/*')
    .pipe(tar('code.tar'))   // Pack all the files together
    .pipe(gzip())            // Compress the package using gzip
    .pipe(gulp.dest('.'))
    .pipe(notify('Compressed package generated!'))
);

gulp.task('deploy', ['copyFiles', 'compress']);

gulp.task('default', ['copyFiles']);
