import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import useLoginStore from '~/features/user/stores/LoginStore';
import ChatBotComponent from '~/features/chatbot/components/ChatBotComponent';
import { useMyHospitalId } from '~/features/hospitals/hooks/useMyHospitalId';
import ReviewSummaryCard from '~/features/reviews/component/common/ReviewSummaryCard';

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

const features = [
  {
    title: '주변 병원',
    desc: '근처 병원을 살펴보세요',
    icon: '/location.png',
    route: '/hospitals/search',
  },
  {
    title: '예약 관리',
    desc: '예약·대기 현황을 관리하세요',
    icon: '/appointment.png',
    route: '/appointments/list',
  },
  {
    title: '캘린더',
    desc: '일정을 한눈에 확인하세요',
    icon: '/calendar.png',
    route: '/calendar',
  },
  {
    title: '서류 등록',
    desc: '서류를 간편하게 등록하세요',
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
        <p className="subtitle">편리한 의료 서비스를 한곳에서 이용하세요.</p>

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

      <AboutBlock id="about-section">
        <AboutText>
          <h5>AI REVIEW BRIEFING</h5>
          <h3>
            <strong>AI 리뷰 요약 기능으로</strong>
            <br /> 후기를 한눈에 파악하세요
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

      <AboutBlock reverse>
        <AboutImage src="/images/about-2.jpg" alt="원스톱 헬스케어 관리" />
        <AboutText>
          <h5>EASY HOSPITAL ADMINISTRATION</h5>
          <h3>
            <strong>병원관리를 손쉽고 빠르게</strong>
            <br /> 도와드립니다
          </h3>
          <p>
            실시간 예약 현황 관리와 서류 등록으로
            <br />
            병원을 더욱 쉽게 관리할수있습니다.
          </p>
        </AboutText>
      </AboutBlock>

      <ChatBtn onClick={() => setIsChatOpen(true)}>🤖</ChatBtn>
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

const AdCarousel = styled.section`
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  width: 100vw;
  max-width: 100%;
  overflow: hidden;
`;

const AdImage = styled.img`
  width: 100%;
  height: 420px;
  object-fit: cover;
  display: block;
`;

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
`;
const Greeting = styled.h3`
  font-size: 1.9rem;
  margin-bottom: 10px;

  strong {
    font-weight: 800;
  }
`;
const GuideGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 26px;
  max-width: 1000px;
  margin: 0 auto;
`;
const GuideCard = styled.div`
  background: #fff;
  border-radius: 10px;
  padding: 32px 20px;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  img {
    width: 70px;
    height: 70px;
    margin-bottom: 14px;
  }
  h4 {
    font-size: 1.05rem;
    margin-bottom: 6px;
  }
  p {
    font-size: 0.85rem;
    color: #777;
    line-height: 1.4;
  }
`;

const InfoBoards = styled.section`
  width: 100%;
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 16px;
  display: flex;
  gap: 0;
`;
const Board = styled.div`
  flex: 1 1 0;
  background: #fff;
  border: 1px solid #e5e5e5;
  border-right: none;
  &:last-of-type {
    border-right: 1px solid #e5e5e5;
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
`;

const AboutBlock = styled.section<{ reverse?: boolean }>`
  max-width: 1000px;
  margin: 10px auto;
  padding: 0 16px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  grid-template-areas: ${({ reverse }) => (reverse ? '"img txt"' : '"txt img"')};
  align-items: center;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
    grid-template-areas: 'img' 'txt';
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
    margin-bottom: 26px;
  }
`;
const AboutImage = styled.img`
  grid-area: img;
  width: 100%;
  border-radius: 12px;
  object-fit: cover;
`;

const ChatBtn = styled.button`
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: #c2d7ff;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 64px;
  height: 64px;
  font-size: 28px;
  cursor: pointer;
  z-index: 999;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;
const ChatModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 998;
`;
const ChatModal = styled.div`
  width: 100%;
  max-width: 480px;
  height: 90vh;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  z-index: 999;
`;
