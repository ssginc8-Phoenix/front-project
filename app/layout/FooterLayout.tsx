import styled from 'styled-components';

interface LinkItem {
  name: string;
  url: string;
}

const links: LinkItem[] = [{ name: 'Home', url: '/' }];

const FooterWrapper = styled.footer`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 0;
  background-color: #243345;
  color: #fff;
`;

const LinksRow = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

const LinkButton = styled.a`
  font-size: 1rem;
  font-weight: bold;
  color: #fff;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const InfoText = styled.div`
  max-width: 700px;
  margin: 1rem auto 0;
  color: #ddd;
  font-size: 0.8125rem; /* 13px */
  line-height: 1.5;
  text-align: left;
`;

const Copyright = styled.div`
  text-align: center;
  margin-top: 1rem;
  font-size: 0.875rem;
  color: #ccc;
`;

const Footer: React.FC = () => (
  <FooterWrapper>
    <LinksRow>
      {links.map((link) => (
        <LinkButton key={link.url} href={link.url}>
          {link.name}
        </LinkButton>
      ))}
    </LinksRow>

    <InfoText>
      상호명: (주)닥투게더 · 주소: 부산광역시 해운대구 우동 1514
      <br />
      <br />
      고객센터: 1599-1598 · 이메일: support@docto.com
    </InfoText>

    <Copyright>&copy; 2025 DocTo</Copyright>
  </FooterWrapper>
);

export default Footer;
