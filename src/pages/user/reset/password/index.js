import Button from '@/components/Button/Button';
import Form from '@/components/Form/Form';
import Input from '@/components/Input/Input';
import Page from '@/layout/Page/Page';
import useForm from '@/hooks/useForm';
import routes from '@/data/routes';
import useUserContext from '@/contexts/UserContext/useUserContext';

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

export async function getServerSideProps({ query, res }) {
  if (!query.reset_url) {
    res.setHeader('location', routes.login);
    res.statusCode = 302;
    res.end();
    return null;
  }

  return {
    props: {
      resetUrl: query.reset_url,
    },
  };
}
