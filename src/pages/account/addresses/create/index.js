import Page from '@/layout/Page/Page';
import nextApiCall from '@/utils/apiNext';
import AddressForm from '@/components/scopes/account/AddressForm/AddressForm';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import config from '@/config/index';
import AccountLayout from '@/layout/AccountLayout/AccountLayout';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import styles from './create.module.scss';

function Addresses() {
  const { back } = useRouter();
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
        toast.success('Address created successfully');
        return back();
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
    <Page
      title="Create new address"
      backTo={{ name: 'Back to addresses', href: config.routes.addresses }}
      bannerTitle="Create the new address bellow"
      bannerDescription="To create a new address in our system, please fill in the following fields. These details will be used to accurately deliver your orders and keep track of your delivery locations. Thank you for your help in maintaining a complete and up-to-date customer address list!"
    >
      <AccountLayout>
        <div className={styles.addresses}>
          <AddressForm buttonText="Create Address" onSubmit={handleSubmit} />
        </div>
      </AccountLayout>
    </Page>
  );
}

export default Addresses;
