import { ParsedFunction } from '../parsers/index';

export interface AnalysisIssue {
  functionName: string;
  issue: string;
  suggestion: string;
}

export function analyzeFunction(func: ParsedFunction): AnalysisIssue[] {
  const issues: AnalysisIssue[] = [];

  // Simple rule-based static analysis
  if (func.params.length > 4) {
    issues.push({
      functionName: func.name,
      issue: 'High number of parameters',
      suggestion: 'Consider grouping parameters into an object.'
    });
  }

  // Rough estimation of complexity by loc
  if (func.loc) {
    const lines = func.loc.end.line - func.loc.start.line;
    if (lines > 50) {
      issues.push({
        functionName: func.name,
        issue: 'Function is too long',
        suggestion: 'Consider breaking it down into smaller, more manageable functions.'
      });
    }
  }

  return issues;
}
