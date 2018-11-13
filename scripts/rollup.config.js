const { resolve } = require('path');
const nodeResolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const replace = require('rollup-plugin-replace');
const commonjs = require('rollup-plugin-commonjs');
const flow = require('rollup-plugin-flow');
const {uglify} = require('rollup-plugin-uglify');
const {pascalCase} = require('change-case');

const { path: { dist } } = require('./settings.json');


const ROOT_PATH = process.cwd();
const build = process.env.BUILD;

/**
 * @param {String} formatType
 * @param {String} ?filename
 * @return {String}
 */
function combineDistFilePath(formatType, filename = 'index.js') {
  return resolve(ROOT_PATH, dist, formatType, filename);
}

const baseConfig = {
  entry: `${ROOT_PATH}/lib/index`,
  external: [],
  moduleName: 'redux-worker',
  plugins: [babel({
    exclude: '**/node_modules/**'
  })],
};

if (build === 'es' || build === 'cjs') {
  baseConfig.external.push(
    'fbjs/lib/shallowEqual',
    'hoist-non-react-statics',
    'change-emitter',
    'symbol-observable',
    'react-relay',
  );
  baseConfig.dest = combineDistFilePath(build);
  baseConfig.format = build;
}

if (build === 'umd') {
  baseConfig.dest = combineDistFilePath(build);
  baseConfig.format = build;
  baseConfig.plugins.push(
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
  baseConfig.dest = combineDistFilePath('./')
  baseConfig.format = 'umd';
  baseConfig.plugins.push(
    nodeResolve({
      jsnext: true
    }),
    commonjs(),
    flow(),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
  );
}

export default baseConfig;
