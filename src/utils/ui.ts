import figlet from 'figlet';
import gradient from 'gradient-string';
import chalk from 'chalk';
import boxen from 'boxen';

export const BANNER_TEXT = 'FuncPilot';

export function displayBanner() {
  const ascii = figlet.textSync(BANNER_TEXT, { 
    font: 'ANSI Shadow',
    horizontalLayout: 'full',
    verticalLayout: 'default'
  });
  
  // Gemini-like gradient (Blue -> Purple -> Red/Pink)
  // Stops: Google Blue, Medium Purple, Warm Pink
  const geminiGradient = gradient([
    { color: '#4285F4', pos: 0 },
    { color: '#9b72cb', pos: 0.5 },
    { color: '#d96570', pos: 1 }
  ]);
  
  console.log(geminiGradient.multiline(ascii));
  console.log(chalk.bold.cyan('   Smart Offline Testing CLI for Developers\n'));
}

export function displayWelcome() {
  const message = `
${chalk.bold('Welcome to FuncPilot!')}
Version: ${chalk.green('v1.0.0')}
Runtime: ${chalk.green('Local')}
Status: ${chalk.green('Ready')}
`;

  console.log(boxen(message, {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: 'cyan',
    title: 'System Status',
    titleAlignment: 'center'
  }));
}

export function displayQuickStart() {
  const content = `
${chalk.bold.yellow('Quick Start:')}

1. ${chalk.cyan('cd')} into your project folder
2. Run ${chalk.green('funcpilot init')} to set up
3. Run ${chalk.green('funcpilot scan')} to see your code
4. Run ${chalk.green('funcpilot generate-tests')} to create templates
5. Run ${chalk.green('funcpilot run')} to execute tests
`;

  console.log(boxen(content, {
    padding: 1,
    margin: 1,
    borderStyle: 'double',
    borderColor: 'yellow'
  }));
}

export function displayDashboard() {
  console.log(chalk.bold.blue('\nAvailable Commands:'));
  console.log(`${chalk.yellow('scan')}             Scan project files`);
  console.log(`${chalk.yellow('analyze')}          Analyze risky functions`);
  console.log(`${chalk.yellow('generate-tests')}   Generate test templates`);
  console.log(`${chalk.yellow('run')}              Run unit tests`);
  console.log(`${chalk.yellow('coverage')}         Show coverage reports`);
  console.log(`${chalk.yellow('docs')}             Generate documentation`);
  console.log(`${chalk.yellow('init')}             Initialize configuration\n`);
  
  console.log(chalk.dim('Run "funcpilot [command] --help" for more information on a command.\n'));
}

export function displayEmptyState() {
  const message = `
${chalk.bold.red('No supported source files found!')}

FuncPilot works best inside a project directory.
Please move into your project folder:

${chalk.cyan('cd your-project')}

Then try running:
${chalk.green('funcpilot scan src/')}
`;
  console.log(boxen(message, {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: 'red'
  }));
}
