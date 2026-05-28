import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import fs from 'fs-extra';
import { logger } from '../logger/index';

export interface ParsedParam {
  name: string;
  type?: string;
}

export interface ParsedFunction {
  name: string;
  params: string[];
  type: 'function' | 'arrow-function' | 'method';
  file: string;
  isExported: boolean;
  isAsync: boolean;
  loc?: { start: { line: number }, end: { line: number } };
}

export interface ParsedClass {
  name: string;
  methods: ParsedFunction[];
  file: string;
}

export interface ParsedFile {
  file: string;
  functions: ParsedFunction[];
  classes: ParsedClass[];
}

export async function parseFile(filePath: string): Promise<ParsedFile> {
  const code = await fs.readFile(filePath, 'utf-8');
  
  const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: ['typescript', 'jsx', 'classProperties', 'decorators-legacy'],
  });

  const functions: ParsedFunction[] = [];
  const classes: ParsedClass[] = [];

  // @babel/traverse export defaults handling
  const traverseAst = (traverse as any).default || traverse;

  traverseAst(ast, {
    FunctionDeclaration(path: any) {
      if (!path.node.id) return;
      functions.push({
        name: path.node.id.name,
        params: path.node.params.map((p: any) => p.name || 'param'),
        type: 'function',
        file: filePath,
        isExported: path.parent.type === 'ExportNamedDeclaration' || path.parent.type === 'ExportDefaultDeclaration',
        isAsync: path.node.async,
        loc: path.node.loc
      });
    },
    VariableDeclarator(path: any) {
      if (
        path.node.init &&
        (path.node.init.type === 'ArrowFunctionExpression' || path.node.init.type === 'FunctionExpression') &&
        path.node.id.type === 'Identifier'
      ) {
        functions.push({
          name: path.node.id.name,
          params: path.node.init.params.map((p: any) => p.name || 'param'),
          type: path.node.init.type === 'ArrowFunctionExpression' ? 'arrow-function' : 'function',
          file: filePath,
          isExported: path.parentPath?.parent?.type === 'ExportNamedDeclaration',
          isAsync: path.node.init.async,
          loc: path.node.init.loc
        });
      }
    },
    ClassDeclaration(path: any) {
      if (!path.node.id) return;
      const className = path.node.id.name;
      const methods: ParsedFunction[] = [];

      path.traverse({
        ClassMethod(methodPath: any) {
          if (methodPath.node.key.type === 'Identifier') {
            methods.push({
              name: methodPath.node.key.name,
              params: methodPath.node.params.map((p: any) => p.name || 'param'),
              type: 'method',
              file: filePath,
              isExported: false,
              isAsync: methodPath.node.async,
              loc: methodPath.node.loc
            });
          }
        }
      });

      classes.push({
        name: className,
        methods,
        file: filePath
      });
      
      // also add methods to global functions list for easy generation
      functions.push(...methods);
    }
  });

  return { file: filePath, functions, classes };
}
