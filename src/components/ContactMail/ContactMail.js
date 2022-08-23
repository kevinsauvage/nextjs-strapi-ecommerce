import { MdEmail } from 'react-icons/md';
import Wrapper from '../Wrapper/Wrapper';

export default function ContactMail() {
  const mail = 'kevinsauvage@outlook.com';
  return (
    <a href={`mailto:${mail}`} target="_blank" rel="noopener noreferrer">
      <Wrapper gap="6px">
        <MdEmail size="16px" />
        <p>{mail}</p>
      </Wrapper>
    </a>
  );
}
