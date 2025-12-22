import { cn } from '@/lib/utils';

type PageBannerProps = {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
};

const PageBanner = ({
  title,
  description,
  children,
  className,
}: PageBannerProps) => (
  <div
    className={cn(
      'container mx-auto flex flex-col items-center justify-center text-center py-12 md:py-16 px-4 md:px-6 space-y-6 md:space-y-8',
      className,
    )}
  >
    <h1 className="text-heading-1 font-bold">{title}</h1>
    {description && (
      <p className="text-body-lg text-secondary max-w-2xl mx-auto leading-relaxed">
        {description}
      </p>
    )}
    {children}
  </div>
);

export default PageBanner;
