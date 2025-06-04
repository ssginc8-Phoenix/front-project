// src/common/hooks/useKakaoLoader.ts
import { useKakaoLoader as useKakaoLoaderOrigin } from 'react-kakao-maps-sdk';

export default function useKakaoLoader() {
  useKakaoLoaderOrigin({
    appkey: '83891ef3391e6ddba1522c1c0be3a184', // 🔒 실제 배포용은 .env로!
    libraries: ['clusterer', 'drawing', 'services'],
  });
}
