import React, { useEffect } from 'react';

interface AdBannerProps {
  dataAdSlot?: string;
  dataAdFormat?: string;
  dataFullWidthResponsive?: boolean;
}

export const AdBanner: React.FC<AdBannerProps> = ({ 
  dataAdSlot, 
  dataAdFormat = "auto", 
  dataFullWidthResponsive = true 
}) => {
  const isValidSlot = Boolean(dataAdSlot && /^\d{8,12}$/.test(dataAdSlot));

  useEffect(() => {
    if (!isValidSlot) return;
    try {
      if (typeof window !== "undefined") {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (err) {
      // Silently handle ad push errors to prevent console pollution
    }
  }, [isValidSlot]);

  if (!isValidSlot) {
    return null; // Don't render broken ins blocks before official ad unit creation
  }

  return (
    <div className="w-full flex justify-center my-3 overflow-hidden">
      <ins className="adsbygoogle"
           style={{ display: 'block', minWidth: '300px', width: '100%', textAlign: 'center' }}
           data-ad-client="ca-pub-1068718275969438"
           data-ad-slot={dataAdSlot}
           data-ad-format={dataAdFormat}
           data-full-width-responsive={dataFullWidthResponsive ? "true" : "false"}>
      </ins>
    </div>
  );
};
