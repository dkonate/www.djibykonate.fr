import { describe, it, expect } from 'vitest';
import { readingTime } from '../src/utils/readingTime';

describe('readingTime', () => {
  it('retourne 1 pour un texte court (< 200 mots)', () => {
    const text = 'mot '.repeat(100);
    expect(readingTime(text)).toBe(1);
  });

  it('retourne 2 pour un texte de 350 mots', () => {
    const text = 'mot '.repeat(350);
    expect(readingTime(text)).toBe(2);
  });

  it('retourne 1 pour un texte vide', () => {
    expect(readingTime('')).toBe(1);
  });

  it('ignore les espaces multiples', () => {
    const text = 'mot  '.repeat(100);
    expect(readingTime(text)).toBe(1);
  });
});
