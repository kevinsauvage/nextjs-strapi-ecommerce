import type { Messages } from './types';

/**
 * Shopify has no translation surface for product option *names* — they belong
 * to the product itself, not to a translatable resource like a menu item or a
 * metaobject. So the storefront maps the handful of names this catalogue
 * actually uses onto `product` catalog keys, and renders the merchant's own
 * name for everything else (`"Harness length"`, `"Bowl capacity"`, …).
 *
 * Option *values* (`S`, `M`, `L`, colour swatches) are likewise merchant data
 * and are left untouched.
 */
const OPTION_NAME_KEYS: Record<string, keyof Messages['product']> = {
  color: 'optionColor',
  colour: 'optionColor',
  flavor: 'optionFlavour',
  flavour: 'optionFlavour',
  length: 'optionLength',
  material: 'optionMaterial',
  size: 'optionSize',
  style: 'optionStyle',
};

/**
 * Catalog key for a known option name, or `null` when the name is
 * merchant-specific and should be rendered as-is.
 *
 * Matching is case- and whitespace-insensitive because Shopify stores the name
 * exactly as the merchant typed it (`size`, `Size`, `SIZE`).
 */
export const optionNameKey = (name: string): keyof Messages['product'] | null =>
  OPTION_NAME_KEYS[name.trim().toLowerCase()] ?? null;
