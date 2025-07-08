import { useChatBotStore } from '../stores/ChatBotStore';
import { classifySymptom, getHospitalRecommendations } from '../api/ChatAPI';
import { useRef } from 'react';
import { useLocationStore } from '~/features/hospitals/state/locationStore';
import { calculateDistance } from '~/features/chatbot/util/calculateDistance';

let messageId = 0;

const positiveKeywords = ['네', '응', '추천해줘'];

export const useChatbot = () => {
  const { addMessage } = useChatBotStore();
  const stepRef = useRef<'idle' | 'awaitingConfirm'>('idle');
  const specializationRef = useRef<string | null>(null);
  const { latitude, longitude } = useLocationStore();

  const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const sendMessage = async (text: string) => {
    const normalized = text.trim();
    const lowerText = normalized.toLowerCase();

    addMessage({
      id: ++messageId,
      sender: 'user',
      message: normalized,
      timestamp: now(),
    });

    //증상 분류
    if (stepRef.current === 'idle') {
      try {
        const specialization = await classifySymptom(normalized);
        specializationRef.current = specialization;
        stepRef.current = 'awaitingConfirm';

        addMessage({
          id: ++messageId,
          sender: 'bot',
          message: `🧠 '${specialization}' 관련 진료과로 분류되었어요.\n관련 병원을 추천해드릴까요?`,
          timestamp: now(),
        });
      } catch (e) {
        console.error('[Chatbot Error]', e);
        addMessage({
          id: ++messageId,
          sender: 'bot',
          message: '⚠️ 오류가 발생했습니다. 다시 시도해주세요.',
          timestamp: now(),
        });
      }
      return;
    }

    //추천 여부 확인 및 추천
    if (stepRef.current === 'awaitingConfirm') {
      const isPositive = positiveKeywords.some((word) => lowerText.includes(word));
      const specialization = specializationRef.current;

      if (isPositive && specialization) {
        try {
          const hospitals = await getHospitalRecommendations(specialization);

          // if (!latitude || !longitude) {
          //   addMessage({
          //     id: ++messageId,
          //     sender: 'bot',
          //     message: '📍 위치 정보를 불러올 수 없습니다. 가까운 병원 추천이 어려워요.',
          //     timestamp: now(),
          //   });
          // }

          const sortedHospitals = hospitals
            .map((h) => ({
              ...h,
              distance:
                latitude && longitude
                  ? calculateDistance(latitude, longitude, h.latitude, h.longitude)
                  : Number.MAX_SAFE_INTEGER,
            }))
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 3); // 가까운 3개만

          if (sortedHospitals.length === 0) {
            addMessage({
              id: ++messageId,
              sender: 'bot',
              message: '😢 근처에 관련된 병원이 없어요. 부산시 내에서 추천드릴게요!',
              timestamp: now(),
            });
          } else {
            addMessage({
              id: ++messageId,
              sender: 'bot',
              message: '✅ 근처 추천 병원 리스트입니다.',
              timestamp: now(),
            });

            sortedHospitals.forEach((h) => {
              addMessage({
                id: ++messageId,
                sender: 'bot',
                message: `🏥 ${h.name}\n📍 ${h.address}\n📞 ${h.phone}`,
                timestamp: now(),
                data: { hospitalId: h.id },
              });
            });
          }
        } catch (e) {
          console.error('[Recommendation Error]', e);
          addMessage({
            id: ++messageId,
            sender: 'bot',
            message: '❌ 병원 추천에 실패했습니다.',
            timestamp: now(),
          });
        }
      } else {
        addMessage({
          id: ++messageId,
          sender: 'bot',
          message: '😉 네! 필요하실 때 언제든 증상을 말씀해주세요.',
          timestamp: now(),
        });
      }

      stepRef.current = 'idle';
      specializationRef.current = null;
      return;
    }
  };

  return { sendMessage };
};
