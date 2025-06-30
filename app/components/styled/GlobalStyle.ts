// src/styles/GlobalStyle.ts
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  *, *::before, *::after {
    box-sizing: inherit;
  }
`;

export const media = {
  laptopL: `@media (max-width: 1600px)`,
  laptop: `@media (max-width: 1024px)`,
  tablet: `@media (max-width: 768px)`,
  mobile: `@media (max-width: 480px)`,
  mobileSmall: `@media (max-width: 360px)`,
};

export default GlobalStyle;
