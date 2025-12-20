const PageBanner = ({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`container mx-auto flex flex-col items-center justify-center text-center py-12 px-4 space-y-8 ${className}`}
  >
    <h1 className="text-heading-1">{title}</h1>
    {description && (
      <p className="text-body-lg text-secondary mb-8 max-w-xl line-clamp-4 overflow-hidden">
        {description}
      </p>
    )}
    {children}
  </div>
);

export default PageBanner;
