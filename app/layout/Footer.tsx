import styled from 'styled-components';
import { Link } from 'react-router';

const cardItems = [
  { title: '닥투 도입 상담', badge: '병원전용', icon: 'footer_consultation.png', link: '#' },
  { title: '채용 공고', icon: 'footer_document.png', link: '#' },
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
  gap: 20px;
  @media (min-width: 640px) {
    flex-direction: row;
  }
`;

const Card = styled(Link)`
  flex: 1 1 320px;
  background: #1d2938;
  border-radius: 12px;
  padding: 18px 22px;
  display: flex;
  align-items: center;
  gap: 14px;
  text-decoration: none;
  color: #fff;
`;

const CardIcon = styled.img`
  width: 44px;
  height: 44px;
`;

const CardTitle = styled.span`
  font-size: 1.05rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Badge = styled.span`
  background: #4478ff;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
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
