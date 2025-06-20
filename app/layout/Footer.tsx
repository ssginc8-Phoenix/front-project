import styled from 'styled-components';
import { Link } from 'react-router';

interface LinkItem {
  name: string;
  url: string;
}

const links: LinkItem[] = [{ name: 'Home', url: '/' }];

const FooterBar = styled.footer`
  width: 100%;
  padding: 2rem 2rem;
  background-color: #243345;
  color: #fff;

  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LinksRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
`;

const LinkButton = styled(Link)`
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const InfoText = styled.p`
  margin-top: 1rem;
  max-width: 700px;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: #ddd;
  text-align: left;
`;

const CopyrightText = styled.p`
  margin-top: 1rem;
  font-size: 0.875rem;
  color: #ccc;
`;

function Footer() {
  return (
    <FooterBar>
      <LinksRow>
        {links.map(({ name, url }) => (
          <LinkButton key={url} to={url}>
            {name}
          </LinkButton>
        ))}
      </LinksRow>

      <InfoText>
        상호명: (주)닥투게더 · 주소: 부산광역시 해운대구 우동 1514
        <br />
        고객센터: 1599-1598 · 이메일: support@docto.com
      </InfoText>

      <CopyrightText>© 2025 DocTo</CopyrightText>
    </FooterBar>
  );
}

export default Footer;
