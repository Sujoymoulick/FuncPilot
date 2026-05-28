#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs-extra';
import os from 'os';
import { setupConfig } from '../config/index';
import { scanCommand } from './scanCommand';
import { generateCommand } from './generateCommand';
import { analyzeCommand } from './analyzeCommand';
import { runCommand } from './runCommand';
import { coverageCommand } from './coverageCommand';
import { docsCommand } from './docsCommand';
import { initCommand } from './initCommand';
import { logger } from '../logger/index';
import { displayBanner, displayWelcome, displayDashboard, displayQuickStart } from '../utils/ui';

const program = new Command();

program
  .name('funcpilot')
  .description('Offline Intelligent Unit Testing CLI')
  .version('1.0.0')
  .hook('preAction', async (thisCommand, actionCommand) => {
    try {
      await setupConfig();
    } catch (error) {
      logger.error('Failed to load configuration.', error);
    }
  });

program.addCommand(initCommand);
program.addCommand(scanCommand);
program.addCommand(analyzeCommand);
program.addCommand(generateCommand);
program.addCommand(runCommand);
program.addCommand(coverageCommand);
program.addCommand(docsCommand);

const GLOBAL_CONFIG_DIR = path.join(process.cwd(), '.funcpilot');
const GLOBAL_CONFIG_PATH = path.join(GLOBAL_CONFIG_DIR, 'config.json');

async function checkFirstRun(): Promise<boolean> {
  if (!fs.existsSync(GLOBAL_CONFIG_PATH)) {
    await fs.ensureDir(GLOBAL_CONFIG_DIR);
    await fs.writeJson(GLOBAL_CONFIG_PATH, { firstRun: false, lastUsed: new Date() });
    return true;
  }
  return false;
}

async function runMain() {
  if (process.argv.length <= 2) {
    displayBanner();
    
    const isFirstRun = await checkFirstRun();
    if (isFirstRun) {
       console.log(chalk.bold.green('✔ FuncPilot installed successfully!\n'));
    }

    displayWelcome();
    
    const configPath = path.join(process.cwd(), '.funcpilotrc');
    if (!fs.existsSync(configPath)) {
      displayQuickStart();
    } else {
      console.log(chalk.green('✔ Project Detected'));
      displayDashboard();
    }
  } else {
    // Let commander handle help flags and subcommands
    await program.parseAsync(process.argv).catch((err) => {
      logger.error('An unexpected error occurred.', err);
      process.exit(1);
    });
  }
}

runMain();
