import * as Y from 'yjs';

const sessionYDocs = new Map<string, Y.Doc>();
const listeners = new Set<(sessionId: string, doc: Y.Doc) => void>();

/**
 * Obtiene o crea la instancia compartida de Y.Doc para una sesión colaborativa,
 * permitiendo que tanto Monaco (useYjsMonaco) como PreviewPanel escuchen el mismo Y.Doc.
 */
export const getOrCreateSessionYDoc = (sessionId: string): Y.Doc => {
  let doc = sessionYDocs.get(sessionId);
  if (!doc) {
    doc = new Y.Doc();
    sessionYDocs.set(sessionId, doc);
    listeners.forEach((cb) => cb(sessionId, doc!));
  }
  return doc;
};

export const destroySessionYDoc = (sessionId: string): void => {
  const doc = sessionYDocs.get(sessionId);
  if (doc) {
    sessionYDocs.delete(sessionId);
    doc.destroy();
  }
};

export const subscribeToSessionYDoc = (
  sessionId: string,
  callback: (doc: Y.Doc) => void
): (() => void) => {
  const existing = sessionYDocs.get(sessionId);
  if (existing) {
    callback(existing);
  }
  const handler = (id: string, doc: Y.Doc) => {
    if (id === sessionId) {
      callback(doc);
    }
  };
  listeners.add(handler);
  return () => {
    listeners.delete(handler);
  };
};
