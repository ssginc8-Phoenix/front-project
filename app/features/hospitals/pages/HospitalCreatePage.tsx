import HospitalCreateForm from '~/features/hospitals/components/hospitalAdmin/info/HospitalCreateForm';
import { Title } from '~/components/styled/MyPage.styles';
import styled from 'styled-components';
import { media } from '~/features/hospitals/components/common/breakpoints';
const Emoji = styled.span`
  display: none;

  /* mobile 뷰에만 보이게 */
  ${media('mobile')`
    display: inline;
  `}
`;
const HospitalCreatePage = () => {
  return (
    <>
      <Title>
        <Emoji>🏥️</Emoji> 병원 등록
      </Title>
      <HospitalCreateForm />
    </>
  );
};

export default HospitalCreatePage;
