#!/usr/bin/env node

const { exec } = require('child_process');

const fs = require('fs-extra');
const logger = require('log4js').getLogger('./bin/index.js');

const { version: packageVersion } = require('../package.json');

const { generatePackageJson } = require('./lib');

const projectDirectory = process.argv[2] || 'koa-api';

const remoteOrigin = 'git@github.com:xskytech/koa-api.git';

logger.level = 'debug';

logger.info('Initializing project...');

exec(
  `git clone --single-branch --branch ${packageVersion} ${remoteOrigin} ${projectDirectory} && cd ${projectDirectory} && rm -rf .git && git init`,
  async (error) => {
    if (error) {
      logger.error(error.message || error);
      return;
    }

    logger.info('Installing dependencies...');

    try {
      const buffer = await fs.readFile(`./${projectDirectory}/package.json`);

      await fs.writeFile(`./${projectDirectory}/package.json`, generatePackageJson(buffer, projectDirectory));

      exec(`cd ${projectDirectory} && npm install`, (err) => {
        if (err) {
          logger.error(err.message || err);
          return;
        }

        logger.info(`Your project successfully initialized into ${projectDirectory} directory.`);
      });
    } catch (e) {
      if (e) {
        logger.error(e.message || e);
      }
    }
  }
);
