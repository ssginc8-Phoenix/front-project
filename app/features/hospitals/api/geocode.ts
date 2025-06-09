// ~/features/hospitals/api/geocode.ts
export const getCoordsFromAddress = async (
  address: string,
): Promise<{ lat: number; lng: number }> => {
  const res = await fetch(
    `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`,
    {
      headers: {
        Authorization: `KakaoAK ${'3bde56866d8f5daeff2c18e2bcbdf4f1'}`,
      },
    },
  );
  const data = await res.json();

  if (data.documents && data.documents.length > 0) {
    const { x, y } = data.documents[0]; // x: longitude, y: latitude
    return { lat: parseFloat(y), lng: parseFloat(x) };
  } else {
    throw new Error('주소 검색 결과 없음');
  }
};
