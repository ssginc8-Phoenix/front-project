// ~/features/hospitals/api/geocode.ts
export const getCoordsFromAddress = async (
  address: string,
): Promise<{ lat: number; lng: number }> => {
  const res = await fetch(
    `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`,
    {
      headers: {
        Authorization: `KakaoAK ${'88fcb35a3f23060fbf073f45fda2d0d5'}`,
      },
    },
  );
  const contentType = res.headers.get('content-type');
  const raw = await res.text(); // 한 번만 소비해야 함

  if (!res.ok || !contentType?.includes('application/json')) {
    console.error('⛔️ 예상 외 응답:', raw.slice(0, 300));
    throw new Error(`주소 검색 실패: ${res.status}`);
  }

  const data = JSON.parse(raw);

  if (data.documents && data.documents.length > 0) {
    const { x, y } = data.documents[0];
    return { lat: parseFloat(y), lng: parseFloat(x) };
  } else {
    throw new Error('주소 검색 결과 없음');
  }
};
