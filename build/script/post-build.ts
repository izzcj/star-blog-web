// #!/usr/bin/env node

import chalk from 'chalk';

import pkg from '../../package.json';
import { runBuildConfig } from './build-config';

try {
  const argvList = process.argv.splice(2);

  console.log(argvList);
  // Generate configuration file
  if (!argvList.includes('disabled-config')) {
    runBuildConfig();
  }

  const appName = `[${pkg.name}]`;
  console.log(`✨ ${chalk.cyan(appName)}` + ' - build successfully!');
} catch (error) {
  console.log(chalk.red(`vite build error:\n${error}`));
  process.exit(1);
}
