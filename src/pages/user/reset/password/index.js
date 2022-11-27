import Button from '@/components/Button/Button';
import Form from '@/components/forms/Form/Form';
import Input from '@/components/forms/Input/Input';
import Page from '@/layout/Page/Page';
import useForm from '@/hooks/useForm';
import useUserContext from '@/contexts/UserContext/useUserContext';
import config from '@/config/index';

function Password({ resetUrl }) {
  const { resetPassword } = useUserContext();

  const { handleInputChange, handleSubmit } = useForm(async (formData) => {
    const { password } = formData;
    resetPassword(password.trim(), resetUrl);
  });

  return (
    <Page title="Password recovery">
      <div>
        <Form
          title="ENTER YOUR NEW PASSWORD"
          subtitle="Fill the form below to update your password"
          onSubmit={handleSubmit}
        >
          <Input
            id="password"
            label="New password"
            name="password"
            type="password"
            placeholder="New password"
            onChange={handleInputChange}
          />
          <Button width="100%" type="submit" text="RESET PASSWORD" tertiary />
        </Form>
      </div>
    </Page>
  );
}

export default Password;

export async function getServerSideProps({ query }) {
  if (!query.reset_url) {
    return {
      redirect: {
        destination: config.routes.login,
        permanent: false,
      },
    };
  }

  return {
    props: {
      resetUrl: query.reset_url,
    },
  };
}
