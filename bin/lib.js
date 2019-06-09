/* eslint-disable arrow-body-style */

/**
 * Converts dependencies json object to string
 * @param {Object} dependenciesType - type of dependencies (dependency | devDependency)
 * @returns {String} - stringified dependencies
 */
const getDependenciesFromJsonObject = (dependenciesType) => {
  return Object.entries(dependenciesType)
    .map(dependencie => `${dependencie[0]}@${dependencie[1]}`)
    .toString()
    .replace(/,/g, ' ')
    .replace(/\^/g, '')
    .replace(/fs-extra[^\s]+/g, '');
};

/**
 * Converts scripts json object to string
 * @param {Object} scripts - scripts object from package json
 * @returns {String} - stringified scripts
 */
const getScriptsFromJsonObject = (scripts) => {
  return JSON.stringify(scripts, null, 2)
    .replace('{', '')
    .replace('}', '')
    .trim();
};

/**
 * Converts husky json object to string
 * @param {Object} husky - husky object from package json
 * @returns {String} - stringified husky
 */
const getHuskyFromJsonObject = (husky) => {
  return JSON.stringify(husky, null, 2).trim();
};

/**
 * Generates content for giignore
 * @param {Object} husky - husky object from package json
 * @returns {String} - stringified husky
 */
const generateGitignore = () => {
  return `  
    # dependencies
    node_modules/

    # environment variables
    .env
  `.replace(/  +?/g, '');
};

module.exports = {
  getDependenciesFromJsonObject,
  getScriptsFromJsonObject,
  getHuskyFromJsonObject,
  generateGitignore
};
