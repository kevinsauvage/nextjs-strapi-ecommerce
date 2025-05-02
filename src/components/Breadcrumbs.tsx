'use client';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Crumbs = ({ title, href, last }: { title: string; href: string; last: boolean }) => {
  if (last) {
    const t = decodeURIComponent(title)
      .replace('gid://shopify/Order/', '')
      .replace('gid://shopify/MailingAddress/', '')
      .split('?')[0];
    return (
      <strong className={`text-sm text-muted-foreground text-ellipsis whitespace-nowrap font-bold`}>
        {t}
      </strong>
    );
  }

  return (
    <>
      <Link
        href={href}
        className="text-sm text-muted-foreground font-medium text-ellipsis whitespace-nowrap"
      >
        {decodeURIComponent(title)}
      </Link>
      {!last && <ChevronRight size={16} className="text-muted-foreground " />}
    </>
  );
};

const Breadcrumbs = ({ lastElement }: { lastElement?: string }) => {
  const pathname = usePathname();

  const filterCrumb = new Set(['pages', 'reset', 'collections', 'products']);

  function generateBreadcrumbs() {
    const asPathNestedRoutes = pathname.split('/').filter((v) => v.length > 0);

    const crumbList = asPathNestedRoutes
      .map((subpath, index) => {
        const href = `/${asPathNestedRoutes.slice(0, index + 1).join('/')}`;
        const title = subpath.split('-').join(' ').replaceAll('_', ' ');
        return {
          href,
          isNotClickable: filterCrumb.has(title.toLowerCase()),
          title,
        };
      })
      .filter((crumb) => !filterCrumb.has(crumb.title.toLowerCase()));

    return [{ href: '/', title: 'Home' }, ...crumbList];
  }

  // Call the function to generate the breadcrumbs list
  const breadcrumbs = generateBreadcrumbs();

  return (
    breadcrumbs.length > 1 && (
      <div>
        <nav className="hidden md:block container mx-auto">
          <ol className="flex items-center space-x-1">
            {breadcrumbs.map((crumb, index) => (
              <li key={crumb.href} className="flex items-center space-x-1 overflow-ellipsis">
                {lastElement && index === breadcrumbs.length - 1 ? (
                  <p className="font-medium text-sm text-ellipsis  whitespace-nowrap">
                    {lastElement}
                  </p>
                ) : (
                  <Crumbs {...crumb} last={index === breadcrumbs.length - 1} />
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>
    )
  );
};
export default Breadcrumbs;
