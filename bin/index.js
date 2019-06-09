#!/usr/bin/env node

const { exec } = require('child_process');
const path = require('path');

const fs = require('fs-extra');
const logger = require('log4js').getLogger('./bin/index.js');

const {
  getDependenciesFromJsonObject,
  getScriptsFromJsonObject,
  getHuskyFromJsonObject,
  generateGitignore
} = require('./lib');

const packageJson = require('../package.json');

const projectFiles = ['.eslintrc.json', 'README.md'];
const projectDirectory = process.argv[2] || 'koa-api';

logger.level = 'debug';

logger.info('Initializing project...');

exec(`mkdir ${projectDirectory} && cd ${projectDirectory} && git init && npm init -y`, (error) => {
  if (error) {
    logger.error(error.message || error);
    return;
  }

  logger.info('Installing dependencies...');

  const dependencies = getDependenciesFromJsonObject(packageJson.dependencies);
  const devDependencies = getDependenciesFromJsonObject(packageJson.devDependencies);
  const scripts = getScriptsFromJsonObject(packageJson.scripts);
  const husky = getHuskyFromJsonObject(packageJson.husky);
  const gitignore = generateGitignore();
  const projectPackageJsonPath = `${projectDirectory}/package.json`;

  exec(`cd ${projectDirectory} && npm i -S ${dependencies} && npm i -D ${devDependencies}`, async (err) => {
    if (err) {
      logger.error(err.message || err);
      return;
    }

    try {
      const projectPackageJson = await fs.readFile(projectPackageJsonPath);
      await fs.writeFile(`${projectDirectory}/.gitignore`, gitignore);
      await fs.writeFile(
        projectPackageJsonPath,
        JSON.stringify(
          JSON.parse(
            projectPackageJson
              .toString()
              .replace(/"test": "echo \\"Error: no test specified\\" && exit 1"/, scripts)
              .replace(/"keywords": \[\],/, `"keywords": [],
              "husky": ${husky},`)
          ),
          null,
          2
        )
      );

      projectFiles.forEach((projectFile) => {
        fs.createReadStream(path.join(__dirname, `../${projectFile}`))
          .pipe(fs.createWriteStream(`${projectDirectory}/${projectFile}`));
      });

      await fs.copy(path.join(__dirname, '../src'), projectDirectory);
      logger.info(`Your project successfully initialized into ${projectDirectory} directory.`);
    } catch (e) {
      logger.error(e.message || e);
    }
  });
});
