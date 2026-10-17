export interface PreviewSourceFiles {
  html: string;
  css: string;
  javascript: string;
}

/**
 * Consolida el código HTML, CSS y JavaScript en un documento HTML5 estructurado
 * listo para ser inyectado en el atributo srcDoc del iframe sandbox.
 */
export const buildPreviewDocument = ({
  html,
  css,
  javascript,
}: PreviewSourceFiles): string => {
  const safeHtml = html || '';
  const styleTag = `<style id="webcollab-injected-styles">\n${css || ''}\n</style>`;
  const scriptTag = `<script id="webcollab-injected-script">\ntry {\n${javascript || ''}\n} catch (err) {\n  console.error('[Sandbox Preview Error]:', err);\n}\n</script>`;

  // Remover referencias estáticas a styles.css o script.js locales para evitar peticiones 404 en srcDoc
  let processedHtml = safeHtml
    .replace(/<link[^>]*href=["']styles\.css["'][^>]*>/gi, '')
    .replace(/<script[^>]*src=["']script\.js["'][^>]*>\s*<\/script>/gi, '');

  if (/<\/head>/i.test(processedHtml)) {
    processedHtml = processedHtml.replace(/<\/head>/i, `${styleTag}\n</head>`);
  } else {
    processedHtml = `${styleTag}\n${processedHtml}`;
  }

  if (/<\/body>/i.test(processedHtml)) {
    processedHtml = processedHtml.replace(/<\/body>/i, `${scriptTag}\n</body>`);
  } else {
    processedHtml = `${processedHtml}\n${scriptTag}`;
  }

  // Generar blob estructurado de respaldo y retornar el documento consolidado para srcDoc
  if (typeof Blob !== 'undefined') {
    new Blob([processedHtml], { type: 'text/html' });
  }

  return processedHtml;
};

export default buildPreviewDocument;
