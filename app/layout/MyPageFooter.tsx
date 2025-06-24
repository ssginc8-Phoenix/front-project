import styled from 'styled-components';
import { Link } from 'react-router';

const policyLinks = [
  { name: '회사 소개', url: '#' },
  { name: '이용약관', url: '#' },
  { name: '개인정보처리방침', url: '#' },
];

export default function MyPageFooter() {
  return (
    <FooterBar>
      <FooterContent>
        <LeftBlock>
          <LinksRow>
            {policyLinks.map(({ name, url }) => (
              <PolicyLink key={name} to={url}>
                {name}
              </PolicyLink>
            ))}
          </LinksRow>

          <InfoText>
            주식회사 닥투게더
            <br />
            부산광역시 해운대구 우동 1514
            <br />
            대표팀 : 불사조 &nbsp;|&nbsp; 사업자번호 : 114-87-13123
            <br />
            대표전화 : 1899-1899 &nbsp;|&nbsp; 이메일 : support@docto.kr
          </InfoText>
        </LeftBlock>
      </FooterContent>

      <BottomWrapper>
        <CopyrightText>© 2025 DocTo</CopyrightText>
      </BottomWrapper>
    </FooterBar>
  );
}
const FooterBar = styled.footer`
  width: 100%;
  background: #243345;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 2rem 0 1rem;
`;

const FooterContent = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0 2rem;
  margin: 0 auto;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

const LeftBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const LinksRow = styled.div`
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
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
`;

const BottomWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
`;

const CopyrightText = styled.p`
  font-size: 0.85rem;
  color: #ccc;
  text-align: center;
`;
