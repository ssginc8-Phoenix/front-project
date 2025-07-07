import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import useLoginStore from '~/features/user/stores/LoginStore';
import ChatBotComponent from '~/features/chatbot/components/ChatBotComponent';
import { useMyHospitalId } from '~/features/hospitals/hooks/useMyHospitalId';
import ReviewSummaryCard from '~/features/reviews/component/summary/ReviewSummaryCard';

const ads = ['new_banner.png', 'new_banner.png', 'new_banner.png'];

const notices = [
  { id: 1, title: '바른이비인후과 진료시간 변경 안내 (07.01부터)', date: '2025.06.23' },
  { id: 2, title: '병원 리뷰 작성 시 포인트 지급 이벤트', date: '2025.06.20' },
  { id: 3, title: '챗봇 기능 점검 예정 안내 (06.25)', date: '2025.06.18' },
  { id: 4, title: '의사 Q&A 응답 지연 안내', date: '2025.06.14' },
];

const news = [
  { id: 1, title: '닥투, 병원 추천 챗봇 기능 정식 오픈', date: '2025.06.22' },
  { id: 2, title: '실시간 예약 시스템 베타 테스트 시작', date: '2025.06.10' },
  { id: 3, title: '신규 병원 5곳 제휴 체결 완료', date: '2025.06.01' },
  { id: 4, title: '카카오 로그인 연동 기능 개선 완료', date: '2025.05.28' },
];

const MobileLine = styled.span`
  display: inline;

  @media (max-width: 480px) {
    display: block;
  }
`;

const features = [
  {
    title: '주변 병원',
    desc: (
      <>
        <MobileLine>근처 병원을 </MobileLine>
        <MobileLine>찾아보세요</MobileLine>
      </>
    ),
    icon: '/location.png',
    route: '/hospital/search',
  },
  {
    title: '예약 관리',
    desc: (
      <>
        <MobileLine>예약 현황을 </MobileLine>
        <MobileLine>관리하세요</MobileLine>
      </>
    ),
    icon: '/appointment.png',
    route: '/appointments',
  },
  {
    title: '캘린더',
    desc: (
      <>
        <MobileLine>일정을 한눈에 </MobileLine>
        <MobileLine>파악하세요</MobileLine>
      </>
    ),
    icon: '/calendar.png',
    route: '/calendar',
  },
  {
    title: '서류 등록',
    desc: (
      <>
        <MobileLine>서류를 손쉽게 </MobileLine>
        <MobileLine>등록하세요</MobileLine>
      </>
    ),
    icon: '/document.png',
    route: '/documents/admin',
  },
];

export default function HospitalMainPage() {
  const navigate = useNavigate();
  const { user, fetchMyInfo } = useLoginStore();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { hospitalId } = useMyHospitalId();

  useEffect(() => {
    if (!user) fetchMyInfo();
  }, [user, fetchMyInfo]);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
  };

  return (
    <>
      <AdCarousel>
        <Slider {...sliderSettings}>
          {ads.map((src) => (
            <div key={src}>
              <AdImage src={src} alt="광고 배너" />
            </div>
          ))}
        </Slider>
      </AdCarousel>

      <GuideSection>
        <Greeting>
          {user ? (
            <>
              <strong>{user.name}</strong> 님, 안녕하세요!
            </>
          ) : (
            <>
              <strong>게스트</strong>님, 안녕하세요!
            </>
          )}
        </Greeting>
        <p className="subtitle">편리한 의료 서비스 DOCTO에서 이용하세요.</p>

        <GuideGrid>
          {features.map(({ title, desc, icon, route }) => (
            <GuideCard key={title} onClick={() => navigate(route)}>
              <img src={icon} alt={title} />
              <h4>{title}</h4>
              <p>{desc}</p>
            </GuideCard>
          ))}
        </GuideGrid>
      </GuideSection>

      <AboutBlock className="mobile-only">
        <AboutText>
          <h5>
            <strong>AI REVIEW BRIEFING</strong>
          </h5>
          <h3>
            <strong>AI 리뷰 요약 기능으로</strong>
            <br />
            후기를 한눈에 파악하세요
          </h3>
          <p>
            사용자 리뷰를 분석하여
            <br />
            병원의 장점과 개선점을 간단히 요약해드립니다.
          </p>
        </AboutText>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {hospitalId && <ReviewSummaryCard hospitalId={hospitalId} />}
        </div>
      </AboutBlock>

      <InfoBoards>
        <Board>
          <BoardHeader>
            <span>Notice</span>
            <MoreBtn>＋</MoreBtn>
          </BoardHeader>
          <BoardBody>
            {notices.map(({ id, title, date }) => (
              <BoardItem key={id}>
                <span className="tit">{title}</span>
                <time>{date}</time>
              </BoardItem>
            ))}
          </BoardBody>
        </Board>

        <Board>
          <BoardHeader>
            <span>News</span>
            <MoreBtn>＋</MoreBtn>
          </BoardHeader>
          <BoardBody>
            {news.map(({ id, title, date }) => (
              <BoardItem key={id}>
                <span className="tit">{title}</span>
                <time>{date}</time>
              </BoardItem>
            ))}
          </BoardBody>
        </Board>

        <TelCard id="tel-section">
          <p className="caption">고객센터 전화상담</p>
          <p className="tel">1234-5678</p>
          <hr />
          <p className="time">
            평일 09:00-18:30
            <br />
            토요일 09:00-13:00 (점심시간X)
            <br />
            점심시간 12:00-13:00
          </p>
          <small>채팅상담도 가능합니다.</small>
        </TelCard>
      </InfoBoards>

      <AboutBlock className="pc-only">
        <AboutText>
          <h5>AI REVIEW BRIEFING</h5>
          <h3>
            <strong>AI 리뷰 요약 기능으로</strong>
            <br />
            후기를 한눈에 파악하세요
          </h3>
          <p>
            사용자 리뷰를 분석하여
            <br />
            병원의 장점과 개선점을 간단히 요약해드립니다.
          </p>
        </AboutText>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {hospitalId && <ReviewSummaryCard hospitalId={hospitalId} />}
        </div>
      </AboutBlock>

      {/* 병원 소개 블록 (PC 전용) */}
      <AboutBlock reverse className="pc-only">
        <AboutImage src="/images/about-2.jpg" />
        <AboutText>
          <h5>EASY HOSPITAL ADMINISTRATION</h5>
          <h3>
            <strong>병원관리를 손쉽고 빠르게</strong>
            <br /> 도와드립니다
          </h3>
          <p>
            실시간 예약 현황 관리와 서류 등록으로
            <br />
            병원을 더욱 쉽게 관리할 수 있습니다.
          </p>
        </AboutText>
      </AboutBlock>

      <ChatBtn onClick={() => setIsChatOpen(true)}>
        <img src="chatbot.png" alt="챗봇" />
      </ChatBtn>

      {isChatOpen && (
        <ChatModalOverlay onClick={() => setIsChatOpen(false)}>
          <ChatModal onClick={(e) => e.stopPropagation()}>
            <ChatBotComponent />
          </ChatModal>
        </ChatModalOverlay>
      )}
    </>
  );
}

// 광고 캐러셀
const AdCarousel = styled.section`
  position: relative;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  overflow: hidden;

  .slick-dots {
    bottom: 12px;
  }

  @media (max-width: 768px) {
    width: 100vw;
    max-width: 100%;
    margin: 0;
  }
`;

const AdImage = styled.img`
  width: 100%;
  height: 420px;
  object-fit: cover;
  display: block;

  @media (max-width: 768px) {
    height: 250px;
    width: 100vw;
  }
`;

// 가이드 섹션
const GuideSection = styled.section`
  text-align: center;
  padding: 80px 16px 60px;
  background: #f7f7f7;

  .subtitle {
    font-size: 0.95rem;
    line-height: 1.6;
    color: #666;
    max-width: 760px;
    margin: 0 auto 40px;
  }

  @media (max-width: 360px) {
    padding: 40px 12px 32px;
  }
`;

const Greeting = styled.h3`
  font-size: 1.9rem;
  margin-bottom: 10px;

  strong {
    font-weight: 800;
  }

  @media (max-width: 480px) {
    font-size: 1.4rem;
  }
`;

const GuideGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 20px;
  max-width: 1000px;
  margin: 0 auto;

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
`;

const GuideCard = styled.div`
  background: #fff;
  border-radius: 10px;
  padding: 16px 12px;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  transition: 0.2s;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

    img {
      animation: bounce 0.6s ease-in-out infinite;
    }
  }

  img {
    width: 53px;
    height: 53px;
    margin-top: 10px;
  }

  h4 {
    font-size: 1rem;
    margin-bottom: 2px;
  }

  p {
    font-size: 0.85rem;
    color: #777;
    text-align: center;
    line-height: 1.3;
  }

  @media (max-width: 480px) {
    padding: 12px 8px;

    img {
      width: 42px;
      height: 42px;
      margin-bottom: 6px;
    }

    h4 {
      font-size: 0.95rem;
      margin-bottom: 1px;
    }

    p {
      font-size: 0.78rem;
      line-height: 1.2;
    }
  }

  @keyframes bounce {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-6px);
    }
  }
`;

// 공지/뉴스/고객센터
const InfoBoards = styled.section`
  width: 100%;
  max-width: 1200px;
  margin: 60px auto;
  padding: 0 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    flex-direction: column;
    margin: 10px auto 10px;
    padding: 0 12px;
  }
`;

const Board = styled.div`
  flex: 1;
  background: #fff;
  border: 1px solid #e5e5e5;
  min-width: 0;
  overflow: hidden;
  box-sizing: border-box;

  &:last-of-type {
    border-right: 1px solid #e5e5e5;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const BoardHeader = styled.div`
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 700;
  font-size: 1rem;
  border-bottom: 1px solid #e5e5e5;
`;

const MoreBtn = styled.button`
  all: unset;
  cursor: pointer;
  font-size: 1.25rem;
  line-height: 1;
  color: #888;

  &:hover {
    color: #555;
  }
`;

const BoardBody = styled.ul`
  padding: 18px 20px;

  @media (max-width: 360px) {
    padding: 14px 16px;
  }
`;

const BoardItem = styled.li`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-size: 0.9rem;
  line-height: 1.45;

  &:not(:last-of-type) {
    margin-bottom: 12px;
  }

  .tit {
    max-width: 60%;
    font-weight: 500;
    color: #222;
  }

  time {
    font-size: 0.8rem;
    color: #999;
    flex-shrink: 0;
  }
`;

const TelCard = styled.div`
  width: 260px;
  background: #c2d7ff;
  color: #fff;
  border-radius: 6px 6px 0 0;
  padding: 32px 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1px;

  .caption {
    font-size: 0.9rem;
    opacity: 0.9;
  }

  .tel {
    font-size: 1.8rem;
    font-weight: 800;
  }

  hr {
    border: none;
    border-top: 1px solid rgba(255, 255, 255, 0.4);
  }

  .time {
    font-size: 0.85rem;
    line-height: 1.5;
  }

  small {
    font-size: 0.75rem;
    opacity: 0.8;
  }

  @media (max-width: 768px) {
    width: 100%;
    border-radius: 8px;
    padding: 24px 18px;
    margin-top: 8px;
    margin-bottom: 20px;
  }
`;

// 소개 영역
const AboutBlock = styled.section<{ reverse?: boolean }>`
  max-width: 1000px;
  margin: 60px auto;
  padding: 0 16px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1px;
  grid-template-areas: ${({ reverse }) => (reverse ? '"img txt"' : '"txt img"')};
  align-items: center;

  @media (max-width: 768px) {
    margin-top: 0.1px;
    grid-template-columns: 1fr;
    grid-template-areas: 'txt' 'img';
  }

  &.mobile-only {
    display: none;

    @media (max-width: 768px) {
      display: grid;
      margin-bottom: 10px;
    }
  }

  &.pc-only {
    @media (max-width: 768px) {
      display: none;
    }
  }
`;

const AboutText = styled.div`
  grid-area: txt;

  h5 {
    font-size: 0.9rem;
    color: #c2d7ff;
    letter-spacing: 2px;
    margin-bottom: 12px;
  }

  h3 {
    font-size: 1.8rem;
    margin-bottom: 16px;

    strong {
      font-weight: 800;
    }
  }

  p {
    font-size: 0.95rem;
    line-height: 1.6;
    color: #666;
    margin-bottom: 0.1px;
  }
`;

const AboutImage = styled.img`
  grid-area: img;
  width: 100%;
  border-radius: 12px;
  object-fit: cover;
`;

// 챗봇 버튼 & 모달
const ChatBtn = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  background-color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  img {
    width: 90%;
    height: auto;
    object-fit: contain;
  }

  &:hover {
    transform: scale(1.05);
    transition: transform 0.2s;
  }
`;

const ChatModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
`;

const ChatModal = styled.div`
  width: 100%;
  max-width: 480px;
  height: 90vh;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  z-index: 999;

  @media (max-width: 480px) {
    width: 90vw;
    height: 85vh;
  }
`;
