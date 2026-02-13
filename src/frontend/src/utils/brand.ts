import { Brand } from '../backend';

export const COMMON_BRANDS = [
  { value: 'lg', label: 'LG' },
  { value: 'samsung', label: 'Samsung' },
  { value: 'daikin', label: 'Daikin' },
  { value: 'whirlpool', label: 'Whirlpool' },
  { value: 'voltas', label: 'Voltas' },
  { value: 'other', label: 'Other' },
];

export function brandToString(brand: Brand): string {
  if ('lg' in brand) return 'LG';
  if ('samsung' in brand) return 'Samsung';
  if ('daikin' in brand) return 'Daikin';
  if ('whirlpool' in brand) return 'Whirlpool';
  if ('voltas' in brand) return 'Voltas';
  if ('other' in brand) return brand.other;
  return 'Unknown';
}

export function stringToBrand(value: string, otherText?: string): Brand {
  switch (value) {
    case 'lg':
      return { __kind__: 'lg', lg: null };
    case 'samsung':
      return { __kind__: 'samsung', samsung: null };
    case 'daikin':
      return { __kind__: 'daikin', daikin: null };
    case 'whirlpool':
      return { __kind__: 'whirlpool', whirlpool: null };
    case 'voltas':
      return { __kind__: 'voltas', voltas: null };
    case 'other':
      return { __kind__: 'other', other: otherText || 'Other' };
    default:
      return { __kind__: 'other', other: value };
  }
}
