const fs = require('fs');
const path = require('path');
const CleanCSS = require('clean-css');
const { minify } = require('terser');

async function build() {
    // 1. Minify CSS with CleanCSS Level 2 optimizations
    const cssPath = path.join(__dirname, '..', 'css', 'style.css');
    const minCssPath = path.join(__dirname, '..', 'css', 'style.min.css');
    if (fs.existsSync(cssPath)) {
        const rawCss = fs.readFileSync(cssPath, 'utf8');
        const output = new CleanCSS({
            level: {
                1: {
                    all: true,
                    normalizeUrls: false
                },
                2: {
                    all: true,
                    mergeMedia: true,
                    removeUnusedAtRules: false,
                    restructureRules: true
                }
            }
        }).minify(rawCss);

        fs.writeFileSync(minCssPath, output.styles, 'utf8');
        console.log(`CleanCSS Minified: ${(rawCss.length / 1024).toFixed(2)} KB -> ${(output.styles.length / 1024).toFixed(2)} KB (Savings: ${((1 - output.styles.length / rawCss.length) * 100).toFixed(1)}%)`);
    }

    // 2. Minify JS with Terser
    const jsPath = path.join(__dirname, '..', 'js', 'main.js');
    const minJsPath = path.join(__dirname, '..', 'js', 'main.min.js');
    if (fs.existsSync(jsPath)) {
        const rawJs = fs.readFileSync(jsPath, 'utf8');
        const minified = await minify(rawJs, {
            compress: {
                drop_console: false,
                drop_debugger: true,
                passes: 2
            },
            mangle: true
        });

        fs.writeFileSync(minJsPath, minified.code, 'utf8');
        console.log(`Terser Minified: ${(rawJs.length / 1024).toFixed(2)} KB -> ${(minified.code.length / 1024).toFixed(2)} KB (Savings: ${((1 - minified.code.length / rawJs.length) * 100).toFixed(1)}%)`);
    }
}

build().catch(err => {
    console.error(err);
    process.exit(1);
});
