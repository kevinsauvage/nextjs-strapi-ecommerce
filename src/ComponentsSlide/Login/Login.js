import { useContext, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { GlobalStoreContext } from '../../contexts/GlobalContext/GlobalContext';
import Button from '../../components/Button/Button';
import Slide from '../../components/Slide/Slide';
import useForm from '../../hooks/useForm';
import Input from '../../components/Input/Input';
import FlexColumn from '../../components/FlexColumn/FlexColumn';
import routes from '../../data/routes';
import { UserContext } from '../../contexts/UserContext/UserContext';

export default function Login() {
  const { loginOpen, resetToggle } = useContext(GlobalStoreContext);
  const { login } = useContext(UserContext);
  const [errorMessage, setErrorMessage] = useState('');

  const router = useRouter();

  const onSubmit = async (formData) => {
    if (!formData.email || !formData.password) return;

    const userData = {
      email: formData.email,
      password: formData.password,
    };

    const response = await login(userData);
    const { error } = await response;

    if (error) {
      setErrorMessage(error.message);
      return;
    }
    router.push('/profile');
  };

  const { handleInputChange, handleSubmit } = useForm(onSubmit);

  return (
    <Slide isOpen={loginOpen} handleClose={resetToggle} title="Login">
      <Image src="/login.svg" layout="responsive" width="200px" height="100%" />
      <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
        <Input
          id="email"
          label="Email address"
          name="email"
          placeholder="Email"
          onChange={handleInputChange}
        />
        <Input
          placeholder="Password"
          name="password"
          id="password"
          label="Password"
          onChange={handleInputChange}
        />
        <FlexColumn gap="8px" style={{ marginTop: '2rem' }}>
          <p>{errorMessage}</p>
          <Button text="Login" type="submit" secondary />
          <Button text="Forgot your password?" primary />
          <Button
            text="Register"
            tertiary
            onClick={() => router.push(routes.base.register)}
          />
        </FlexColumn>
      </form>
      <div />
    </Slide>
  );
}
