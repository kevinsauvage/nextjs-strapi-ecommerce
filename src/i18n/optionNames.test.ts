import { optionNameKey } from './optionNames';

import { describe, expect, it } from 'vitest';

describe('optionNameKey', () => {
  it('maps the option names a pet catalogue uses onto catalog keys', () => {
    expect(optionNameKey('Size')).toBe('optionSize');
    expect(optionNameKey('Colour')).toBe('optionColor');
    expect(optionNameKey('Color')).toBe('optionColor');
    expect(optionNameKey('Flavour')).toBe('optionFlavour');
    expect(optionNameKey('Material')).toBe('optionMaterial');
  });

  it('ignores case and surrounding whitespace', () => {
    expect(optionNameKey('  size  ')).toBe('optionSize');
    expect(optionNameKey('SIZE')).toBe('optionSize');
  });

  it('returns null for merchant-specific names so they render verbatim', () => {
    expect(optionNameKey('Harness length')).toBeNull();
    expect(optionNameKey('')).toBeNull();
  });
});
