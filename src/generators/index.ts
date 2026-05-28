import fs from 'fs-extra';
import path from 'path';
import { scanDirectory } from '../scanners/index';
import { getConfig } from '../config/index';
import { generateJestTemplate, generateVitestTemplate } from '../templates/index';
import { logger } from '../logger/index';
import { ParsedFile } from '../parsers/index';

export async function generateTestsForDirectory(directory: string): Promise<void> {
  const parsedFiles = await scanDirectory(directory);
  const config = getConfig();
  
  const outDir = path.resolve(process.cwd(), config.outputDirectory);
  await fs.ensureDir(outDir);

  for (const parsedFile of parsedFiles) {
    if (parsedFile.functions.length === 0) continue;

    // We only generate tests for exported functions for simplicity, or we can do all.
    // Let's generate tests for all found functions/methods.
    const functionsToTest = parsedFile.functions;

    if (functionsToTest.length === 0) continue;

    // Build the test file content
    let testContent = '';
    
    // Add imports
    const isVitest = config.testFramework === 'vitest';
    if (isVitest) {
      testContent += `import { describe, test, expect } from 'vitest';\n`;
    }

    // Attempt to import functions from original file. 
    // We compute relative path.
    const originalFileExt = path.extname(parsedFile.file);
    let importPath = path.relative(outDir, parsedFile.file).replace(/\\/g, '/');
    // Remove extension for TS/JS
    importPath = importPath.replace(/\.(ts|js|jsx|tsx)$/, '');
    
    const exportedFunctions = functionsToTest.filter(f => f.isExported).map(f => f.name);
    
    if (exportedFunctions.length > 0) {
      testContent += `import { ${exportedFunctions.join(', ')} } from '${importPath}';\n\n`;
    }

    for (const func of functionsToTest) {
      if (isVitest) {
        testContent += generateVitestTemplate(func);
      } else {
        testContent += generateJestTemplate(func);
      }
    }

    // Save test file
    const baseName = path.basename(parsedFile.file, originalFileExt);
    const testFileName = `${baseName}.test${originalFileExt}`;
    const testFilePath = path.join(outDir, testFileName);

    await fs.writeFile(testFilePath, testContent, 'utf-8');
    logger.debug(`Generated test for ${parsedFile.file} -> ${testFilePath}`);
  }
}
