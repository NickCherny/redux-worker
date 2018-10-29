const {
    readdirSync, statSync
} = require('fs');
const { resolve } = require('path');

const ROOT = process.cwd();
const SRC = resolve(ROOT, './lib');
const DIST = resolve(ROOT, './dist');

function getPackages() {
    const packages = readdirSync(SRC).filter((file) => {
        try {
            const packageJsonPath = resolve(SRC, file, 'package.json');
            return statSync(packageJsonPath).isFile();
        } catch (error) {
            return false;
        }
    });

    return packages;
}

module.exports = {
    SRC,
    DIST,
    getPackages,
};
