const {resolve, relative} = require('path');
const {writeFileSync} = require('fs');
const {rm, exec, exit, touch, cp} = require('shelljs');
const glob = require('glob');
const {showAllPackages, getPackageName, getPackageVersion} = require('./utils/outerInterface');
const { path: { dist, source }, formats } = require('./settings.json');


const isPublish = process.argv.includes('--publish');

const ROOT_PATH = process.cwd();
const DIST_PACKAGE_PATH = resolve(ROOT_PATH, dist);
const SRC_PACKAGE_PATH = resolve(ROOT_PATH, source);
const MODULES_BIN_PATH = './node_modules/.bin';
const ROLLUP_BIN_PATH = resolve(MODULES_BIN_PATH, 'rollup');

function runRollup(formatType) {
  return `BABEL_ENV=rollup ${ROLLUP_BIN_PATH} --config scripts/rollup.config.js --environment BUILD:${formatType}`;
}

rm('-rf', DIST_PACKAGE_PATH);
console.log(`distination dir clear!`);

const sourceFiles = glob.sync(resolve(ROOT_PATH, './lib/', './**/*.js'), { ignore: `${SRC_PACKAGE_PATH}/node_modules/**/*.js` }).map(to => relative(SRC_PACKAGE_PATH, to));

exec(`cd ${SRC_PACKAGE_PATH} && BABEL_ENV=cjs ${resolve(ROOT_PATH, MODULES_BIN_PATH)}/babel ${sourceFiles.join(' ')} --out-dir ${resolve(DIST_PACKAGE_PATH)}`);

if (exec(formats.map(runRollup).join(' && ')).code !== 0) {
  exit(1);
}

touch(`${DIST_PACKAGE_PATH}/README.md`);
// exec(`${resolve(MODULES_BIN_PATH, 'documentation')} build ${SRC_PACKAGE_PATH}/index.js -f md -o ${DIST_PACKAGE_PATH}/README.md`);

// if (isPublish) {
//   exec(`npm publish ${resolve(SRC, buildPackage)}`);
//   console.log('published');
// }
