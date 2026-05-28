import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { logger } from '../logger/index';
import { runCoverage } from '../coverage/index';

export const coverageCommand = new Command('coverage')
  .description('Generate coverage report')
  .action(async () => {
    const spinner = ora('Generating coverage report...').start();
    try {
      await runCoverage();
      spinner.succeed(chalk.green('Coverage report generated.'));
    } catch (err) {
      spinner.fail(chalk.red('Coverage report generation failed.'));
      logger.error('Coverage error:', err);
    }
  });
