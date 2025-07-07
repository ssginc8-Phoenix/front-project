import { useState } from 'react';
import styled from 'styled-components';
import { useChatbot } from '../../hooks/useChatbot';

const ChatInput = () => {
  const [input, setInput] = useState('');
  const { sendMessage } = useChatbot();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '') return;
    sendMessage(input.trim());
    setInput('');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="입력해주세요" />
      <SendButton type="submit">➤</SendButton>
    </Form>
  );
};

export default ChatInput;

const Form = styled.form`
  display: flex;
  align-items: center;
  padding: 12px;
  gap: 10px;
`;

const Input = styled.textarea`
  flex: 1;
  resize: none; // ✅ 크기 조절 비활성화
  overflow-y: auto; // 또는 hidden으로도 가능
  scrollbar-width: none; // ✅ Firefox에서 스크롤 숨기기
  -ms-overflow-style: none; // ✅ IE/Edge

  &::-webkit-scrollbar {
    // ✅ Chrome/Safari에서 스크롤 숨기기
    display: none;
  }

  border: 1px solid #ddd;
  border-radius: 20px;
  padding: 10px 14px;
  font-size: 14px;
  line-height: 1.4;
  outline: none;
  height: 40px;
  max-height: 100px;
`;

const SendButton = styled.button`
  background-color: #007aff;
  color: white;
  border: none;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  font-size: 18px;
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0062d1;
  }
`;
