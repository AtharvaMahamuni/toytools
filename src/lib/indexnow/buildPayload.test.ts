import { describe, it, expect } from 'vitest';
import { buildPayload } from './buildPayload';
import { INDEXNOW_HOST, INDEXNOW_KEY, INDEXNOW_KEY_LOCATION } from '@config/indexnow';

describe('buildPayload', () => {
  it('shapes the payload with host, key, keyLocation, and urlList', () => {
    const urls = ['https://toytoolsapp.com/', 'https://toytoolsapp.com/tool/text/word-counter/'];
    expect(buildPayload(urls)).toEqual({
      host: INDEXNOW_HOST,
      key: INDEXNOW_KEY,
      keyLocation: INDEXNOW_KEY_LOCATION,
      urlList: urls,
    });
  });

  it('keyLocation points at the published key file at the host root', () => {
    const { keyLocation, key } = buildPayload(['https://toytoolsapp.com/']);
    expect(keyLocation).toBe(`https://${INDEXNOW_HOST}/${key}.txt`);
  });

  it('throws when the URL list is empty', () => {
    expect(() => buildPayload([])).toThrow(/empty/i);
  });
});
