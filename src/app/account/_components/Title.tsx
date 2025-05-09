const Title = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <h2 className={`text-2xl font-heading font-semibold ${className}`}>{children}</h2>;
};

export default Title;
