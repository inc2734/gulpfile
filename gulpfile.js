var gulp          = require('gulp');
var sass          = require('gulp-sass');
var autoprefixer  = require('gulp-autoprefixer');
var concat        = require('gulp-concat');
var rename        = require('gulp-rename');
var uglify        = require('gulp-uglify');
var imagemin      = require('gulp-imagemin');
var pngquant      = require('imagemin-pngquant');
var browserSync   = require('browser-sync');


//Sass用
var styleSrc      = 'src/sass/*.scss',   //sass/css source
    styleDest     = 'assets/css';        //sass destination
    sassOptions   = {
      errLogToConsole: false,
          outputStyle: 'compressed'      //compressedはminify expandedはminifyじゃない
    };
    autoprefixerOptions = {
      browsers: ['last 2 versions', '> 5%', 'Firefox ESR'] //browserの一覧 https://github.com/ai/browserslist#queries
    };

gulp.task('sass', function () {
  return gulp
    .src(styleSrc)
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(styleDest))
    .pipe(browserSync.reload({stream: true}));
});

//JS用
var jsFiles = 'src/js/**/*.js',   //js source
    jsDest  = 'assets/js';        //js destination

gulp.task('scripts', function() {
    return gulp.src(jsFiles)
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest(jsDest));
});

var jsFiles = 'src/js/**/*.js',   //js file source
    jsDest  = 'assets/js';        //js destination

gulp.task('scripts', function() {
    return gulp.src(jsFiles)
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest(jsDest))
        .pipe(rename('scripts.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(jsDest));
});

//画像
gulp.task('images', function () {
	gulp.src('src/img/**/*') //img の src
    .pipe(imagemin({
      optimizationLevel: 5,
      progressive: true,
      svgoPlugins: [{removeUnknownsAndDefaults: false}, {cleanupIDs: false}],
      use: [pngquant({quality: '60-70', speed: 1})]
    }))
		.pipe(gulp.dest('assets/img')); //img の destination
});

//Browsersync
gulp.task('bs-reload', function () {
    browserSync.reload();
});

gulp.task('browser-sync', function () {
    browserSync({
        proxy: "http://wbymg.dev/" // hostnameはここ！
    });
});

gulp.task('default', ['sass','scripts','browser-sync'], function () {
  gulp.watch("src/sass/**/*.scss", ['sass']);
  gulp.watch("scr/js/**/*.js", ['scripts']);
  gulp.watch("*.php", ['bs-reload']);
});


// terminal commands ↓↓↓
// gulp - for dev stuff
// gulp images - for images
