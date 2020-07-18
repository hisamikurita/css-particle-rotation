// JavaScript Document
const gulp = require('gulp')
const sass = require('gulp-sass')
const changed = require('gulp-changed')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const flexBugsFixies = require('postcss-flexbugs-fixes')
const imagemin = require('gulp-imagemin')
const imageminPngquant = require('imagemin-pngquant')
const imageminMozjpeg = require('imagemin-mozjpeg')
const csscomb = require('gulp-csscomb')
const plumber = require('gulp-plumber')
const pug = require("gulp-pug");

//画像圧縮オプションプロジェクト毎に変更//////////////////
const imageminOption = [
  imageminPngquant({ quality: '65-80' }),
  imageminMozjpeg({ quality: 80 }),
  imagemin.gifsicle(),
  imagemin.jpegtran(),
  imagemin.optipng(),
  imagemin.svgo()
]

// setting : Pug Options
const pugOptions = {
  pretty: true,
};
// pugコンパイル
gulp.task("pug", done => {
  gulp
  return gulp.src('./src/pug/index.pug')
    .pipe(pug(pugOptions))
    .pipe(gulp.dest('dist/'));
});

//cssコンパイル//////////////////
gulp.task('sass', () => {
  return gulp.src('./src/scss/style.scss')
    .pipe(plumber())
    .pipe(sass({ outputStyle: 'expanded' }))
    .pipe(postcss([autoprefixer()]))
    .pipe(postcss([flexBugsFixies()]))
    .pipe(csscomb())
    .pipe(gulp.dest('dist/css'))
});
//画像圧縮//////////////////
gulp.task('imagemin', () => {
  return gulp
    .src('src/images/**/*')
    .pipe(changed('dist/images/**/*'))
    .pipe(imagemin(imageminOption))
    .pipe(gulp.dest('dist/images/'))
});
// ファイルを常に監視//////////////////
gulp.task('watch', function () {
  gulp.watch('./src/scss/**/*.scss', gulp.series('sass'))
  gulp.watch('./src/images/**/*', gulp.series('imagemin'))
});
// タスクの実行の順番//////////////////
gulp.task('default', gulp.series('imagemin', 'watch'));