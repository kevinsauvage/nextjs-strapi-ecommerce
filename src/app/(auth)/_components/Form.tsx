type FormProperties = {
  children: React.ReactNode;
  action: (formData: FormData) => void | Promise<void>;
} & React.HTMLProps<HTMLFormElement>;

const Form = ({ children, action, ...rest }: FormProperties) => {
  return (
    <form action={action} className="space-y-6 py-12 max-w-md mx-auto w-full px-4" {...rest}>
      {children}
    </form>
  );
};

export default Form;
