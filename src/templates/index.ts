import { ParsedFunction } from '../parsers/index';

export function generateJestTemplate(func: ParsedFunction): string {
  const isAsync = func.isAsync;
  const awaitStr = isAsync ? 'await ' : '';
  const asyncStr = isAsync ? 'async ' : '';

  let tests = `
  test('should execute without errors (happy path)', ${asyncStr}() => {
    // TODO: Provide mock arguments
    const result = ${awaitStr}${func.name}(${func.params.map(() => 'undefined').join(', ')});
    expect(result).toBeDefined();
  });`;

  // Edge cases
  if (func.params.length > 0) {
    tests += `

  test('should handle null/undefined arguments', ${asyncStr}() => {
    // TODO: Verify behavior with missing arguments
    const result = ${awaitStr}${func.name}(${func.params.map(() => 'null').join(', ')});
    expect(result).toBeDefined();
  });`;
  }

  return `
describe('${func.name}', () => {${tests}
});
`;
}

export function generateVitestTemplate(func: ParsedFunction): string {
  // Vitest has a very similar API to Jest for these basic tests
  return generateJestTemplate(func);
}
