import { NotebookEntry, ScreenshotQuality } from '../types';

export function captureCanvasScreenshot(
  canvasElement: HTMLCanvasElement | null,
  filename: string = 'cell-architecture-capture.png',
  quality: ScreenshotQuality = 'web'
): void {
  if (!canvasElement) {
    console.warn('[Cell Architecture Studio] No canvas element available for capture.');
    return;
  }

  try {
    const scaleMap: Record<ScreenshotQuality, number> = {
      web: 1,
      print: 2,
      ultra: 4,
    };
    const scale = scaleMap[quality] || 1;

    if (scale === 1) {
      const dataUrl = canvasElement.toDataURL('image/png', 0.95);
      triggerDownload(dataUrl, filename);
    } else {
      // Create an offscreen higher resolution render
      const offscreen = document.createElement('canvas');
      offscreen.width = canvasElement.width * scale;
      offscreen.height = canvasElement.height * scale;
      const ctx = offscreen.getContext('2d');
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(canvasElement, 0, 0, offscreen.width, offscreen.height);
        const dataUrl = offscreen.toDataURL('image/png', 0.95);
        triggerDownload(dataUrl, filename);
      } else {
        const dataUrl = canvasElement.toDataURL('image/png', 0.95);
        triggerDownload(dataUrl, filename);
      }
    }
  } catch (err) {
    console.error('[Cell Architecture Studio] Error capturing screenshot:', err);
  }
}

export function triggerDownload(url: string, filename: string): void {
  const link = document.createElement('a');
  link.download = filename;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportNotebooksAsJson(notebooks: NotebookEntry[]): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(notebooks, null, 2));
  triggerDownload(dataStr, `cell-architecture-notes-${new Date().toISOString().slice(0, 10)}.json`);
}

export function exportNotebookAsPrintablePdf(entry: NotebookEntry, cellName: string): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${entry.title} - Cell Architecture Studio</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
          h1 { color: #0f172a; margin-bottom: 4px; border-bottom: 2px solid #3b82f6; padding-bottom: 8px; }
          .meta { color: #64748b; font-size: 13px; margin-bottom: 24px; }
          .tag { display: inline-block; background: #e2e8f0; color: #334155; padding: 2px 8px; border-radius: 4px; font-size: 12px; margin-right: 6px; }
          .content { white-space: pre-wrap; font-size: 15px; margin-top: 20px; }
          .footer { margin-top: 60px; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 12px; }
        </style>
      </head>
      <body>
        <h1>${entry.title || 'Cytological Laboratory Notes'}</h1>
        <div class="meta">
          <strong>Specimen:</strong> ${cellName} &bull; 
          <strong>Date:</strong> ${new Date(entry.updatedAt).toLocaleString()}
          <div style="margin-top: 8px;">
            ${entry.tags.map((t) => `<span class="tag">#${t}</span>`).join('')}
          </div>
        </div>
        <div class="content">${escapeHtml(entry.content || 'No observations recorded.')}</div>
        <div class="footer">Exported from Cell Architecture Studio &bull; Precision 3D Histology</div>
        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
