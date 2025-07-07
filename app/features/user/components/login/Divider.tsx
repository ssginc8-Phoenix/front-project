import styled from 'styled-components';

interface DividerProps {
  text?: string;
}

const DividerWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 400px; /* 필요 시 조절 가능 */
  margin: 60px 0;
`;

const Line = styled.div`
  flex: 1;
  height: 1px;
  background-color: #ccc;
`;

const Label = styled.span`
  margin: 0 12px;
  color: #333;
  font-size: 0.875rem;
  white-space: nowrap;
`;

const Divider = ({ text = '간편로그인' }: DividerProps) => {
  return (
    <DividerWrapper>
      <Line />
      <Label>{text}</Label>
      <Line />
    </DividerWrapper>
  );
};

export default Divider;
