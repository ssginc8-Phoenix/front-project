import styled from 'styled-components';
import { media } from '~/components/styled/GlobalStyle';

const Textarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  resize: vertical;

  font-family: 'Noto Sans KR', sans-serif;

  ${media.mobile} {
    padding: 0.7rem;
    font-size: 0.9rem;
  }
`;

export default Textarea;
