import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { logger } from '../logger/index';
import { generateDocs } from '../docs/index';

export const docsCommand = new Command('docs')
  .description('Generate documentation')
  .action(async () => {
    const spinner = ora('Generating documentation...').start();
    try {
      await generateDocs();
      spinner.succeed(chalk.green('Documentation generated in docs/ folder.'));
    } catch (err) {
      spinner.fail(chalk.red('Documentation generation failed.'));
      logger.error('Docs error:', err);
    }
  });
