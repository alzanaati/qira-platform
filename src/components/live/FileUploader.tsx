'use client';
import { useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Upload, FileText, Check } from 'lucide-react';
interface FileUploaderProps {
  streamId: string;
  onFileUploaded: (file: { id: string; file_url: string; file_type: string; file_name: string }) => void;
}
interface UpFile { id: string; file_name: string; file_url: string; file_type: string; }
export default function FileUploader({ streamId, onFileUploaded }: FileUploaderProps) {
  const supabase = createClient();
  const ref = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [files, setFiles] = useState<UpFile[]>([]);
  const [error, setError] = useState('');
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) { setError('الحد الأقصى 50MB'); return; }
    const allowed = ['application/pdf','application/vnd.ms-powerpoint','application/vnd.openxmlformats-officedocument.presentationml.presentation'];
    if (!allowed.includes(file.type)) { setError('PDF أو PPT فقط'); return; }
    setError(''); setUploading(true); setProgress(20);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('غير مسجّل');
      const ext = file.name.split('.').pop();
      const filePath = `${streamId}/${Date.now()}.${ext}`;
      setProgress(40);
      const { error: upErr } = await supabase.storage.from('stream-files').upload(filePath, file, { contentType: file.type });
      if (upErr) throw upErr;
      setProgress(70);
      const { data: { publicUrl } } = supabase.storage.from('stream-files').getPublicUrl(filePath);
      const fileType = file.type === 'application/pdf' ? 'pdf' : 'ppt';
      const { data: dbFile, error: dbErr } = await supabase.from('stream_files')
        .insert({ stream_id: streamId, uploaded_by: user.id, file_name: file.name, file_url: publicUrl, file_type: fileType, file_size: file.size })
        .select().single();
      if (dbErr) throw dbErr;
      setProgress(100);
      const newFile = { id: dbFile.id, file_name: file.name, file_url: publicUrl, file_type: fileType };
      setFiles(prev => [...prev, newFile]);
      onFileUploaded(newFile);
    } catch (err: any) { setError(err.message || 'فشل الرفع'); }
    finally { setUploading(false); setProgress(0); if (ref.current) ref.current.value = ''; }
  };
  return (
    <div className="p-3 bg-gray-800 rounded-lg space-y-2">
      <input ref={ref} type="file" accept=".pdf,.ppt,.pptx" className="hidden" onChange={handleUpload} />
      <button onClick={() => ref.current?.click()} disabled={uploading}
        className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-sm transition-colors">
        <Upload size={16} />{uploading ? `جارٍ الرفع ${progress}%` : 'رفع PDF/PPT'}
      </button>
      {uploading && <div className="bg-gray-700 rounded-full h-1.5"><div className="bg-blue-500 h-1.5 rounded-full transition-all" style={{ width: `${progress}%` }} /></div>}
      {error && <p className="text-red-400 text-xs">{error}</p>}
      {files.map(f => (
        <button key={f.id} onClick={() => onFileUploaded(f)}
          className="w-full flex items-center gap-2 p-2 bg-gray-700 hover:bg-gray-600 rounded text-sm text-white transition-colors">
          <FileText size={14} className="text-blue-400 shrink-0" />
          <span className="truncate flex-1 text-right">{f.file_name}</span>
          <Check size={14} className="text-green-400 shrink-0" />
        </button>
      ))}
    </div>
  );
}
