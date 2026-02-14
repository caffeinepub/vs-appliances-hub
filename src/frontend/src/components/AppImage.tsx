import { useState, ImgHTMLAttributes } from 'react';

interface AppImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'onError'> {
  src: string;
  alt: string;
  className?: string;
  loading?: 'eager' | 'lazy';
  decoding?: 'async' | 'sync' | 'auto';
  fallbackClassName?: string;
}

export default function AppImage({
  src,
  alt,
  className = '',
  loading = 'lazy',
  decoding = 'async',
  fallbackClassName = '',
  ...props
}: AppImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-muted border border-border ${fallbackClassName || className}`}
        aria-label={alt}
        role="img"
      >
        <span className="sr-only">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      decoding={decoding}
      onError={() => setHasError(true)}
      {...props}
    />
  );
}
