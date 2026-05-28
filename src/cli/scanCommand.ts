import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { scanDirectory } from '../scanners/index';
import { logger } from '../logger/index';
import { displayEmptyState } from '../utils/ui';

export const scanCommand = new Command('scan')
  .description('Scan directory for functions and classes')
  .argument('[directory]', 'Directory to scan', 'src')
  .action(async (directory) => {
    const spinner = ora(`Scanning directory: ${directory}...`).start();
    try {
      const results = await scanDirectory(directory);
      
      if (results.length === 0) {
        spinner.stop();
        displayEmptyState();
        return;
      }

      spinner.succeed(chalk.green(`Scan complete. Found ${results.length} files.`));
      
      // Output basic info
      results.forEach(res => {
         console.log(chalk.bold.blue(`\nFile: ${res.file}`));
         res.functions.forEach(f => {
           console.log(`  ${chalk.green('✔')} ${chalk.yellow(f.name)} ${chalk.gray(`(${f.type})`)}`);
         });
      });
    } catch (err) {
      spinner.fail(chalk.red('Scan failed'));
      logger.error('Scan error:', err);
    }
  });
