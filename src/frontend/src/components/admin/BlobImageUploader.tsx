import { useState, useEffect } from 'react';
import { ExternalBlob } from '../../backend';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';

interface BlobImageUploaderProps {
  onImageSelected: (blob: ExternalBlob) => void;
  onImageCleared?: () => void;
  currentImageUrl?: string;
  label?: string;
}

export default function BlobImageUploader({ 
  onImageSelected, 
  onImageCleared,
  currentImageUrl, 
  label = 'Image' 
}: BlobImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Update preview when currentImageUrl changes
  useEffect(() => {
    if (currentImageUrl) {
      setPreviewUrl(currentImageUrl);
    } else {
      setPreviewUrl(null);
    }
  }, [currentImageUrl]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Read file as array buffer
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      // Create ExternalBlob with progress tracking
      const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      // Create preview URL
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);

      // Pass blob to parent
      onImageSelected(blob);
      
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Failed to upload image:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const clearImage = () => {
    setPreviewUrl(null);
    setUploadProgress(0);
    if (onImageCleared) {
      onImageCleared();
    }
  };

  return (
    <div className="space-y-4">
      <Label>{label}</Label>
      
      {previewUrl && (
        <div className="relative inline-block">
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="max-w-xs h-auto rounded-lg border"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={clearImage}
            disabled={uploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="flex items-center gap-4">
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="max-w-xs"
        />
        <Upload className="h-5 w-5 text-muted-foreground" />
      </div>

      {uploading && (
        <div className="space-y-2">
          <Progress value={uploadProgress} />
          <p className="text-sm text-muted-foreground">Uploading: {uploadProgress}%</p>
        </div>
      )}
    </div>
  );
}
