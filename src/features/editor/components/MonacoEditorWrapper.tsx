import React, { useRef } from 'react';
import Editor, { type BeforeMount, type OnMount } from '@monaco-editor/react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../core/hooks/redux_hooks';
import { updateFileContent } from '../store/editorSlice';

let emmetDisposerRegistered = false;

interface MonacoTextModel {
  getWordUntilPosition: (position: MonacoPosition) => {
    word: string;
    startColumn: number;
    endColumn: number;
  };
}

interface MonacoPosition {
  lineNumber: number;
  column: number;
}

export const MonacoEditorWrapper: React.FC = () => {
  const dispatch = useAppDispatch();
  const { activeFile, files, theme, fontSize } = useAppSelector((state) => state.editor);
  const currentFile = files[activeFile];
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);

  const handleBeforeMount: BeforeMount = (monaco) => {
    const monacoAny = monaco as unknown as {
      languages: typeof monaco.languages & {
        html?: {
          htmlDefaults?: {
            setOptions: (opts: Record<string, unknown>) => void;
          };
        };
        css?: {
          cssDefaults?: {
            setOptions: (opts: Record<string, unknown>) => void;
          };
        };
        typescript?: {
          javascriptDefaults?: {
            setDiagnosticsOptions: (opts: Record<string, unknown>) => void;
            setCompilerOptions: (opts: Record<string, unknown>) => void;
            setEagerModelSync: (value: boolean) => void;
          };
          ScriptTarget?: { ESNext: number };
        };
      };
    };

    // 1. Configuración de HTML y soporte Emmet (expansión de abreviaturas HTML5)
    monacoAny.languages.html?.htmlDefaults?.setOptions({
      format: {
        tabSize: 2,
        insertSpaces: true,
        wrapLineLength: 120,
      },
      suggest: {
        html5: true,
      },
    });

    if (!emmetDisposerRegistered) {
      emmetDisposerRegistered = true;
      monaco.languages.registerCompletionItemProvider('html', {
        triggerCharacters: ['!', '.', '#', '>', '*', ':'],
        provideCompletionItems: (model: MonacoTextModel, position: MonacoPosition) => {
          const word = model.getWordUntilPosition(position);
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
          };

          const emmetSnippets = [
            {
              label: '! (Emmet HTML5 Boilerplate)',
              filterText: '! html:5',
              insertText: [
                '<!DOCTYPE html>',
                '<html lang="es">',
                '<head>',
                '\t<meta charset="UTF-8" />',
                '\t<meta name="viewport" content="width=device-width, initial-scale=1.0" />',
                '\t<title>${1:Documento}</title>',
                '</head>',
                '<body>',
                '\t${0}',
                '</body>',
                '</html>',
              ].join('\n'),
              documentation: 'Estructura base HTML5 con Emmet',
            },
            {
              label: 'div.container (Emmet)',
              filterText: 'div.container',
              insertText: '<div class="${1:container}">\n\t${0}\n</div>',
              documentation: 'Contenedor div con clase',
            },
            {
              label: 'ul>li*3 (Emmet)',
              filterText: 'ul>li*3',
              insertText: '<ul>\n\t<li>${1:Item 1}</li>\n\t<li>${2:Item 2}</li>\n\t<li>${3:Item 3}</li>\n</ul>',
              documentation: 'Lista desordenada con 3 elementos',
            },
            {
              label: 'btn (Emmet Button)',
              filterText: 'btn button',
              insertText: '<button type="${1:button}" class="${2:btn}">${0:Acción}</button>',
              documentation: 'Elemento button HTML',
            },
          ];

          return {
            suggestions: emmetSnippets.map((snippet) => ({
              label: snippet.label,
              kind: monaco.languages.CompletionItemKind.Snippet,
              documentation: snippet.documentation,
              insertText: snippet.insertText,
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              filterText: snippet.filterText,
              range,
            })),
          };
        },
      });
    }

    // 2. Configuración de CSS con validación y linting de propiedades
    monacoAny.languages.css?.cssDefaults?.setOptions({
      validate: true,
      lint: {
        compatibleVendorPrefixes: 'warning',
        duplicateProperties: 'warning',
        emptyRules: 'warning',
        unknownProperties: 'warning',
        zeroUnits: 'ignore',
      },
    });

    // 3. Configuración de JavaScript con validación sintáctica y semántica activa
    const jsDefaults = monacoAny.languages.typescript?.javascriptDefaults;
    if (jsDefaults) {
      jsDefaults.setDiagnosticsOptions({
        noSemanticValidation: false,
        noSyntaxValidation: false,
      });

      jsDefaults.setCompilerOptions({
        target: monacoAny.languages.typescript?.ScriptTarget?.ESNext ?? 99,
        allowNonTsExtensions: true,
        checkJs: true,
        allowJs: true,
      });

      jsDefaults.setEagerModelSync(true);
    }
  };

  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const handleCodeChange = (value: string | undefined) => {
    dispatch(
      updateFileContent({
        fileName: activeFile,
        content: value ?? '',
      })
    );
  };

  return (
    <Box sx={{ width: '100%', height: 480, position: 'relative', bgcolor: '#1e1e1e' }}>
      <Editor
        height="100%"
        path={currentFile.name}
        language={currentFile.language}
        value={currentFile.content}
        theme={theme}
        beforeMount={handleBeforeMount}
        onMount={handleEditorMount}
        onChange={handleCodeChange}
        loading={
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, p: 4 }}>
            <CircularProgress size={32} />
            <Typography variant="body2" color="text.secondary">
              Inicializando editor Monaco ({currentFile.label})...
            </Typography>
          </Box>
        }
        options={{
          fontSize,
          minimap: { enabled: true },
          automaticLayout: true,
          tabSize: 2,
          insertSpaces: true,
          wordWrap: 'on',
          formatOnPaste: true,
          formatOnType: true,
          scrollBeyondLastLine: false,
          suggestOnTriggerCharacters: true,
          quickSuggestions: {
            other: true,
            comments: false,
            strings: true,
          },
        }}
      />
    </Box>
  );
};

export default MonacoEditorWrapper;
