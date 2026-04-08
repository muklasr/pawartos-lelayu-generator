import { describe, it, expect } from 'vitest';
import { strings } from './i18n';

describe('i18n strings', () => {
  it('has identical keys for both Javanese and Indonesian dictionaries', () => {
    const jwKeys = Object.keys(strings.jw).sort();
    const idKeys = Object.keys(strings.id).sort();
    
    expect(jwKeys).toEqual(idKeys);
  });

  it('contains essential keys', () => {
    const keys = Object.keys(strings.jw);
    expect(keys).toContain('title');
    expect(keys).toContain('katur');
    expect(keys).toContain('opening');
    expect(keys).toContain('closing');
  });
});
