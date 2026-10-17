export type EditorFileName = 'index.html' | 'styles.css' | 'script.js';

export type EditorLanguage = 'html' | 'css' | 'javascript';

export interface EditorFile {
  name: EditorFileName;
  language: EditorLanguage;
  label: string;
  content: string;
}

export interface EditorState {
  activeFile: EditorFileName;
  files: Record<EditorFileName, EditorFile>;
  theme: 'vs-dark' | 'light';
  fontSize: number;
}
