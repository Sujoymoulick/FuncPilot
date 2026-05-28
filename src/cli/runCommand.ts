import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { logger } from '../logger/index';
import { runTests } from '../runners/index';

export const runCommand = new Command('run')
  .description('Run generated tests')
  .action(async () => {
    const spinner = ora('Running tests...').start();
    try {
      await runTests();
      spinner.succeed(chalk.green('Tests executed successfully.'));
    } catch (err) {
      spinner.fail(chalk.red('Test execution failed or some tests failed.'));
      logger.error('Run error:', err);
    }
  });
