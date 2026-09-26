import { getUserFeedback, type UserFeedback, userFeedback } from './userFeedback';

import { describe, expect, it } from 'vitest';

/** Recursively collects the dotted key paths of a feedback catalog. */
const keyPaths = (value: unknown, prefix = ''): string[] => {
  if (typeof value !== 'object' || value === null) return [prefix];

  return Object.entries(value).flatMap(([key, entry]) =>
    keyPaths(entry, prefix ? `${prefix}.${key}` : key),
  );
};

describe('user feedback catalogs', () => {
  it('es and fr mirror every key of the English catalog', () => {
    const keys = keyPaths(userFeedback);

    for (const locale of ['es', 'fr'] as const) {
      const translated = keyPaths(getUserFeedback(locale));
      const missing = keys.filter((key) => !translated.includes(key));

      expect(missing).toEqual([]);
    }
  });

  it('never ships a blank translation', () => {
    for (const locale of ['es', 'fr'] as const) {
      for (const key of keyPaths(getUserFeedback(locale))) {
        const value = key
          .split('.')
          .reduce<unknown>(
            (node, part) => (node as Record<string, unknown>)?.[part],
            getUserFeedback(locale),
          );

        expect(String(value).trim()).not.toBe('');
      }
    }
  });

  it('falls back to English for an unknown locale', () => {
    expect(getUserFeedback('de' as never)).toBe(userFeedback);
  });

  it('keeps the UserFeedback type in sync with the English catalog', () => {
    const feedback: UserFeedback = userFeedback;

    expect(feedback.login.success).toBe('Signed in successfully');
  });
});
