'use strict';

var gulp = require ('gulp'),
    prefixer = require ('gulp-autoprefixer'),
    cache = require ('gulp-cache'),
    imagemin = require ('gulp-imagemin'),
    cssmin = require ('gulp-minify-css'),
    rigger = require ('gulp-rigger'),
    sass = require ('gulp-sass'),
    sourcemaps = require ('gulp-sourcemaps'),
    uglify = require ('gulp-uglify'),
    watch = require ('gulp-watch'),
    pngquant = require ('imagemin-pngquant'),
    rimraf = require ('rimraf'),
    browserSync = require ('browser-sync'),
    reload = browserSync.reload,
    notify = require( 'gulp-notify' );

var path = {
    dist: { //куда складывать готовые после сборки файлы
        html: 'dist/',
        js: 'dist/js/',
        jsInst: 'dist/js/lib/',
        css: 'dist/css/',
        cssInst: 'dist/css/lib/',
        img: 'dist/img/',
        fonts: 'dist/fonts/',
        fontAwes: 'dist/css/'
    },
    app: { //откуда брать исходники
        html: 'app/*.html',
        js: 'app/js/*.js',
        jsInst: 'app/js/library/library.js',
        style: ['app/style/main.scss', 'app/style/responsive.scss'],
        styleInst: 'app/style/library/*.css',
        img: 'app/images/**/*.*',
        fonts: 'app/fonts/**/*.*',
        fontAwes: 'app/style/font-awesome.css'
    },
    watch: { //за изменением каких файлов нужно наблюдать
        html: 'app/**/*.html',
        js: 'app/js/**/*.js',
        jsInst: 'app/js/library/*.js',
        style: 'app/style/**/*.+(scss|css)',
        styleInst: 'app/style/library/*.css',
        img: 'app/images/**/*.*',
        fonts: 'app/fonts/**/*.*',
        fontAwes: 'app/style/font-awesome.css'
    },
    clean: './dist'
};

var config = {
    server: {
        baseDir: "./dist"
    },
    tunnel: false,
    host: 'localhost',
    port: 9000,
    logPrefix: "Frontend_Devil"
};

gulp.task('html:dist', function () {  // сборка HTML
    return gulp.src(path.app.html)
        .pipe(rigger())
        .pipe(gulp.dest(path.dist.html))
        .pipe(reload({stream: true}));
});

gulp.task('js:dist', function () {   // cборка Javasxript
    return gulp.src(path.app.js) //Найдем наш main файл
        .pipe(rigger()) //Прогоним через rigger
        .pipe(sourcemaps.init()) //Инициализируем sourcemap
        .pipe(uglify()) //Сожмем наш js
        .pipe(sourcemaps.write('./MAPS')) //Пропишем карты
        .pipe(gulp.dest(path.dist.js)) //Выплюнем готовый файл в dist
        .pipe(reload({stream: true})); //И перезагрузим сервер
});

gulp.task('jsInst:dist', function () {   // cборка плагинов (js)
    return gulp.src(path.app.jsInst) //Найдем файлы js
        .pipe(rigger()) //Прогоним через rigger
        .pipe(uglify()) //Сожмем  js
        .pipe(gulp.dest(path.dist.jsInst)) //запишем готовый файл в dist
        .pipe(reload({stream: true})); //И перезагрузим сервер
});

gulp.task('style:dist', function () {  //cборка scss
    return gulp.src(path.app.style) //Выберем наш main.scss
        .pipe(sourcemaps.init()) //То же самое что и с js
        .pipe(sass().on( 'error', notify.onError({
              message: "<%= error.message %>",   // notify - проверка на ошибки
              title  : "Sass Error!"              // без прерывания watch
            } ) ))          //Скомпилируем
        .pipe(prefixer()) //Добавим вендорные префиксы
        .pipe(cssmin()) //Сожмем
        .pipe(sourcemaps.write('./MAPS'))
        .pipe(gulp.dest(path.dist.css)) //И в dist
        .pipe(reload({stream: true}));
});

gulp.task('styleInst:dist', function () {  //cборка плагинов (scss)
    return gulp.src(path.app.styleInst) //Выберем файлы
    .pipe(sass().on( 'error', notify.onError({
        message: "<%= error.message %>",   // notify - проверка на ошибки
        title  : "Sass Error!"              // без прерывания watch
      } ) ))
        .pipe(cssmin()) //Сожмем
        .pipe(gulp.dest(path.dist.cssInst)) //И в dist
        .pipe(reload({stream: true}));
});

gulp.task('images:dist', function () {  //Сборка картинок
    return gulp.src(path.app.img) //Выберем наши картинки
        .pipe(imagemin({ //Сожмем их
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.dist.img)) //И бросим в build
        .pipe(reload({stream: true}));
});

gulp.task('fonts:dist', function() {  //Сборка шрифтов
    return gulp.src(path.app.fonts)
        .pipe(gulp.dest(path.dist.fonts))
});

gulp.task('fontAwes:dist', function() {  //запись Awesome
    return gulp.src(path.app.fontAwes)
        .pipe(gulp.dest(path.dist.fontAwes))
});

gulp.task('dist', gulp.parallel(  // ЕДИНАЯ сборка
    'html:dist',
    'js:dist',
    'jsInst:dist',
    'style:dist',
    'styleInst:dist',
    'fonts:dist',
    'fontAwes:dist',
    'images:dist'
));

gulp.task('watch', function(){  //контроль изменений
    gulp.watch(path.watch.html, gulp.series('html:dist'));
    gulp.watch(path.watch.style, gulp.series('style:dist'));
    gulp.watch(path.watch.styleInst, gulp.series('styleInst:dist'));
    gulp.watch(path.watch.js, gulp.series('js:dist'));
    gulp.watch(path.watch.jsInst, gulp.series('jsInst:dist'));
    gulp. watch(path.watch.img, gulp.series('images:dist'));
    gulp.watch(path.watch.fonts, gulp.series('fonts:dist'));
    gulp.watch(path.watch.fonts, gulp.series('fontAwes:dist'));
})

gulp.task('webserver', function () {  //веб сервер
    browserSync(config);
});

gulp.task('clean', function (cb) {  // чиска папки dist (удаление)
    rimraf(path.clean, cb);
});
                            //полная сборка по умолчанию
gulp.task('default', gulp.series('dist', gulp.parallel('webserver', 'watch')));
