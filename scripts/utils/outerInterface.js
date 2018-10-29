const readlineSync = require('readline-sync');
const { getPackages } = require('./getPackagesName');

exports.showAllPackages = () => {
    const packages = getPackages();
    console.log('You have packages:');
    packages.forEach((packageName, iP) => console.log(`${iP + 1}) ${packageName}`));
};

exports.getPackageName = (packages = getPackages()) => {
    let packageName = readlineSync.question('What package do you want build? ');

    while (!packages.includes(packageName)) {
        packageName = readlineSync.question(`The package "${packageName}" does not exist in this project. Choose again: `);
    }

    return packageName;
};

exports.getPackageVersion = (packageJson) => {
    const { version: prevVersion } = packageJson;
    const releaseType = readlineSync.question(`Previus version: ${prevVersion}, what is relese type? \nTypes: minor|patch|major \nChoose: `);

    return ['minor', 'patch', 'major'].includes(releaseType) ? releaseType : 'patch';
};
