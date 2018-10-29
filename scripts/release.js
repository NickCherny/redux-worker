const { resolve, relative } = require('path');
const { writeFileSync } = require('fs');
const {
    rm, exec, exit, touch, cp
} = require('shelljs');
const glob = require('glob');
const { SRC, DIST } = require('./utils/getPackagesName');
const {
    showAllPackages,
    getPackageName,
    getPackageVersion
} = require('./utils/outerInterface');


const isPublish = process.argv.includes('--publish');
const DIST_PACKAGE_PATH = resolve(process.cwd(), './dist');
const SRC_PACKAGE_PATH = resolve(process.cwd(), './lib');
const MODULES_BIN_PATH = './node_modules/.bin';

rm('-rf', DIST_PACKAGE_PATH);
console.log(`distination dir clear!`);

const sourceFiles = glob.sync(
    resolve(process.cwd(), './lib/', './**/*.js'),
    { ignore: `${SRC_PACKAGE_PATH}/node_modules/**/*.js` }
).map(to => relative(SRC, to));

exec(
    `cd ${SRC_PACKAGE_PATH} && BABEL_ENV=cjs ${resolve(process.cwd(), MODULES_BIN_PATH)}/babel ${sourceFiles.join(' ')} --out-dir ${resolve(DIST)}`
);

const runRollup = build => (
    `BABEL_ENV=rollup ${resolve(MODULES_BIN_PATH, 'rollup')} --config scripts/rollup.config.js --environment BUILD:${build},PACKAGE_NAME:redux-worker`
);

if (exec([runRollup('es'), runRollup('cjs'), runRollup('umd'), runRollup('min')].join(' && ')).code !== 0) {
    exit(1);
}

touch(`${DIST_PACKAGE_PATH}/README.md`);
exec(`${resolve(MODULES_BIN_PATH, 'documentation')} build ${SRC_PACKAGE_PATH}/index.js -f md -o ${DIST_PACKAGE_PATH}/README.md`);

if (isPublish) {
    exec(`npm publish ${resolve(SRC, buildPackage)}`);
    console.log('published');
}

cp(SRC_PACKAGE_CONFIG_PATH, DIST_PACKAGE_PATH);
