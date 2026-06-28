'use client';
import { useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, FileText } from 'lucide-react';
interface ContentViewerProps {
  streamId: string;
  isHost: boolean;
  currentFile: { id: string; file_url: string; file_type: string; file_name: string } | null;
}
export default function ContentViewer({ streamId, isHost, currentFile }: ContentViewerProps) {
  const supabase = createClient();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [zoom, setZoom] = useState(1.0);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const renderTaskRef = useRef<any>(null);
  useEffect(() => {
    if (!streamId) return;
    const ch = supabase.channel('cs-' + streamId)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'stream_content_state', filter: 'stream_id=eq.' + streamId },
        (payload: any) => {
          if (payload.new && !isHost) {
            setCurrentPage(payload.new.current_page || 1);
            setZoom(payload.new.zoom_level || 1.0);
          }
        }).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [streamId, isHost]);
  useEffect(() => {
    if (!currentFile || currentFile.file_type !== 'pdf') { setPdfDoc(null); return; }
    setLoading(true);
    import('pdfjs-dist').then(async (lib: any) => {
      lib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
      try {
        const doc = await lib.getDocument(currentFile.file_url).promise;
        setPdfDoc(doc); setTotalPages(doc.numPages); setCurrentPage(1);
      } catch (e) { console.error(e); } finally { setLoading(false); }
    });
  }, [currentFile]);
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;
    if (renderTaskRef.current) renderTaskRef.current.cancel();
    pdfDoc.getPage(currentPage).then((page: any) => {
      const vp = page.getViewport({ scale: zoom });
      const canvas = canvasRef.current!;
      canvas.width = vp.width; canvas.height = vp.height;
      const task = page.render({ canvasContext: canvas.getContext('2d')!, viewport: vp });
      renderTaskRef.current = task;
      task.promise.catch(() => {});
    });
  }, [pdfDoc, currentPage, zoom]);
  const sync = async (p: number, z: number) => {
    if (!isHost || !currentFile) return;
    await supabase.from('stream_content_state').upsert({ stream_id: streamId, file_id: currentFile.id, current_page: p, zoom_level: z, screen_share_active: false, updated_at: new Date().toISOString() }, { onConflict: 'stream_id' });
  };
  const gotoPage = async (p: number) => { const np = Math.max(1, Math.min(p, totalPages)); setCurrentPage(np); await sync(np, zoom); };
  const chgZoom = async (d: number) => { const z = Math.max(0.5, Math.min(3.0, zoom + d)); setZoom(z); await sync(currentPage, z); };
  if (!currentFile) return (
    <div className="flex items-center justify-center h-full bg-gray-900 text-gray-400">
      <div className="text-center"><FileText size={48} className="mx-auto mb-3 opacity-50" /><p className="text-sm">ÙØ§ ÙÙØ¬Ø¯ ÙØ­ØªÙÙ</p>{isHost && <p className="text-xs mt-1 opacity-60">Ø§Ø±ÙØ¹ ÙÙÙØ§Ù</p>}</div>
    </div>
  );
  return (
    <div className="flex flex-col h-full bg-gray-900">
      {isHost && (
        <div className="flex items-center justify-between p-2 bg-gray-800 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <button onClick={() => gotoPage(currentPage - 1)} disabled={currentPage <= 1} className="p-1 rounded hover:bg-gray-700 disabled:opacity-30 text-white"><ChevronRight size={16} /></button>
            <span className="text-white text-xs">{currentPage}/{totalPages}</span>
            <button onClick={() => gotoPage(currentPage + 1)} disabled={currentPage >= totalPages} className="p-1 rounded hover:bg-gray-700 disabled:opacity-30 text-white"><ChevronLeft size={16} /></button>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => chgZoom(-0.1)} className="p-1 rounded hover:bg-gray-700 text-white"><ZoomOut size={16} /></button>
            <span className="text-white text-xs">{Math.round(zoom*100)}%</span>
            <button onClick={() => chgZoom(0.1)} className="p-1 rounded hover:bg-gray-700 text-white"><ZoomIn size={16} /></button>
          </div>
          <span className="text-gray-400 text-xs truncate max-w-[8rem]">{currentFile.file_name}</span>
        </div>
      )}
      <div className="flex-1 overflow-auto flex items-start justify-center p-2">
        {loading ? <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 m-auto" /> : <canvas ref={canvasRef} className="shadow-2xl max-w-full" />}
      </div>
      {!isHost && <div className="p-2 bg-gray-800 text-center text-gray-400 text-xs">{currentFile.file_name} â ØµÙØ­Ø© {currentPage}/{totalPages}</div>}
    </div>
  );
}
