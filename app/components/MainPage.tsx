import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import styled, { keyframes } from 'styled-components';
import Slider from 'react-slick';
import useLoginStore from '~/features/user/stores/LoginStore';

const ads = ['/ads/ad1.png', '/ads/ad2.png', '/ads/ad3.png'];

const features = [
  { title: '주변 병원', route: '/hospitals/search', icon: '/location.png' },
  { title: '진료 예약', route: '/appointments/request', icon: '/appointment.png' },
  { title: '서류 발급', route: '/documents', icon: '/document.png' },
];

const infoItems = [
  {
    title: '캘린더로 쉽게 관리하세요',
    imgSrc: '/images/info-calendar.png',
    url: '',
  },
  {
    title: '실시간 대기인원을 확인하세요',
    imgSrc: '/images/app_list.png',
    url: '/dashboard',
  },
  {
    title: '주변 병원을 쉽게 검색하세요',
    imgSrc: '/images/info-map.png',
    url: '/hospitals',
  },
  {
    title: '필요한 서류를 간편하게 다운로드하세요',
    imgSrc: '/images/info-docs.png',
    url: '/documents',
  },
];

export default function MainPage() {
  const navigate = useNavigate();
  const user = useLoginStore((s) => s.user);

  useEffect(() => {
    if (!user) {
      useLoginStore.getState().fetchMyInfo();
    }
  }, [user]);

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
    <PageWrapper>
      {/* 광고 슬라이더 */}
      <AdCarousel>
        <Slider {...sliderSettings}>
          {ads.map((src) => (
            <div key={src}>
              <AdImage src={src} alt="광고 배너" />
            </div>
          ))}
        </Slider>
      </AdCarousel>

      {/* 인사말 */}
      <Greeting>
        <strong>{user?.name}</strong> 님, 안녕하세요!
      </Greeting>

      {/* 기능 카드 */}
      <FeatureGrid>
        {features.map(({ title, route, icon }) => (
          <Card key={title} onClick={() => navigate(route)}>
            <Icon src={icon} alt={title} />
            <CardTitle>{title}</CardTitle>
          </Card>
        ))}
      </FeatureGrid>

      {/* 정보 카드 섹션 (연회색 배경) */}
      <InfoSectionContainer>
        <InfoSection>
          {infoItems.map(({ title, imgSrc, url }) => (
            <InfoCard key={title} onClick={() => navigate(url)}>
              <InfoImage src={imgSrc} alt={title} />
              <InfoTitle>{title}</InfoTitle>
            </InfoCard>
          ))}
        </InfoSection>
      </InfoSectionContainer>
    </PageWrapper>
  );
}

const PageWrapper = styled.main`
  max-width: 1024px;
  margin: 0 auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const AdCarousel = styled.section`
  border-radius: 12px;
  overflow: hidden;
  .slick-dots {
    bottom: 10px;
  }
`;

const AdImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
  display: block;
`;

const Greeting = styled.h3`
  font-size: 1.5rem;
  font-weight: 400;
  color: #1f2937;

  & > strong {
    font-weight: 600;
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  column-gap: 100px;
  row-gap: 100px;
  grid-template-columns: repeat(auto-fit, 160px);
  justify-content: center;
`;

const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
`;

const Card = styled.div`
  width: 160px;
  height: 160px;
  background: #ffffff;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

    img {
      animation: ${bounce} 0.5s ease-in-out;
    }
  }
`;

const Icon = styled.img`
  width: 64px;
  height: 64px;
  margin-bottom: 8px;
`;

const CardTitle = styled.span`
  font-size: 0.95rem;
  font-weight: 500;
  color: #737373;
`;

const InfoSectionContainer = styled.section`
  background: #f5f5f5;
  border-radius: 16px;
  padding: 24px;
`;

const InfoSection = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
`;

const InfoCard = styled.div`
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  max-width: 440px;
  width: 100%;
  margin: 0 auto;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const InfoImage = styled.img`
  width: 80%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  margin-top: 14px;
`;

const InfoTitle = styled.p`
  margin-top: 12px;
  font-size: 0.95rem;
  font-weight: 500;
  color: #737373;
  line-height: 1.4;
`;
