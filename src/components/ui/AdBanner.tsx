import React, { useEffect } from 'react';

interface AdBannerProps {
  dataAdSlot?: string;
  dataAdFormat?: string;
  dataFullWidthResponsive?: boolean;
}

export const AdBanner: React.FC<AdBannerProps> = ({ 
  dataAdSlot = "1234567890", 
  dataAdFormat = "auto", 
  dataFullWidthResponsive = true 
}) => {
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <div className="w-full flex justify-center my-8 overflow-hidden bg-neutral-50/50 py-4 rounded-xl border border-neutral-100 min-h-[100px]">
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
