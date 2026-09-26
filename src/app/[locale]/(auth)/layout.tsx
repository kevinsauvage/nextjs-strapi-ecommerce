import type { ReactNode } from 'react';

/**
 * Auth pages are customer-specific: they read the Shopify session and
 * request-time query parameters (activation and reset tokens), so they cannot be
 * prerendered. Blocking is the correct trade — the catalog pages that carry the
 * traffic stay static.
 */
export const instant = false;

const AuthLayout = ({ children }: { children: ReactNode }) => <>{children}</>;

export default AuthLayout;
