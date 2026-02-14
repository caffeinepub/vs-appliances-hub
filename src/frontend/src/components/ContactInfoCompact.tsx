import { Mail, MapPin, Phone } from 'lucide-react';
import { BRANDING } from '../constants/branding';

interface ContactInfoCompactProps {
  className?: string;
  variant?: 'header' | 'footer';
  mode?: 'email-location' | 'email-phone' | 'phone-location';
}

export default function ContactInfoCompact({ 
  className = '', 
  variant = 'header',
  mode = 'email-location'
}: ContactInfoCompactProps) {
  const textSize = variant === 'header' ? 'text-xs' : 'text-sm';
  const iconSize = variant === 'header' ? 'h-3.5 w-3.5' : 'h-4 w-4';
  const gap = variant === 'header' ? 'gap-1.5' : 'gap-2';

  if (mode === 'phone-location') {
    return (
      <div className={`flex flex-col ${gap} ${className}`}>
        <a
          href={`tel:${BRANDING.phone}`}
          className={`flex items-center ${gap} text-muted-foreground hover:text-primary transition-colors ${textSize}`}
          aria-label={`Call us at ${BRANDING.phone}`}
        >
          <Phone className={iconSize} aria-hidden="true" />
          <span>{BRANDING.phone}</span>
        </a>
        <div
          className={`flex items-center ${gap} text-muted-foreground ${textSize}`}
          aria-label={`Location: ${BRANDING.location}`}
        >
          <MapPin className={iconSize} aria-hidden="true" />
          <span>{BRANDING.location}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${gap} ${className}`}>
      <a
        href={`mailto:${BRANDING.email}`}
        className={`flex items-center ${gap} text-muted-foreground hover:text-primary transition-colors ${textSize}`}
        aria-label={`Email us at ${BRANDING.email}`}
      >
        <Mail className={iconSize} aria-hidden="true" />
        <span className="truncate max-w-[200px]">{BRANDING.email}</span>
      </a>
      {mode === 'email-location' ? (
        <div
          className={`flex items-center ${gap} text-muted-foreground ${textSize}`}
          aria-label={`Location: ${BRANDING.location}`}
        >
          <MapPin className={iconSize} aria-hidden="true" />
          <span>{BRANDING.location}</span>
        </div>
      ) : (
        <a
          href={`tel:${BRANDING.phone}`}
          className={`flex items-center ${gap} text-muted-foreground hover:text-primary transition-colors ${textSize}`}
          aria-label={`Call us at ${BRANDING.phone}`}
        >
          <Phone className={iconSize} aria-hidden="true" />
          <span>{BRANDING.phone}</span>
        </a>
      )}
    </div>
  );
}
