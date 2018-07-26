import { src, dest, watch as watchSrc, parallel, series } from 'gulp'
import babel from 'gulp-babel'
import del from 'del'
import cssnano from 'cssnano'
import injectSvg from 'gulp-inject-svg'
import postcss from 'gulp-postcss'
import postcssExtend from 'postcss-extend'
import postcssNested from 'postcss-nested'
import postcssSimpleVars from 'postcss-simple-vars'
import postcssEach from 'postcss-each'
import atImport from 'postcss-import'
import reporter from 'postcss-reporter'
import pug from 'gulp-pug'
import stylelint from 'gulp-stylelint'
import filter from 'gulp-filter'

const SRC_DIR = `app/src`
const DIST_DIR = 'app/dist'

const JS_GLOB = `${SRC_DIR}/**/*.js`
const CSS_GLOB = `${SRC_DIR}/**/*.css`
const CSS_PARTIAL_GLOB = `${SRC_DIR}/**/_*.css`
const VIEWS_GLOB = `${SRC_DIR}/**/*.pug`
const VIEWS_PARTIAL_GLOB = `${SRC_DIR}/**/_*.pug`
const SVG_GLOB = `${SRC_DIR}/**/*.pug`

export const clean = () => {
    return del([DIST_DIR])
}

export const scripts = () => {
    return src(JS_GLOB, { base: SRC_DIR })
        .pipe(babel())
        .pipe(dest(DIST_DIR))
}

export const views = () => {
    return src([VIEWS_GLOB, `!${VIEWS_PARTIAL_GLOB}`], { base: SRC_DIR })
        .pipe(pug())
        .pipe(injectSvg())
        .pipe(dest(DIST_DIR))
}

export const styles = () => {
    return src([CSS_GLOB, `!${CSS_PARTIAL_GLOB}`], { base: SRC_DIR })
        .pipe(
            stylelint({
                reporters: [
                    {
                        formatter: 'string',
                        console: true
                    }
                ]
            })
        )
        .pipe(filter(['**', `!${CSS_PARTIAL_GLOB}`]))
        .pipe(
            postcss([
                atImport,
                postcssEach,
                postcssSimpleVars,
                postcssExtend,
                postcssNested,
                cssnano,
                reporter({ clearReportMessages: true })
            ])
        )
}

export const watch = () => {
    watchSrc(JS_GLOB).on('change', () => {
        scripts()
    })
    watchSrc(CSS_GLOB).on('change', styles)
    watchSrc(VIEWS_GLOB).on('change', () => {
        console.log('view update')
        views()
    })
    watchSrc(SVG_GLOB).on('change', views)
}

const mainTasks = parallel(scripts, views, styles)
export const build = series(clean, mainTasks)
export const dev = series(build, watch)

export default build
