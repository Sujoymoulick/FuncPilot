import execa from 'execa';
import { getConfig } from '../config/index';
import { logger } from '../logger/index';
import path from 'path';

export async function runTests(): Promise<void> {
  const config = getConfig();
  const outDir = config.outputDirectory;
  
  try {
    if (config.testFramework === 'jest') {
      // Execute jest on the output directory
      const { stdout, stderr } = await execa('npx', ['jest', outDir, '--passWithNoTests', '--colors'], {
        env: { FORCE_COLOR: '1' }
      });
      console.log(stdout || stderr);
    } else if (config.testFramework === 'vitest') {
      // Execute vitest
      const { stdout, stderr } = await execa('npx', ['vitest', 'run', outDir, '--passWithNoTests', '--color'], {
        env: { FORCE_COLOR: '1' }
      });
      console.log(stdout || stderr);
    }
  } catch (error: any) {
    if (error.stdout || error.stderr) {
      console.log(error.stdout || error.stderr);
    }
    throw new Error('Test execution failed');
  }
}
