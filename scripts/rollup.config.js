const path = require('path');
const nodeResolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const replace = require('rollup-plugin-replace');
const commonjs = require('rollup-plugin-commonjs');
const flow = require('rollup-plugin-flow');
const { uglify } = require('rollup-plugin-uglify');
const { pascalCase } = require('change-case');


const packageName = process.env.PACKAGE_NAME;
const build = process.env.BUILD;
const ROOT = process.cwd();

const config = {
    entry: `${ROOT}/lib/index`,
    external: ['react'],
    moduleName: 'redux-worker',
    plugins: [
        babel({ exclude: '**/node_modules/**' }),
    ],
};

if (build === 'es' || build === 'cjs') {
    config.external.push(
        'fbjs/lib/shallowEqual',
        'hoist-non-react-statics',
        'change-emitter',
        'symbol-observable',
        'react-relay',
        'recompose'
    );
    config.dest = path.resolve(ROOT, `./dist/redux-worker/${build}/index.js`);
    config.format = build;
}

if (build === 'umd') {
    config.dest = path.resolve(ROOT, `./dist/redux-worker/build/index.js`);
    config.format = 'umd';
    config.plugins.push(
        nodeResolve({
            jsnext: true,
        }),
        commonjs(),
        replace({
            'process.env.NODE_ENV': JSON.stringify('development'),
        })
    );
}

if (build === 'min') {
    config.dest = path.resolve(ROOT, `./dist/redux-worker/build/index.min.js`);
    config.format = 'umd';
    config.plugins.push(
        nodeResolve({ jsnext: true }),
        commonjs(),
        flow(),
        replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
        uglify()
    );
}

export default config;
