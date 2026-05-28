import { glob } from 'glob';
import path from 'path';
import { parseFile, ParsedFile } from '../parsers/index';
import { getConfig } from '../config/index';

export async function scanDirectory(directory: string): Promise<ParsedFile[]> {
  const config = getConfig();
  const ignorePatterns = config.ignoredFolders.map(folder => `**/${folder}/**`);

  const pattern = path.join(directory, '**/*.{js,ts,jsx,tsx}').replace(/\\/g, '/');

  const files = await glob(pattern, {
    ignore: ignorePatterns,
    absolute: true,
  });

  const parsedFiles: ParsedFile[] = [];

  for (const file of files) {
    if (file.includes('.test.') || file.includes('.spec.')) {
      continue; // Skip test files
    }
    try {
      const parsed = await parseFile(file);
      if (parsed.functions.length > 0 || parsed.classes.length > 0) {
        parsedFiles.push(parsed);
      }
    } catch (error) {
      // Ignore parse errors on individual files (could be invalid JS/TS)
    }
  }

  return parsedFiles;
}
