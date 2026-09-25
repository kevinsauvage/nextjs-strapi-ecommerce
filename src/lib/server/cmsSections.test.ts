import { beforeEach, describe, expect, it, vi } from 'vitest';

const { getShopMetaobjectByHandle, getShopMetaObjects } = vi.hoisted(() => ({
  getShopMetaObjects: vi.fn(),
  getShopMetaobjectByHandle: vi.fn(),
}));

vi.mock('@/shopify', () => ({
  storefrontSdk: () => ({ getShopMetaObjects, getShopMetaobjectByHandle }),
}));
vi.mock('@/lib/logger', () => ({ reportError: vi.fn() }));

import {
  CMS_HANDLES,
  CMS_TYPES,
  getFaqSection,
  getHeroSection,
  getPromoBar,
  getSizeChart,
  MAX_FAQ_ITEMS,
} from './cmsSections';

const metaobject = (...fields: Array<{ key: string; value: string | null }>) => ({
  metaobject: { fields },
});

const listItem = (fields: Array<{ key: string; value: string | null }>) => ({ node: { fields } });

describe('cmsSections', () => {
  beforeEach(() => {
    getShopMetaobjectByHandle.mockReset();
    getShopMetaObjects.mockReset();
  });

  describe('getHeroSection', () => {
    it('parses a curated hero and reads it by handle', async () => {
      getShopMetaobjectByHandle.mockResolvedValue(
        metaobject(
          { key: 'eyebrow', value: '  New Season  ' },
          { key: 'heading', value: 'Wear the story' },
          { key: 'subheading', value: 'Small-batch quality' },
          { key: 'image', value: 'https://cdn.shopify.com/hero.jpg' },
          { key: 'primary_label', value: 'Shop' },
          { key: 'primary_url', value: '/collections' },
        ),
      );

      await expect(getHeroSection()).resolves.toEqual({
        eyebrow: 'New Season',
        heading: 'Wear the story',
        image: 'https://cdn.shopify.com/hero.jpg',
        imageAlt: null,
        primaryLabel: 'Shop',
        primaryUrl: '/collections',
        secondaryLabel: null,
        secondaryUrl: null,
        subheading: 'Small-batch quality',
      });

      expect(getShopMetaobjectByHandle).toHaveBeenCalledWith({
        handle: { handle: CMS_HANDLES.hero, type: CMS_TYPES.hero },
      });
    });

    it('returns null when no heading is curated', async () => {
      getShopMetaobjectByHandle.mockResolvedValue(metaobject({ key: 'image', value: 'x' }));

      await expect(getHeroSection()).resolves.toBeNull();
    });

    it('returns null when the read fails', async () => {
      getShopMetaobjectByHandle.mockRejectedValue(new Error('network down'));

      await expect(getHeroSection()).resolves.toBeNull();
    });

    it('returns null when the metaobject does not exist', async () => {
      getShopMetaobjectByHandle.mockResolvedValue({ metaobject: null });

      await expect(getHeroSection()).resolves.toBeNull();
    });
  });

  describe('getPromoBar', () => {
    it('defaults the tone to ink and active to true', async () => {
      getShopMetaobjectByHandle.mockResolvedValue(
        metaobject({ key: 'text', value: 'Free shipping over $150' }),
      );

      await expect(getPromoBar()).resolves.toEqual({
        active: true,
        linkLabel: null,
        linkUrl: null,
        text: 'Free shipping over $150',
        tone: 'ink',
      });
    });

    it('reads an explicit tone, link and disabled flag', async () => {
      getShopMetaobjectByHandle.mockResolvedValue(
        metaobject(
          { key: 'text', value: 'Sale' },
          { key: 'tone', value: 'GOLD' },
          { key: 'link_label', value: 'Shop sale' },
          { key: 'link_url', value: '/collections/sale' },
          { key: 'active', value: 'false' },
        ),
      );

      await expect(getPromoBar()).resolves.toEqual({
        active: false,
        linkLabel: 'Shop sale',
        linkUrl: '/collections/sale',
        text: 'Sale',
        tone: 'gold',
      });
    });

    it('falls back to ink for an unknown tone and returns null without text', async () => {
      getShopMetaobjectByHandle.mockResolvedValue(
        metaobject({ key: 'text', value: 'Hi' }, { key: 'tone', value: 'neon' }),
      );
      await expect(getPromoBar()).resolves.toMatchObject({ tone: 'ink' });

      getShopMetaobjectByHandle.mockResolvedValue(metaobject({ key: 'link_url', value: '/sale' }));
      await expect(getPromoBar()).resolves.toBeNull();
    });
  });

  describe('getSizeChart', () => {
    it('returns the sanitizable body and defaults the title', async () => {
      getShopMetaobjectByHandle.mockResolvedValue(
        metaobject({ key: 'body', value: '<table><tr><td>S</td></tr></table>' }),
      );

      await expect(getSizeChart()).resolves.toEqual({
        body: '<table><tr><td>S</td></tr></table>',
        note: null,
        title: 'Size chart',
      });
    });

    it('returns null when the body is empty', async () => {
      getShopMetaobjectByHandle.mockResolvedValue(metaobject({ key: 'title', value: 'Sizes' }));

      await expect(getSizeChart()).resolves.toBeNull();
    });
  });

  describe('getFaqSection', () => {
    it('merges section copy with sorted items', async () => {
      getShopMetaobjectByHandle.mockResolvedValue(
        metaobject({ key: 'title', value: 'FAQ' }, { key: 'intro', value: 'Answers' }),
      );
      getShopMetaObjects.mockResolvedValue({
        metaobjects: {
          edges: [
            listItem([
              { key: 'question', value: 'Second?' },
              { key: 'answer', value: 'B' },
              { key: 'position', value: '2' },
            ]),
            listItem([
              { key: 'question', value: 'First?' },
              { key: 'answer', value: 'A' },
              { key: 'position', value: '1' },
            ]),
          ],
        },
      });

      await expect(getFaqSection()).resolves.toEqual({
        intro: 'Answers',
        items: [
          { answer: 'A', position: 1, question: 'First?' },
          { answer: 'B', position: 2, question: 'Second?' },
        ],
        title: 'FAQ',
      });

      expect(getShopMetaObjects).toHaveBeenCalledWith({
        first: MAX_FAQ_ITEMS,
        type: CMS_TYPES.faqItem,
      });
    });

    it('keeps API order when positions are missing and drops blank items', async () => {
      getShopMetaobjectByHandle.mockResolvedValue({ metaobject: null });
      getShopMetaObjects.mockResolvedValue({
        metaobjects: {
          edges: [
            listItem([{ key: 'question', value: 'One?' }]),
            listItem([{ key: 'answer', value: 'orphan answer' }]),
            listItem([
              { key: 'question', value: 'Two?' },
              { key: 'answer', value: 'B' },
            ]),
          ],
        },
      });

      await expect(getFaqSection()).resolves.toEqual({
        intro: null,
        items: [
          { answer: null, position: 0, question: 'One?' },
          { answer: 'B', position: 1, question: 'Two?' },
        ],
        title: 'Frequently asked questions',
      });
    });

    it('returns null when neither copy nor items exist', async () => {
      getShopMetaobjectByHandle.mockResolvedValue({ metaobject: null });
      getShopMetaObjects.mockResolvedValue({ metaobjects: { edges: [] } });

      await expect(getFaqSection()).resolves.toBeNull();
    });

    it('still returns the section copy when the item read fails', async () => {
      getShopMetaobjectByHandle.mockResolvedValue(metaobject({ key: 'title', value: 'FAQ' }));
      getShopMetaObjects.mockRejectedValue(new Error('network down'));

      await expect(getFaqSection()).resolves.toEqual({
        intro: null,
        items: [],
        title: 'FAQ',
      });
    });
  });
});
