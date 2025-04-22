import CollectionNav from '@/app/[genre]/_components/CollectionNav/CollectionNav';
import { storefrontSdk } from '@/shopify';

type LayoutProperties = {
  children: React.ReactNode;
  params: Promise<{
    genre: string;
  }>;
};

const Layout = async ({ children, params }: LayoutProperties) => {
  const { genre } = await params;

  const response = await storefrontSdk().getMenuByHandle({
    handle: `collections-${genre}`,
  });

  return (
    <>
      <CollectionNav items={response?.menu?.items} />
      {children}
    </>
  );
};

export default Layout;
