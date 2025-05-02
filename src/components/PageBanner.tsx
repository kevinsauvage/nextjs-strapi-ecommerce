const PageBanner = ({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
}) => (
  <div className="container mx-auto flex flex-col items-center justify-center text-center py-12 px-2 space-y-8">
    <h1 className="font-heading text-4xl">{title}</h1>
    {description && (
      <p className="text-muted-foreground mb-8 max-w-2xl line-clamp-4 overflow-hidden">
        {description}
      </p>
    )}
    {children}
  </div>
);

export default PageBanner;
