export function Custom404() {
  return <div />;
}

export const getStaticProps = () => ({
  redirect: { destination: '/', permanent: false },
});

export default Custom404;
