import type { en } from './messages/en';

/**
 * Message shape, derived from the English catalog so every other locale is
 * type-checked against the same keys.
 */
export type Messages = typeof en;
