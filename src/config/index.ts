import fs from 'fs-extra';
import path from 'path';

export interface FuncPilotConfig {
  testFramework: 'jest' | 'vitest';
  outputDirectory: string;
  autoRunTests: boolean;
  ignoredFolders: string[];
}

const defaultConfig: FuncPilotConfig = {
  testFramework: 'jest',
  outputDirectory: 'tests/generated',
  autoRunTests: false,
  ignoredFolders: ['node_modules', 'dist', 'build', 'coverage', '.git']
};

let currentConfig: FuncPilotConfig = { ...defaultConfig };

export async function setupConfig(): Promise<void> {
  const configPath = path.join(process.cwd(), '.funcpilotrc');
  if (await fs.pathExists(configPath)) {
    try {
      const userConfig = await fs.readJson(configPath);
      currentConfig = { ...defaultConfig, ...userConfig };
    } catch (error) {
      throw new Error('Failed to parse .funcpilotrc: ' + error);
    }
  }
}

export function getConfig(): FuncPilotConfig {
  return currentConfig;
}

export async function writeConfig(config: Partial<FuncPilotConfig>): Promise<void> {
  const configPath = path.join(process.cwd(), '.funcpilotrc');
  currentConfig = { ...currentConfig, ...config };
  await fs.writeJson(configPath, currentConfig, { spaces: 2 });
}
