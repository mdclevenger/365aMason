import React, { useRef } from 'react';
import { ImagePlus, X } from 'lucide-react';

interface ImageUploadProps {
  selectedImage: string | null;
  onImageSelect: (base64: string | null) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ selectedImage, onImageSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      onImageSelect(base64String);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    onImageSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      
      {selectedImage ? (
        <div className="relative group inline-block">
          <img 
            src={selectedImage} 
            alt="Selected" 
            className="h-12 w-12 object-cover rounded-lg border border-masonic-gold/50 shadow-sm" 
          />
          <button
            onClick={clearImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 shadow-md hover:bg-red-600 transition-colors"
          >
            <X size={12} />
          </button>
        </div>
      ) : (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-masonic-gold hover:bg-slate-800 rounded-full transition-colors border border-transparent hover:border-masonic-gold/30"
          title="Upload a symbol"
        >
          <ImagePlus className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};