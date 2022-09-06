import { ImPhone } from 'react-icons/im';
import Wrapper from '@/components/Wrapper/Wrapper';

export default function PhoneNumber() {
  return (
    <a href="tel:0034644674641">
      <Wrapper gap="6px">
        <ImPhone size="16px" />
        <p> + 34644674641</p>
      </Wrapper>
    </a>
  );
}
