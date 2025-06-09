// src/components/hospitalSearch/HospitalListPanel.tsx
import React from 'react';
import styled from 'styled-components';
import type { Hospital } from '../../../types/hospital';

const Panel = styled.aside`
  width: 360px;
  background: #ffffff;
  border-radius: 8px;
  margin: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  padding: 24px 20px 16px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: #333;
`;

const SearchGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
`;
const Select = styled.select`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.9rem;
`;
const SearchInput = styled.input`
  flex: 2;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.9rem;
`;

const List = styled.ul`
  flex: 1;
  margin: 0;
  padding: 16px 0;
  list-style: none;
  overflow-y: auto;
`;

const Card = styled.li<{ selected: boolean }>`
  display: flex;
  gap: 12px;
  padding: 16px;
  margin: 0 16px 12px;
  background: ${({ selected }) => (selected ? '#eaf2ff' : '#fafafa')};
  border-radius: 8px;
  box-shadow: ${({ selected }) =>
    selected ? '0 0 6px rgba(0, 123, 255, 0.3)' : '0 1px 3px rgba(0,0,0,0.1)'};
  cursor: pointer;

  &:hover {
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
  }
`;

const Thumbnail = styled.img`
  width: 72px;
  height: 72px;
  border-radius: 6px;
  object-fit: cover;
`;

const Info = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const Name = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
`;
const Meta = styled.div`
  font-size: 0.85rem;
  color: #666;
  line-height: 1.4;
`;
const Actions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;

  button {
    flex: 1;
    padding: 6px 0;
    font-size: 0.85rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  .reserve {
    background: #007bff;
    color: white;
  }
  .route {
    background: #e6f0fe;
    color: #00499e;
  }
`;

const Badge = styled.span`
  position: absolute;
  top: 12px;
  right: 12px;
  background: #cfe2ff;
  color: #084298;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const HospitalListPanel: React.FC<{
  hospitals: Hospital[];
  loading: boolean;
  error: Error | null;
  onHospitalSelect: (id: number, lat: number, lng: number) => void;
  selectedHospitalId?: number;
}> = ({ hospitals, loading, error, onHospitalSelect, selectedHospitalId }) => {
  if (loading)
    return (
      <Panel>
        <div style={{ padding: 20 }}>로딩 중...</div>
      </Panel>
    );
  if (error)
    return (
      <Panel>
        <div style={{ padding: 20, color: 'red' }}>에러!</div>
      </Panel>
    );

  return (
    <Panel>
      <Header>
        <Title>주변 병원</Title>
      </Header>
      <SearchGroup>
        <Select>
          <option>해운대구</option>
          {/* … */}
        </Select>
        <SearchInput placeholder="검색어 입력" />
      </SearchGroup>
      <List>
        {hospitals.map((h) => (
          <Card
            key={h.hospitalId}
            selected={h.hospitalId === selectedHospitalId}
            onClick={() => onHospitalSelect(h.hospitalId, h.latitude, h.longitude)}
          >
            <Thumbnail src={'/public/hospital-default.jpeg'} />
            <Info>
              <Name>{h.name}</Name>
              <Meta>
                08:30 - 20:00
                <br />
                {/*{Math.round(h.distance)}*/}
              </Meta>
              <Actions>
                <button className="reserve">진료예약</button>
                <button className="route">길찾기</button>
              </Actions>
            </Info>
            <Badge>대기 5명</Badge>
          </Card>
        ))}
      </List>
    </Panel>
  );
};

export default HospitalListPanel;
