import Container from '@/components/Container/Container';

import styles from './MainContent.module.scss';

const MainContent = ({
  children,
  className,
  ...properties
}: {
  children: React.ReactNode;
  className?: string;
} & React.HTMLProps<HTMLDivElement> & { [key: string]: unknown }) => {
  return (
    <div className={`${className} ${styles.main}`} {...properties}>
      <Container>{children}</Container>
    </div>
  );
};

export default MainContent;
