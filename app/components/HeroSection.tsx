import styled, { keyframes } from 'styled-components';

export default function HeroSection() {
  return (
    <HeroWrapper>
      {/* 문구 */}
      <Texts>
        <h1>
          DOCTO로 접수하면
          <br />
          원하는 곳에서
          <br />
          예약할 수 있습니다!
        </h1>
        <p>
          닥투와 함께 부모님의 건강을
          <br />더 편하게 관리해보세요
        </p>
      </Texts>

      {/* 스마트폰 캡처 화면 */}
      <PhoneMockup>
        <img src="phone_mockup.png" alt="앱 화면 예시" />
      </PhoneMockup>

      {/* 둥근 일러스트 2개*/}
      <CircleLeft src="/images/hero-illust-1.png" />
      <CircleRight src="/images/hero-illust-2.png" />
    </HeroWrapper>
  );
}

const float = keyframes`
  0%,100% { transform: translateY(0); }
  50%     { transform: translateY(-4px); }
`;

const HeroWrapper = styled.section`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 80px;
  padding: 100px 24px 120px;
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 40px;
    padding: 64px 16px 80px;
  }
`;

const Texts = styled.div`
  text-align: center;
  z-index: 2;

  h1 {
    font-size: clamp(1.8rem, 5vw, 2.6rem);
    font-weight: 700;
    line-height: 1.3;
    color: #111827;
    margin-bottom: 24px;
    white-space: pre-line;
  }

  p {
    font-size: 1.05rem;
    color: #6b7280;
    line-height: 1.5;
  }
`;

const PhoneMockup = styled.div`
  width: 280px;
  flex-shrink: 0;
  z-index: 2;

  img {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 28px;
    box-shadow:
      0 16px 24px rgba(0, 0, 0, 0.1),
      0 6px 8px rgba(0, 0, 0, 0.06);
  }

  @media (max-width: 768px) {
    width: 220px;
  }
`;

const CircleBase = styled.img`
  position: absolute;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  animation: ${float} 4s ease-in-out infinite;

  @media (max-width: 768px) {
    width: 90px;
    height: 90px;
  }
`;
const CircleLeft = styled(CircleBase)`
  left: 40px;
  bottom: 80px;
`;
const CircleRight = styled(CircleBase)`
  right: 40px;
  top: 60px;
`;

const Dot = styled.span`
  position: absolute;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #f8d34c;
  left: 50%;
  bottom: 160px;
  transform: translateX(-50%);
  z-index: 1;

  @media (max-width: 768px) {
    bottom: 120px;
  }
`;
