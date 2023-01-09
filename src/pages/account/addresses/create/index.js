import nextApiCall from '@/utils/apiNext';
import AddressForm from '@/components/_scopes/account/AddressForm/AddressForm';
import { toast } from 'react-toastify';
import AccountLayout from '@/layout/AccountLayout/AccountLayout';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import PageLayout from '@/layout/PageLayout/PageLayout';

function Addresses() {
  const { toggleLoading } = useGlobalContext();

  const handleSubmit = async (address) => {
    try {
      if (
        !address?.address1 ||
        !address?.city ||
        !address?.country ||
        !address?.firstName ||
        !address?.lastName ||
        !address?.zip
      ) {
        return toast.error('Missing field');
      }
      toggleLoading(true);

      const { customerAddress, customerUserErrors } =
        await nextApiCall.createAddress({ address });

      if (customerAddress) {
        return toast.success('Address created successfully');
      }
      if (customerUserErrors.length) {
        return customerUserErrors.map((err) => toast.error(err.message));
      }
      return toast.error('Something went wrong');
    } catch (err) {
      return toast.error('Error creating address, please try again later');
    } finally {
      toggleLoading(false);
    }
  };

  return (
    <PageLayout title="Create new address">
      <AccountLayout title="Create address">
        <AddressForm buttonText="Create Address" onSubmit={handleSubmit} />
      </AccountLayout>
    </PageLayout>
  );
}

export default Addresses;
