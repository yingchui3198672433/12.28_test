var gulp = require('gulp');
var sass = require('gulp-sass');
var mincss = require('gulp-clean-css');
var minjs = require('gulp-uglify');
var auto = require('gulp-autoprefixer');
var babel = require('gulp-babel');
var minhtml = require('gulp-htmlmin');
var concat = require('gulp-concat');
var server = require('gulp-webserver');


var url = require('url');
var path = require('path');
var querystring = require('querystring');
var fs = require('fs');


//数据
var data = require('./mock/data.json');
//编译scss
gulp.task('devScss', function() {
    return gulp.src('./src/scss/*.scss')
        .pipe(sass())
        .pipe(mincss())
        .pipe(gulp.dest('./src/css'))
});

//监听scss
gulp.task('watch', function() {
    return gulp.watch('src/**/*.scss', gulp.series('devScss'));
});

//开发环境的服务
gulp.task('devServer', function() {
    serverFun('src');
});

//dev
gulp.task('dev', gulp.series('devScss', 'devServer', 'watch'));


//线上

//js压缩 es6转es5
gulp.task('bJs', function() {
    return gulp.src('./src/js/page/*.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(minjs())
        .pipe(gulp.dest('./build/js/page'))
});

gulp.task('bJss', function() {
    return gulp.src('./src/js/libs/*.{js,min.js}')
        .pipe(gulp.dest('./build/js/libs'))
});

//css
gulp.task('bCss', function() {
    return gulp.src('./src/css/*.css')
        .pipe(gulp.dest('./build/css'))
});

//image
gulp.task('bImage', function() {
    return gulp.src('./src/images/*.jpg')
        .pipe(gulp.dest('./build/images'))
});

//html
gulp.task('bHtml', function() {
    return gulp.src('./src/**/*.html')
        .pipe(minhtml())
        .pipe(gulp.dest('./build'))
});

gulp.task('fonts', function() {
    return gulp.src('./src/fonts/*.{js,css,html,svg,log,ttf,woff,eot}')
        .pipe(gulp.dest('build/fonts'))
})

gulp.task('serverB', function() {
    serverFun('build')
});


//开发环境
gulp.task('build', gulp.series('bJs', 'bJss', 'bCss', 'fonts', 'bImage', 'bHtml', 'serverB'))







//起服务函数
function serverFun(str) {
    return gulp.src(str)
        .pipe(server({
            port: 9090,
            host: '172.21.66.17',
            open: true,
            livereload: true,
            middleware: function(req, res, next) {
                var pathname = url.parse(req.url, true).pathname;
                if (pathname == '/favicon.ico') {
                    res.end('');
                    return;
                }
                if (pathname == '/api/data') {
                    res.end(JSON.stringify({ code: 1, data: data }));
                } else if (pathname === '/api/list') {
                    var Requirement = decodeURI(url.parse(req.url, true).query.val);
                    if (Requirement) {
                        var arr = [];
                        data.forEach(function(item) {
                            if (item.type.match(Requirement) != null) {
                                arr.push(item)
                            }
                        })
                        if (arr) {
                            res.end(JSON.stringify({ code: 6, list: arr }));
                        } else {
                            res.end(JSON.stringify({ code: 5, msg: '换一个试试' }));
                        }
                    }
                } else {
                    pathname = pathname == '/' ? 'index.html' : pathname;
                    var file = fs.readFileSync(path.join(__dirname, str, pathname));
                    res.end(file);
                }
            }
        }))
}