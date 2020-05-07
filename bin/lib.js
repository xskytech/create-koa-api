/**
 * Generates package.json for new project
 * @param {Buffer} buffer - original package.json buffer
 * @param {String} dir - project directory
 * @returns {String} - stringified new package.json
 */
const generatePackageJson = (buffer, dir) => {
  const packageJson = {
    ...JSON.parse(buffer.toString()),
    name: dir,
    version: '1.0.0',
    description: '',
    keywords: [],
    author: '',
  };
  delete packageJson.repository;
  delete packageJson.bugs;
  delete packageJson.homepage;

  return JSON.stringify(packageJson, null, 2);
};

module.exports = {
  generatePackageJson,
};
