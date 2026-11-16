import { ReactNode } from 'react';

interface CaseStudyLayoutProps {
  children: ReactNode;
}

export function CaseStudyLayout({ children }: CaseStudyLayoutProps) {
  return (
    <div className="pt-20 pb-20">
      {children}
    </div>
  );
}

interface SectionProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  background?: 'white' | 'gray';
  noPadding?: boolean;
}

export function Section({ title, subtitle, children, background = 'white', noPadding = false }: SectionProps) {
  return (
    <section className={`${background === 'gray' ? 'bg-neutral-50' : 'bg-white'} ${noPadding ? 'py-0' : 'py-16'}`}>
      <div className="max-w-7xl mx-auto px-6">
        {title && (
          <div className="mb-12">
            <h2 className="text-3xl text-neutral-900 mb-2">{title}</h2>
            {subtitle && <p className="text-lg text-neutral-600">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

interface HeroProps {
  title: string;
  subtitle: string;
  tags: string[];
  overview: string;
  role?: string;
  duration?: string;
  team?: string;
  gradient: string;
  icon?: ReactNode;
  heroImage?: string;
}

export function Hero({ title, subtitle, tags, overview, role, duration, team, gradient, icon, heroImage }: HeroProps) {
  return (
    <section className={`${gradient} py-20`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex gap-2 mb-4 flex-wrap">
              {tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full text-sm text-neutral-700 border border-neutral-200">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-5xl mb-4 text-neutral-900">{title}</h1>
            <p className="text-xl text-neutral-700 mb-8">{subtitle}</p>
            <p className="text-neutral-600 leading-relaxed">{overview}</p>
            
            {(role || duration || team) && (
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {role && (
                  <div>
                    <div className="text-sm text-neutral-500 mb-1">Role</div>
                    <div className="text-neutral-900">{role}</div>
                  </div>
                )}
                {duration && (
                  <div>
                    <div className="text-sm text-neutral-500 mb-1">Duration</div>
                    <div className="text-neutral-900">{duration}</div>
                  </div>
                )}
                {team && (
                  <div>
                    <div className="text-sm text-neutral-500 mb-1">Team</div>
                    <div className="text-neutral-900">{team}</div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-center">
            {heroImage ? (
              <img 
                src={heroImage} 
                alt={`${title} hero`}
                className="w-full rounded-lg shadow-2xl"
              />
            ) : (
              <div className="w-64 h-64 bg-white rounded-full shadow-2xl flex items-center justify-center">
                <div className="text-8xl">{icon}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

interface TextBlockProps {
  heading?: string;
  content: string | string[];
  columns?: 1 | 2;
}

export function TextBlock({ heading, content, columns = 1 }: TextBlockProps) {
  const paragraphs = Array.isArray(content) ? content : [content];
  
  return (
    <div className="mb-8">
      {heading && <h3 className="text-2xl text-neutral-900 mb-4">{heading}</h3>}
      <div className={columns === 2 ? 'grid grid-cols-1 md:grid-cols-2 gap-8' : ''}>
        {paragraphs.map((para, idx) => (
          <p key={idx} className="text-neutral-700 leading-relaxed mb-4 last:mb-0">
            {para}
          </p>
        ))}
      </div>
    </div>
  );
}

interface ImageGridProps {
  images: Array<{ src: string; alt: string; caption?: string }>;
  columns?: 1 | 2 | 3 | 4;
}

export function ImageGrid({ images, columns = 2 }: ImageGridProps) {
  const gridClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4'
  }[columns];

  return (
    <div className={`grid ${gridClass} gap-6`}>
      {images.map((image, idx) => (
        <div key={idx} className="space-y-2">
          <img 
            src={image.src} 
            alt={image.alt}
            className="w-full rounded-lg shadow-md"
          />
          {image.caption && (
            <p className="text-sm text-neutral-600 text-center">{image.caption}</p>
          )}
        </div>
      ))}
    </div>
  );
}

interface FullWidthImageProps {
  src: string;
  alt: string;
  caption?: string;
}

export function FullWidthImage({ src, alt, caption }: FullWidthImageProps) {
  return (
    <div className="space-y-4">
      <img 
        src={src} 
        alt={alt}
        className="w-full rounded-lg shadow-lg"
      />
      {caption && (
        <p className="text-sm text-neutral-600 text-center">{caption}</p>
      )}
    </div>
  );
}