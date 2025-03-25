import { useFormStatus } from 'react-dom';

import Button from '@/components/Button/Button';

const SubmitButton = ({ pendingText = 'Submitting...', submitText = 'Submit', ...properties }) => {
  const status = useFormStatus();
  return (
    <Button type="submit" {...properties}>
      {status.pending ? pendingText : submitText}
    </Button>
  );
};

export default SubmitButton;
