import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { scanDirectory } from '../scanners/index';
import { analyzeFunction } from '../analyzers/index';
import { logger } from '../logger/index';

export const analyzeCommand = new Command('analyze')
  .description('Analyze codebase for complexity and issues')
  .argument('[directory]', 'Directory to analyze', 'src')
  .action(async (directory) => {
    const spinner = ora(`Analyzing codebase in ${directory}...`).start();
    try {
      const parsedFiles = await scanDirectory(directory);
      let issueCount = 0;

      spinner.succeed(chalk.green('Analysis complete.'));

      parsedFiles.forEach(file => {
        file.functions.forEach(func => {
          const issues = analyzeFunction(func);
          issues.forEach(issue => {
            issueCount++;
            console.log(chalk.yellow(`\n⚠ Function "${issue.functionName}" in ${file.file}`));
            console.log(`  Issue: ${issue.issue}`);
            console.log(`  Suggestion: ${chalk.cyan(issue.suggestion)}`);
          });
        });
      });

      if (issueCount === 0) {
        console.log(chalk.green('\nNo issues found! Your codebase looks clean.'));
      } else {
        console.log(chalk.yellow(`\nFound ${issueCount} issues.`));
      }

    } catch (err) {
      spinner.fail(chalk.red('Analysis failed'));
      logger.error('Analyze error:', err);
    }
  });
