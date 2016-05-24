// generated on 2016-04-01 using generator-gulp-webapp 1.1.1
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import del from 'del';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;


gulp.task('styles', () => {
  return gulp.src('app/css/*.scss')
    .pipe($.plumber())
    .pipe($.compass({
    	config_file: 'app/css/config.rb',
        sass : 'app/css/sass',
        css : '.tmp/css'
    }).on('error', function(err) {
      console.log(err)
    }))
    .pipe(reload({stream: true}));
});


// gulp.task('scripts', () => {
//   return gulp.src('app/js/**/*.js')
//     .pipe($.plumber())
//     .pipe($.babel())
//     .pipe(gulp.dest('.tmp/js'))
//     .pipe(reload({stream: true}));
// });


gulp.task('scripts',function(){
    gulp.src('app/js/**/*.js')
    .pipe($.plumber())
    .pipe($.babel())
    .pipe($.browserify())
    .pipe(gulp.dest('.tmp/js'))
    .pipe(reload({stream: true}));
});


gulp.task('html', ['styles', 'scripts'], () => {
  return gulp.src('app/*.html')
    .pipe($.useref({searchPath: ['.tmp', 'app', '.']}))
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.cssnano()))
    .pipe($.if('*.html', $.htmlmin({collapseWhitespace: true})))
    .pipe(gulp.dest('dist'));
});


gulp.task('images', () => {
  return gulp.src('app/images/**/*')
    .pipe($.if($.if.isFile, $.cache($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
    }))
    .on('error', function (err) {
      console.log(err);
      this.end();
    })))
    .pipe(gulp.dest('dist/images'));
});


gulp.task('fonts', () => {
  return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', function (err) {})
    .concat('app/fonts/**/*'))
    .pipe(gulp.dest('.tmp/fonts'))
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('extras', () => {
  return gulp.src([
    'app/*.*',
    '!app/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('serve', ['styles', 'scripts', 'fonts'], () => {
  browserSync({
    notify: false,
    port: 8000,
    server: {
      baseDir: ['.tmp', 'app'],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch([
    'app/*.html',
    '.tmp/js/**/*.js',
    '.tmp/css/*.css',
    'app/images/**/*',
    '.tmp/fonts/**/*'
  ]).on('change', reload);

  gulp.watch('app/css/**/*.scss', ['styles']);
  gulp.watch('app/js/**/*.js', ['scripts']);
  gulp.watch('app/fonts/**/*', ['fonts']);
});

gulp.task('serve:dist', () => {
  browserSync({
    notify: false,
    port: 8000,
    server: {
      baseDir: ['dist']
    }
  });
});


gulp.task('build', [ 'html', 'images', 'fonts', 'extras'], () => {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], () => {
  gulp.start('build');
});