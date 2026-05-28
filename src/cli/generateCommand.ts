import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { logger } from '../logger/index';
import { generateTestsForDirectory } from '../generators/index';

export const generateCommand = new Command('generate-tests')
  .description('Generate unit test templates')
  .argument('[directory]', 'Directory to scan and generate tests for', 'src')
  .action(async (directory) => {
    const spinner = ora(`Generating tests for ${directory}...`).start();
    try {
      await generateTestsForDirectory(directory);
      spinner.succeed(chalk.green('Tests generated successfully!'));
    } catch (err) {
      spinner.fail(chalk.red('Test generation failed'));
      logger.error('Generate error:', err);
    }
  });
