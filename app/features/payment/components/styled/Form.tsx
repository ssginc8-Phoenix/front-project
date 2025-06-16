import styled from 'styled-components';
import { Card as BaseCard } from '~/components/styled/Card';

export const Card = styled(BaseCard)`
  padding: 16px;
  margin-bottom: 16px;
`;

export const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const LabelText = styled.div`
  font-size: 14px;
  color: #34495e;
  margin-bottom: 4px;
`;

export const ValueText = styled.div`
  font-size: 16px;
  color: #2c3e50;
`;

export const StyledInput = styled.input`
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
  &:focus {
    border-color: #3498db;
    outline: none;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

export const StyledTextarea = styled.textarea`
  width: 100%;
  height: 80px;
  padding: 12px;
  font-size: 15px;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
  resize: vertical;
  &:focus {
    border-color: #3498db;
    outline: none;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

export const CounterText = styled.div`
  text-align: right;
  font-size: 12px;
  color: #7f8c8d;
  margin-top: 4px;
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`;

export const PrimaryButton = styled.button`
  padding: 12px 20px;
  background: #3498db;
  color: white;
  font-size: 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const SecondaryButton = styled.button`
  padding: 12px 20px;
  background: #ecf0f1;
  color: #2c3e50;
  font-size: 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;
