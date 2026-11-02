import React, { useEffect } from 'react';

export interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogType?: string;
  ogImage?: string;
  schema?: Record<string, any> | Array<Record<string, any>>;
}

const DEFAULT_TITLE = 'AptiVerse - Gamified Apti & Gaming Aptitude Platform | Infosys Mock Interview, PYQs & Practice Tests';
const DEFAULT_DESCRIPTION = "Master gamified apti & gaming aptitude tests with interactive puzzle games (Queens, Motion, Sudoku). Ace campus placements with Infosys AI mock interviews, Infosys PYQs, full-length practice tests (54 Qs • 100 Min), and company mock assessments.";
const DEFAULT_KEYWORDS = 'gamified apti, gaming apti, apti games, gamified aptitude test, cognitive aptitude games, infosys mock interview, infosys pyq, infosys practice test, infosys previous year questions, infosys placement papers 2026, infosys systems engineer test, infosys puzzle test, tcs nqt mock test, capgemini gamified aptitude, aptitude practice for placements, aptiverse';
const DEFAULT_CANONICAL = 'https://www.aptiverse.in/';
const DEFAULT_OG_IMAGE = 'https://www.aptiverse.in/logo.png';

export const SEOHead: React.FC<SEOHeadProps> = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  canonicalUrl = DEFAULT_CANONICAL,
  ogType = 'website',
  ogImage = DEFAULT_OG_IMAGE,
  schema,
}) => {
  useEffect(() => {
    // 1. Title
    document.title = title;

    // Helper to set or create meta tag
    const setMetaTag = (attributeName: string, attributeValue: string, content: string) => {
      let meta = document.querySelector(`meta[${attributeName}="${attributeValue}"]`) as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attributeName, attributeValue);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Helper to set or create link tag
    const setLinkTag = (rel: string, href: string) => {
      let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', rel);
        document.head.appendChild(link);
      }
      link.setAttribute('href', href);
    };

    // 2. Standard Meta Tags
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'keywords', keywords);
    setMetaTag('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    setMetaTag('name', 'author', 'AptiVerse');

    // 3. Canonical Link
    setLinkTag('canonical', canonicalUrl);

    // 4. OpenGraph Tags
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:image', ogImage);
    setMetaTag('property', 'og:site_name', 'AptiVerse');
    setMetaTag('property', 'og:locale', 'en_US');

    // 5. Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', ogImage);

    // 6. Structured Data (JSON-LD)
    const scriptId = 'dynamic-route-schema-jsonld';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (schema) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = scriptId;
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(schema);
    } else if (scriptTag) {
      scriptTag.remove();
    }

    return () => {
      // Optional cleanup on component unmount
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [title, description, keywords, canonicalUrl, ogType, ogImage, schema]);

  return null;
};

