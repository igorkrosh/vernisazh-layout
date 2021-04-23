let projectFolder = 'dist';
let sourceFolder = 'src';

let fs = require('fs');

let path = {
    build: {
        html: `${projectFolder}/`,
        css: `${projectFolder}/assets/css/`,
        js: `${projectFolder}/assets/js/`,
        img: `${projectFolder}/assets/images/`,
        fonts: `${projectFolder}/assets/fonts/`
    },
    src: {
        html: [`${sourceFolder}/*.html`, `!${sourceFolder}/_*.html`],
        pug: `${sourceFolder}/*.pug`,
        css: [`${sourceFolder}/scss/style.scss`, `${sourceFolder}/scss/bundle.scss`],
        js: [`${sourceFolder}/js/index.js`],
        img: `${sourceFolder}/images/**/*.+(png|jpg|gif|ico|svg|webp)`,
        fonts: `${sourceFolder}/fonts/*.ttf`
    },
    watch: {
        html: `${sourceFolder}/**/*.html`,
        pug: `${sourceFolder}/**/*.pug`,
        css: `${sourceFolder}/scss/**/*.scss`,
        js: `${sourceFolder}/js/**/*.js`,
        img: `${sourceFolder}/images/**/*.+(png|jpg|gif|ico|svg|webp)`,
    },
    clean: `./${projectFolder}/`
}

let { src, dest } = require('gulp');
let gulp = require('gulp');
let browsersync = require('browser-sync').create();
let fileinclude = require('gulp-file-include');
let del = require('del');
let scss = require('gulp-sass');
let autoprefixer = require('gulp-autoprefixer');
let groupMedia = require('gulp-group-css-media-queries');
let ttf2woff = require('gulp-ttf2woff');
let ttf2woff2 = require('gulp-ttf2woff2');
let browserify = require('browserify');
let source = require('vinyl-source-stream');
let cssimport = require('gulp-cssimport');
let pug = require('gulp-pug');
let cleanCss = require('gulp-clean-css');
let rename = require('gulp-rename');
let uglifyEs = require('gulp-uglify-es').default;
let vinylBuffer = require('vinyl-buffer');

gulp.task('bundle', function() {
    return browserify(`${sourceFolder}/js/bundle.js`)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(dest(path.build.js));
});

gulp.task('build', function() {
    return gulp.series(Clean, BundleJS, gulp.parallel(JS, CSS, HTML, PUG, IMG, FONTS), FontsStyle);
});

function FontsStyle(cb) {
    let fileContent = fs.readFileSync(sourceFolder + '/scss/fonts.scss');
    if (fileContent == '') 
    {
        fs.writeFile(sourceFolder + '/scss/fonts.scss', '', cb);
        return fs.readdir(path.build.fonts, function (err, items) 
        {
            if (items) 
            {
                let cFontname;
                for (var i = 0; i < items.length; i++) 
                {
                    let fontname = items[i].split('.');
                    fontname = fontname[0];
                    if (cFontname != fontname) 
                    {
                        fs.appendFile(sourceFolder + '/scss/fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
                    }
                    cFontname = fontname;
                }
            }
        })
    }
    cb();
}

function BundleJS(cb)
{
    browserify(`${sourceFolder}/js/bundle.js`)
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(vinylBuffer())
        .pipe(uglifyEs())
        .pipe(
            rename({
                extname: '.min.js'
            })
        )
        .pipe(dest(path.build.js));
    cb();
}    
function cb() { }

function BrowserSync(params)
{
    browsersync.init({
        server: {
            baseDir: `./${projectFolder}/`
        },
        port: 3000,
        notify: false,
    })
}

function WatchFiles(params)
{
    gulp.watch([path.watch.html], HTML);
    gulp.watch([path.watch.pug], PUG);
    gulp.watch([path.watch.css], CSS);
    gulp.watch([path.watch.js], JS);
    gulp.watch([path.watch.img], IMG);
}

function Clean(params)
{
    return del(path.clean);
}

function HTML()
{
    return src(path.src.html)
        .pipe(fileinclude())
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream());
}

function PUG()
{
    return src(path.src.pug)
        .pipe(
            pug({
                pretty: '    '
            })
        )
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream());
}

function CSS()
{
    return src(path.src.css)
        .pipe(
            scss({
                outputStyle: 'expanded'
            })
        )
        .pipe(cssimport())
        .pipe(groupMedia())
        .pipe(
            autoprefixer({
                overrideBrowserslist: ['last 5 versions'],
                cascade: true
            })
        )
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream())
        .pipe(cleanCss())
        .pipe(
            rename({
                extname: '.min.css'
            })
        )
        .pipe(dest(path.build.css));
}

function JS()
{
    return src(path.src.js)
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream());
}

function IMG()
{
    return src(path.src.img)
        .pipe(dest(path.build.img))
        .pipe(browsersync.stream());
}

function FONTS()
{
    src(path.src.fonts)
        .pipe(ttf2woff())
        .pipe(dest(path.build.fonts));

    return src(path.src.fonts)
        .pipe(ttf2woff2())
        .pipe(dest(path.build.fonts));
}

let build = gulp.series(Clean, BundleJS, gulp.parallel(JS, CSS, HTML, PUG, IMG, FONTS), FontsStyle);
let watch = gulp.parallel(build, WatchFiles, BrowserSync);

exports.bundleJs = BundleJS;
exports.fontsStyle = FontsStyle;
exports.fonts = FONTS;
exports.images = IMG;
exports.js = JS;
exports.css = CSS;
exports.html = HTML;
exports.pug = PUG;
exports.build = build;
exports.watch = watch;
exports.default = watch;