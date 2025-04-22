import UserFullName from './_components/UserFullName/UserFullName';

const Page = () => {
  return (
    <div>
      <h2>Hello!</h2>
      <p>
        Welcome <UserFullName />, your account dashboard provides access to all of your important
        account information and features, allowing you to manage your profile and view orders. You
        can update personal information and view order history, all in one convenient place.
      </p>
    </div>
  );
};

export default Page;
