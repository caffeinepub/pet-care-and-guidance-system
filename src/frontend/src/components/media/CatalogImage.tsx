import { useState } from 'react';

interface CatalogImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}

export default function CatalogImage({ 
  src, 
  alt, 
  className = '', 
  fallbackSrc = '/assets/catalog/placeholders/breed-placeholder.dim_800x500.png' 
}: CatalogImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <img 
      src={imgSrc} 
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
}
