import { BRANDING } from '../constants/branding';
import AppImage from './AppImage';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function BrandLogo({ className = '', size = 'md' }: BrandLogoProps) {
  const sizeClasses = {
    sm: 'h-10 w-10',
    md: 'h-16 w-16',
    lg: 'h-20 w-20',
  };

  return (
    <AppImage
      src={BRANDING.logo.src}
      alt={BRANDING.logo.alt}
      className={`${sizeClasses[size]} ${className} object-contain`}
      loading="eager"
      fallbackClassName={`${sizeClasses[size]} ${className} rounded-lg bg-primary/10 border-2 border-primary`}
    />
  );
}
