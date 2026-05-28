import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';
import { writeConfig, FuncPilotConfig } from '../config/index';
import { logger } from '../logger/index';

export const initCommand = new Command('init')
  .description('Initialize FuncPilot configuration')
  .action(async () => {
    console.log(chalk.bold.cyan('\n🚀 FuncPilot Setup Wizard\n'));
    
    // Auto-detect settings
    const hasPackageJson = fs.existsSync(path.join(process.cwd(), 'package.json'));
    const packageJson = hasPackageJson ? await fs.readJson(path.join(process.cwd(), 'package.json')) : {};
    
    const devDeps = { ...packageJson.devDependencies, ...packageJson.dependencies };
    const detectedFramework = devDeps.vitest ? 'vitest' : 'jest';
    const isTypescript = devDeps.typescript || fs.existsSync(path.join(process.cwd(), 'tsconfig.json'));

    if (hasPackageJson) {
      console.log(chalk.gray(`Detected: ${chalk.white(packageJson.name || 'Project')} with ${chalk.white(detectedFramework)} and ${chalk.white(isTypescript ? 'TypeScript' : 'JavaScript')}`));
    }

    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'testFramework',
        message: 'Select test framework:',
        choices: ['jest', 'vitest'],
        default: detectedFramework
      },
      {
        type: 'input',
        name: 'outputDirectory',
        message: 'Where should generated tests be stored?',
        default: 'tests/generated'
      },
      {
        type: 'confirm',
        name: 'autoRunTests',
        message: 'Enable auto-run tests?',
        default: false
      }
    ]);

    const spinner = ora('Initializing project...').start();
    try {
      await writeConfig(answers as Partial<FuncPilotConfig>);
      await fs.ensureDir(path.join(process.cwd(), answers.outputDirectory));
      
      spinner.succeed(chalk.green('Project initialized successfully!'));
      console.log(chalk.cyan(`\nCreated .funcpilotrc and ${answers.outputDirectory}/ folder`));
      console.log(chalk.gray('\nYou are ready to go! Try:'));
      console.log(chalk.white('  funcpilot scan src/'));
      console.log(chalk.dim('\nNote: If "funcpilot" command is not found, run "npm link" in this directory.'));
    } catch (err) {
      spinner.fail(chalk.red('Failed to initialize project'));
      logger.error('Init error:', err);
    }
  });
