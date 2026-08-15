import { useRef, useState, useEffect } from 'react';
import { ImagePlus, Loader2, X, FileImage } from 'lucide-react';

interface ImageUploadProps {
  onTextExtracted: (text: string, imagePath: string) => void;
  onClose: () => void;
}

export function ImageUpload({ onTextExtracted, onClose }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview); };
  }, [preview]);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (PNG, JPG, or WebP).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be under 10 MB.');
      return;
    }

    setError(null);
    setFileName(file.name);
    const url = URL.createObjectURL(file);
    setPreview(url);

    setProcessing(true);
    setProgress(0);

    try {
      const { createWorker } = await import('tesseract.js');
      const worker = await createWorker('eng', 1, {
        logger: (m: { status: string; progress: number }) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });

      const { data } = await worker.recognize(file);
      await worker.terminate();

      if (!data.text || data.text.trim().length < 3) {
        setError('No readable text was found in this image. Try a clearer photo or paste the text manually.');
        setProcessing(false);
        return;
      }

      const imagePath = `uploads/${file.name}-${Date.now()}`;
      onTextExtracted(data.text.trim(), imagePath);
    } catch {
      setError('Could not process this image. Please try a different photo or paste the text manually.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleReset = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setFileName('');
    setError(null);
    setProgress(0);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="card p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileImage className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">Upload a medical report image</span>
        </div>
        <button onClick={onClose} className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700" aria-label="Close upload">
          <X className="h-4 w-4" />
        </button>
      </div>

      {!preview && !processing && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
            dragOver ? 'border-primary-500 bg-primary-50/40' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }`}
        >
          <ImagePlus className="mx-auto h-8 w-8 text-gray-400" />
          <p className="mt-3 text-sm font-medium text-gray-700">Click to upload or drag and drop</p>
          <p className="mt-1 text-xs text-gray-400">PNG, JPG, or WebP — up to 10 MB</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleInputChange}
            className="hidden"
          />
        </div>
      )}

      {preview && (
        <div className="space-y-3">
          <div className="relative overflow-hidden rounded-lg border border-gray-200">
            <img src={preview} alt="Uploaded medical report" className="max-h-64 w-full object-contain bg-gray-50" />
            {!processing && (
              <button
                onClick={handleReset}
                className="absolute right-2 top-2 rounded-md bg-white/90 p-1.5 text-gray-600 shadow-sm transition-colors hover:bg-white hover:text-gray-900"
                aria-label="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {processing && (
            <div className="flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-2.5">
              <Loader2 className="h-4 w-4 animate-spin text-primary-600" />
              <div className="flex-1">
                <p className="text-sm text-gray-600">Extracting text from image…</p>
                <div className="mt-1.5 h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
                  <div className="h-full rounded-full bg-primary-600 transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
              </div>
              <span className="text-xs tabular-nums text-gray-400">{progress}%</span>
            </div>
          )}

          {!processing && !error && (
            <p className="text-sm text-gray-500 truncate">
              <span className="font-medium text-gray-700">{fileName}</span> — text extracted successfully
            </p>
          )}
        </div>
      )}

      {error && (
        <div className="mt-3 rounded-lg border border-error-200 bg-error-50 px-3 py-2.5 text-sm text-error-700">
          {error}
        </div>
      )}
    </div>
  );
}
