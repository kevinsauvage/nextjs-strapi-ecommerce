const FormContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-white dark:bg-black w-full">
      <div className="bg-gray-100 w-full pb-12 dark:bg-background/70">{children}</div>
    </div>
  );
};

export default FormContainer;
