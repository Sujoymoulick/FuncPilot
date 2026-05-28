import execa from 'execa';
import { getConfig } from '../config/index';
import { logger } from '../logger/index';

export async function runCoverage(): Promise<void> {
  const config = getConfig();
  const outDir = config.outputDirectory;

  try {
    if (config.testFramework === 'jest') {
      const { stdout, stderr } = await execa('npx', ['jest', outDir, '--coverage', '--colors', '--passWithNoTests'], {
        env: { FORCE_COLOR: '1' }
      });
      console.log(stdout || stderr);
    } else if (config.testFramework === 'vitest') {
      const { stdout, stderr } = await execa('npx', ['vitest', 'run', outDir, '--coverage', '--color', '--passWithNoTests'], {
        env: { FORCE_COLOR: '1' }
      });
      console.log(stdout || stderr);
    }
  } catch (error: any) {
    if (error.stdout || error.stderr) {
      console.log(error.stdout || error.stderr);
    }
    throw new Error('Coverage execution failed');
  }
}
