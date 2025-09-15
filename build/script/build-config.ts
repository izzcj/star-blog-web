/**
 * Generate additional configuration files when used for packaging. The file can be configured with some global variables, so that it can be changed directly externally without repackaging
 */
import chalk from 'chalk';
import { writeFileSync } from 'fs';
import fs from 'fs-extra';
import path from 'path';
import { loadEnv } from 'vite';
import { transformAppConfig } from '@/utils/env-util';
import pkg from '../../package.json';
import { APP_CONFIG_FILE_NAME, APP_CONFIG_NAME, OUTPUT_DIR } from '../constants';

function getRootPath(...dir: string[]) {
  return path.resolve(process.cwd(), ...dir);
}

function createConfig({
  configName,
  config,
  configFileName = APP_CONFIG_FILE_NAME,
}: {
  configName?: string;
  config?: AppConfig;
  configFileName?: string;
}) {
  try {
    const windowConf = `window.${configName}`;
    // Ensure that the variable will not be modified
    const configStr = `${windowConf}=${JSON.stringify(config)};
      Object.freeze(${windowConf});
      Object.defineProperty(window, "${configName}", {
        configurable: false,
        writable: false,
      });
    `.replace(/\s/g, '');
    fs.mkdirp(getRootPath(OUTPUT_DIR))
        .then();
    writeFileSync(getRootPath(`${OUTPUT_DIR}/${configFileName}`), configStr);

    const name = chalk.cyan(`✨ [${pkg.name}]`);
    console.log(`${name} - configuration file is build successfully:`);
    const displayedConfigName = chalk.gray(`${OUTPUT_DIR}/${chalk.green(configFileName)}`);
    console.log(`${displayedConfigName}\n`);
  } catch (error) {
    console.log(chalk.red(`configuration file configuration file failed to package:\n${error}`));
  }
}

export function runBuildConfig() {
  const config = loadEnv('production', path.resolve(process.cwd(), 'env'), 'STAR_BLOG_APP');
  const name = chalk.blueBright(`😁 [${pkg.name}]`);
  console.log(`${name} - env variables loaded:`);
  console.log(chalk.greenBright(JSON.stringify(config, null, 2)));
  createConfig({ config: transformAppConfig(config), configName: APP_CONFIG_NAME });
}
