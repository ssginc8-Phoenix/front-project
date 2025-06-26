// src/styles/breakpoints.ts
import { css } from 'styled-components';

export const breakpoints = {
  laptopL: 1600,
  laptop: 1024,
  tablet: 768,
  mobile: 480,
} as const;

type BP = keyof typeof breakpoints;

export const media =
  (bp: BP) =>
  (strings: TemplateStringsArray, ...interpolations: any[]) => css`
    @media (max-width: ${breakpoints[bp]}px) {
      ${css(strings, ...interpolations)}
    }
  `;
