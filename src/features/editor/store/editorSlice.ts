import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { EditorFile, EditorFileName, EditorState } from '../types/editor_types';

const DEFAULT_FILES: Record<EditorFileName, EditorFile> = {
  'index.html': {
    name: 'index.html',
    language: 'html',
    label: 'index.html',
    content: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Proyecto Colaborativo</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <main class="app-container">
    <h1>Hola Mundo desde WebCollab IDE</h1>
    <p id="status-text">Edita HTML, CSS y JavaScript en tiempo real.</p>
    <button id="action-btn" type="button">Probar Interacción</button>
  </main>
  <script src="script.js"></script>
</body>
</html>`,
  },
  'styles.css': {
    name: 'styles.css',
    language: 'css',
    label: 'styles.css',
    content: `/* Estilos globales del proyecto */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  background-color: #0f172a;
  color: #f8fafc;
  padding: 2rem;
}

.app-container {
  max-width: 640px;
  margin: 0 auto;
  padding: 2rem;
  border-radius: 12px;
  background-color: #1e293b;
}`,
  },
  'script.js': {
    name: 'script.js',
    language: 'javascript',
    label: 'script.js',
    content: `// Lógica principal en JavaScript con validación sintáctica
const actionButton = document.getElementById('action-btn');
const statusText = document.getElementById('status-text');

if (actionButton && statusText) {
  actionButton.addEventListener('click', () => {
    statusText.textContent = '¡Evento JavaScript ejecutado correctamente!';
  });
}
`,
  },
};

const initialState: EditorState = {
  activeFile: 'index.html',
  files: DEFAULT_FILES,
  theme: 'vs-dark',
  fontSize: 14,
};

export const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setActiveFile: (state, action: PayloadAction<EditorFileName>) => {
      state.activeFile = action.payload;
    },
    updateFileContent: (
      state,
      action: PayloadAction<{ fileName: EditorFileName; content: string }>
    ) => {
      const { fileName, content } = action.payload;
      if (state.files[fileName]) {
        state.files[fileName].content = content;
      }
    },
    setEditorTheme: (state, action: PayloadAction<'vs-dark' | 'light'>) => {
      state.theme = action.payload;
    },
    resetEditorFiles: (state) => {
      state.files = DEFAULT_FILES;
      state.activeFile = 'index.html';
    },
  },
});

export const {
  setActiveFile,
  updateFileContent,
  setEditorTheme,
  resetEditorFiles,
} = editorSlice.actions;

export const editorReducer = editorSlice.reducer;
export default editorReducer;
