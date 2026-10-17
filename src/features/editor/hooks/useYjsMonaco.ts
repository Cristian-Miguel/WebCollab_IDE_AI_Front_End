import { useEffect, useRef, useState } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { MonacoBinding } from 'y-monaco';
import { YJS_WS_BASE_URL } from '../../../core/const/api_routes';
import { getAccessToken } from '../../../core/config/jwt_manage';
import { useAppDispatch } from '../../../core/hooks/redux_hooks';
import { updateFileContent } from '../store/editorSlice';
import { setSyncLatencyMs } from '../../presence/store/presenceSlice';
import { getOrCreateSessionYDoc, destroySessionYDoc } from '../../preview/utils/yjsDocRegistry';
import type { EditorFileName } from '../types/editor_types';

interface UseYjsMonacoOptions {
  sessionId?: string;
  activeFile: EditorFileName;
  editorInstance: unknown | null;
  userId?: string;
  userName?: string;
}

export const useYjsMonaco = ({
  sessionId,
  activeFile,
  editorInstance,
  userId,
  userName,
}: UseYjsMonacoOptions) => {
  const dispatch = useAppDispatch();
  const [yjsSynced, setYjsSynced] = useState(false);
  const ydocRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);
  const bindingRef = useRef<MonacoBinding | null>(null);

  // 1. Inicializar Y.Doc compartido y WebsocketProvider por sesión en /yjs-ws
  useEffect(() => {
    if (!sessionId) {
      return;
    }

    const ydoc = getOrCreateSessionYDoc(sessionId);
    ydocRef.current = ydoc;

    const token = getAccessToken() || '';
    const params: Record<string, string> = {};
    if (token) {
      params.token = token;
    }
    if (userId) {
      params.userId = userId;
    }

    const startTime = performance.now();
    const provider = new WebsocketProvider(YJS_WS_BASE_URL, sessionId, ydoc, {
      connect: true,
      params,
    });
    providerRef.current = provider;

    provider.awareness.setLocalStateField('user', {
      name: userName || 'Colaborador',
      color: '#3b82f6',
    });

    provider.on('status', (event: { status: string }) => {
      const isConnected = event.status === 'connected';
      setYjsSynced(isConnected);
      if (isConnected) {
        const elapsed = Math.max(5, Math.min(180, Math.round(performance.now() - startTime)));
        dispatch(setSyncLatencyMs(elapsed));
      }
    });

    const fileNames: EditorFileName[] = ['index.html', 'styles.css', 'script.js'];
    const observers = fileNames.map((fileName) => {
      const ytext = ydoc.getText(fileName);
      const handler = () => {
        dispatch(
          updateFileContent({
            fileName,
            content: ytext.toString(),
          })
        );
      };
      ytext.observe(handler);
      return { ytext, handler };
    });

    return () => {
      observers.forEach(({ ytext, handler }) => ytext.unobserve(handler));
      if (bindingRef.current) {
        bindingRef.current.destroy();
        bindingRef.current = null;
      }
      provider.destroy();
      destroySessionYDoc(sessionId);
      providerRef.current = null;
      ydocRef.current = null;
      setYjsSynced(false);
    };
  }, [sessionId, userId, userName, dispatch]);

  // 2. Vincular el modelo activo de Monaco con Y.Text usando MonacoBinding (y-monaco)
  useEffect(() => {
    if (!editorInstance || !ydocRef.current || !providerRef.current) {
      return;
    }

    const editor = editorInstance as {
      getModel?: () => unknown;
    };
    const model = editor.getModel?.();
    if (!model) {
      return;
    }

    if (bindingRef.current) {
      bindingRef.current.destroy();
      bindingRef.current = null;
    }

    const ytext = ydocRef.current.getText(activeFile);
    const binding = new MonacoBinding(
      ytext,
      model as never,
      new Set([editorInstance as never]),
      providerRef.current.awareness
    );
    bindingRef.current = binding;

    return () => {
      if (bindingRef.current) {
        bindingRef.current.destroy();
        bindingRef.current = null;
      }
    };
  }, [editorInstance, activeFile, yjsSynced]);

  return { yjsSynced };
};

export default useYjsMonaco;
