import React from 'react';
import infosysSvg from '../../assets/logos/infosys.svg';
import tcsNqtImg from '../../assets/logos/tcs-nqt-clean.png';
import cognizantSvg from '../../assets/logos/cognizant.svg';
import capgeminiSvg from '../../assets/logos/capgemini.svg';
import accentureSvg from '../../assets/logos/accenture.svg';
import wiproSvg from '../../assets/logos/wipro.svg';

// 1. INFOSYS OFFICIAL VECTOR LOGO (Transparent, No Background)
export const InfosysBrandLogo: React.FC<{ className?: string }> = ({ className = "h-9" }) => (
  <div className="flex items-center justify-center w-full py-1">
    <img 
      src={infosysSvg} 
      alt="Infosys" 
      className={`${className} w-auto max-w-[150px] object-contain transition-transform duration-300 group-hover:scale-105`} 
      loading="eager"
    />
  </div>
);

// 2. TCS NQT OFFICIAL LOGO (Transparent, No Background)
export const TcsNqtBrandLogo: React.FC<{ className?: string }> = ({ className = "h-10" }) => (
  <div className="flex items-center justify-center w-full py-1">
    <img 
      src={tcsNqtImg} 
      alt="TCS NQT (Tata Consultancy Services)" 
      className={`${className} w-auto max-w-[160px] object-contain transition-transform duration-300 group-hover:scale-105`} 
      loading="eager"
    />
  </div>
);

// 3. COGNIZANT OFFICIAL VECTOR LOGO (Transparent, No Background)
export const CognizantBrandLogo: React.FC<{ className?: string }> = ({ className = "h-7" }) => (
  <div className="flex items-center justify-center w-full py-1">
    <img 
      src={cognizantSvg} 
      alt="Cognizant" 
      className={`${className} w-auto max-w-[160px] object-contain transition-transform duration-300 group-hover:scale-105`} 
      loading="eager"
    />
  </div>
);

// 4. CAPGEMINI OFFICIAL VECTOR LOGO (Transparent, No Background)
export const CapgeminiBrandLogo: React.FC<{ className?: string }> = ({ className = "h-8" }) => (
  <div className="flex items-center justify-center w-full py-1">
    <img 
      src={capgeminiSvg} 
      alt="Capgemini" 
      className={`${className} w-auto max-w-[155px] object-contain transition-transform duration-300 group-hover:scale-105`} 
      loading="eager"
    />
  </div>
);

// 5. ACCENTURE OFFICIAL VECTOR LOGO (Transparent, No Background)
export const AccentureBrandLogo: React.FC<{ className?: string }> = ({ className = "h-7" }) => (
  <div className="flex items-center justify-center w-full py-1">
    <img 
      src={accentureSvg} 
      alt="Accenture" 
      className={`${className} w-auto max-w-[145px] object-contain transition-transform duration-300 group-hover:scale-105`} 
      loading="eager"
    />
  </div>
);

// 6. WIPRO OFFICIAL VECTOR LOGO (Transparent, No Background)
export const WiproBrandLogo: React.FC<{ className?: string }> = ({ className = "h-10" }) => (
  <div className="flex items-center justify-center w-full py-1">
    <img 
      src={wiproSvg} 
      alt="Wipro" 
      className={`${className} w-auto max-w-[130px] object-contain transition-transform duration-300 group-hover:scale-105`} 
      loading="eager"
    />
  </div>
);
