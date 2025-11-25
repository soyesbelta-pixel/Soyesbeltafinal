import { useState, useRef } from 'react';
import { Upload, X, Video as VideoIcon, AlertCircle, Link as LinkIcon } from 'lucide-react';
import ImageService from '../../services/ImageService';

const VideoUploader = ({ existingVideo = null, onChange }) => {
  const [video, setVideo] = useState(existingVideo);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMode, setUploadMode] = useState('file'); // 'file' or 'url'
  const [videoUrl, setVideoUrl] = useState(existingVideo || '');
  const fileInputRef = useRef(null);

  const handleFileSelect = async (files) => {
    if (!files || files.length === 0) return;

    try {
      setUploadError(null);
      setIsUploading(true);

      const file = files[0];

      // Validate video file
      ImageService.validateVideoFile(file);

      // Create local preview
      const preview = URL.createObjectURL(file);

      setVideo({
        file,
        preview,
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB'
      });

      onChange({ file, preview });
    } catch (error) {
      setUploadError(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  };

  const handleRemoveVideo = () => {
    if (video?.preview) {
      URL.revokeObjectURL(video.preview);
    }
    setVideo(null);
    setVideoUrl('');
    onChange(null);
  };

  const handleUrlSubmit = () => {
    if (!videoUrl.trim()) {
      setUploadError('Por favor ingresa una URL válida');
      return;
    }

    // Basic URL validation
    try {
      new URL(videoUrl);
      setVideo({ url: videoUrl });
      onChange({ url: videoUrl });
      setUploadError(null);
    } catch (error) {
      setUploadError('URL no válida. Debe incluir http:// o https://');
    }
  };

  return (
    <div className="space-y-4">
      {/* Mode Selector */}
      <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setUploadMode('file')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${
            uploadMode === 'file'
              ? 'bg-white text-esbelta-chocolate shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>Subir Archivo</span>
        </button>
        <button
          onClick={() => setUploadMode('url')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${
            uploadMode === 'url'
              ? 'bg-white text-esbelta-chocolate shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <LinkIcon className="w-4 h-4" />
          <span>URL Externa</span>
        </button>
      </div>

      {/* File Upload Mode */}
      {uploadMode === 'file' && !video && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer ${
            isDragging
              ? 'border-esbelta-terracotta bg-esbelta-terracotta/10'
              : 'border-gray-300 hover:border-esbelta-terracotta hover:bg-gray-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />

          <div className="text-center">
            <VideoIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-700 font-medium mb-2">
              Arrastra un video aquí o haz clic para seleccionar
            </p>
            <p className="text-sm text-gray-500">
              MP4, WEBM, OGG (máx. 50MB)
            </p>
          </div>

          {isUploading && (
            <div className="absolute inset-0 bg-white/90 flex items-center justify-center rounded-xl">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-esbelta-terracotta border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-gray-700 font-medium">Procesando video...</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* URL Input Mode */}
      {uploadMode === 'url' && !video && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://ejemplo.com/video.mp4"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-esbelta-terracotta"
            />
            <button
              onClick={handleUrlSubmit}
              className="px-6 py-3 bg-esbelta-chocolate text-white font-medium rounded-lg hover:bg-esbelta-chocolate/90 transition-all"
            >
              Agregar
            </button>
          </div>
          <p className="text-sm text-gray-500">
            Ingresa la URL completa del video (YouTube, Vimeo, u otro hosting)
          </p>
        </div>
      )}

      {/* Error Message */}
      {uploadError && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">{uploadError}</p>
        </div>
      )}

      {/* Video Preview */}
      {video && (
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="bg-esbelta-terracotta/10 p-2 rounded-lg">
                <VideoIcon className="w-5 h-5 text-esbelta-terracotta" />
              </div>
              <div>
                <p className="font-medium text-gray-800">
                  {video.name || 'Video URL'}
                </p>
                {video.size && (
                  <p className="text-sm text-gray-500">{video.size}</p>
                )}
                {video.url && (
                  <p className="text-sm text-gray-500 truncate max-w-xs">{video.url}</p>
                )}
              </div>
            </div>
            <button
              onClick={handleRemoveVideo}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Video Player Preview */}
          {video.preview && (
            <video
              src={video.preview}
              controls
              className="w-full max-h-64 rounded-lg bg-black"
            />
          )}

          {video.url && (
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600">
                URL del video: <span className="font-mono text-xs break-all">{video.url}</span>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Helper Text */}
      {!video && (
        <p className="text-sm text-gray-500 text-center">
          {uploadMode === 'file'
            ? 'El video se subirá a Supabase Storage cuando guardes el producto'
            : 'El video se cargará desde la URL externa proporcionada'}
        </p>
      )}
    </div>
  );
};

export default VideoUploader;
