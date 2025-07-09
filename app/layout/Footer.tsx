import styled from 'styled-components';
import { Link } from 'react-router';

const cardItems = [
  {
    title: '닥투 도입 상담',
    badge: '병원전용',
    icon: '/public/footer_consultation.png',
    link: '#',
  },
  { title: '채용 공고', icon: '/public/footer_document.png', link: '#' },
];

const policyLinks = [
  { name: '회사 소개', url: '#' },
  { name: '이용약관', url: '#' },
  { name: '개인정보처리방침', url: '#' },
];

export default function Footer() {
  return (
    <FooterBar>
      <FooterContent>
        {/* 상단 카드 */}
        <CardRow>
          {cardItems.map(({ title, badge, icon, link }) => (
            <Card key={title} to={link}>
              <CardIcon src={icon} alt="" />
              <CardTitle>
                {title}
                {badge && <Badge>{badge}</Badge>}
              </CardTitle>
            </Card>
          ))}
        </CardRow>

        {/* 정책 링크 */}
        <LinksRow>
          {policyLinks.map(({ name, url }) => (
            <PolicyLink key={name} to={url}>
              {name}
            </PolicyLink>
          ))}
        </LinksRow>

        {/* 회사 정보 */}
        <InfoText>
          주식회사 닥투게더
          <br /> 부산광역시 해운대구 우동 1514
          <br />
          대표팀 : 불사조 &nbsp;|&nbsp; 사업자번호 : 114-87-13123
          <br />
          대표전화 : 1899-1899 &nbsp;|&nbsp; 이메일 : support@docto.kr
        </InfoText>

        <CopyrightText>© 2025 DocTo</CopyrightText>
      </FooterContent>
    </FooterBar>
  );
}

const FooterBar = styled.footer`
  width: 100%;
  background: #243345;
  color: #fff;
  display: flex;
  justify-content: center;
`;

const FooterContent = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const CardRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 1rem;
  padding: 0 16px;

  @media (max-width: 640px) {
    padding: 0 12px;
  }
`;

const Card = styled(Link)`
  display: flex;
  align-items: center;
  background-color: #1d2938;
  border-radius: 10px;
  padding: 10px 14px;
  height: 48px;
  text-decoration: none;
  color: #ffffff;

  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 480px) {
    height: 44px;
    padding: 8px 12px;
  }
`;

const CardIcon = styled.img`
  width: 26px;
  height: 26px;
  margin-right: 10px;

  @media (max-width: 480px) {
    width: 22px;
    height: 22px;
    margin-right: 8px;
  }
`;

const CardTitle = styled.span`
  font-size: 0.875rem;
  font-weight: 600;

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const Badge = styled.span`
  background-color: #6c8cff;
  color: white;
  font-size: 0.65rem;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 8px;

  @media (max-width: 480px) {
    font-size: 0.6rem;
    padding: 1px 4px;
  }
`;

const LinksRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
`;

const PolicyLink = styled(Link)`
  font-size: 0.9rem;
  color: #ffffffb3;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const InfoText = styled.p`
  font-size: 0.8125rem;
  line-height: 1.6;
  color: #ddd;
  text-align: center;
  max-width: 600px;
`;

const CopyrightText = styled.p`
  font-size: 0.85rem;
  color: #ccc;
`;
