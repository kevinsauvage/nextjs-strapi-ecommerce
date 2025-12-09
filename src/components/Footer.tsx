import Link from 'next/link';

import siteMetadata from '@/data/siteMetadata';
import { storefrontSdk } from '@/shopify';

const Footer = async () => {
  const response = await storefrontSdk().getMenuByHandle({ handle: 'footer' });
  const menuFooter = response?.menu?.items;

  return (
    <footer className="flex flex-col py-10 gap-10 border-t">
      <div className="container mx-auto flex flex-col justify-between md:grid grid-cols-2 gap-8 px-4">
        <div className="flex flex-col max-w-80 mb-8">
          <b className="text-lg font-bold pb-3">About</b>
          <p className="max-w-xl font-light text-sm">{siteMetadata?.about?.short}</p>
        </div>
        <ul className="flex flex-wrap justify-between gap-8 mb-8 md:grid md:grid-cols-3 ">
          {Array.isArray(menuFooter) &&
            menuFooter.map((item) => (
              <li key={item.id}>
                <b className="text-md block font-semibold pb-3">{item.title}</b>
                <ul>
                  {item?.items?.map((element) => (
                    <li className="font-light mb-1" key={element.id}>
                      {typeof element?.url === 'string' && (
                        <Link href={new URL(element?.url)?.pathname} className="font-light text-sm">
                          {element?.title}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
        </ul>
      </div>
      <div className="text-center">
        <p>Copyright © 2025 All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
