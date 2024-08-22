import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import { FaUmbrellaBeach, FaMountain, FaCoffee, FaUtensils, FaArrowRight } from 'react-icons/fa';
import ChatBot from './ChatBot';
import './App.css'; // App.css에서 폰트 설정과 스타일을 포함

const CategoryIcon = ({ Icon, label }) => (
  <div className="flex flex-col items-center">
    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md mb-1">
      <Icon className="text-lg text-blue-500" />
    </div>
    <span className="text-xs font-medium text-gray-700">{label}</span>
  </div>
);

const JejuTravelPlanner = () => {
  const [showChatBot, setShowChatBot] = useState(false);

  useEffect(() => {
    console.log('JejuTravelPlanner 컴포넌트가 마운트되었습니다.');
  }, []);

  const fadeIn = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { duration: 1000 }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex items-center justify-center p-4 font-pretendard">
      {!showChatBot && (
        <animated.div style={fadeIn} className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-md md:max-w-lg lg:max-w-xl relative z-10 p-6">
          <div className="p-6">
            <img src="/logo200.png" alt="Logo" className="h-40 mb-5 mx-auto" />
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 text-gray-800 text-center">제주 전문 여행플래너</h1>
            <p className="text-sm md:text-base lg:text-lg mb-6 text-gray-600 font-bold text-center">히위고와 함께 신나는 제주여행 </p>
          </div>

          <div className="flex justify-between px-6 py-4 bg-gray-100">
            <CategoryIcon Icon={FaUmbrellaBeach} label="해변" />
            <CategoryIcon Icon={FaMountain} label="관광지" />
            <CategoryIcon Icon={FaCoffee} label="카페" />
            <CategoryIcon Icon={FaUtensils} label="맛집" />
          </div>

          <div className="p-6">
            <h2 className="text-lg md:text-xl lg:text-2xl font-bold mb-4 text-gray-800 text-center">제주 여행의 모든 것</h2>
            <ul className="text-sm md:text-base lg:text-lg space-y-2">
              <li className="flex items-center">
                <FaArrowRight className="text-green-500 mr-2" /> 알잘딱 맞춤 일정 추천
              </li>
              <li className="flex items-center">
                <FaArrowRight className="text-green-500 mr-2" /> 숨은 명소 추천
              </li>
              <li className="flex items-center">
                <FaArrowRight className="text-green-500 mr-2" /> 빅데이터 기반 맛집, 카페
              </li>
            </ul>
          </div>

          <div className="text-center mt-6">
            <button 
              onClick={() => setShowChatBot(true)} 
              className="bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
            >
              어디갈지 찾아보기
            </button>
          </div>
        </animated.div>
      )}

      {showChatBot && (
        <div className="fixed inset-0 bg-white flex items-center justify-center p-4">
          <div className="bg-gray-100 w-full max-w-md rounded-lg shadow-lg p-4">
            <ChatBot />
          </div>
        </div>
      )}
    </div>
  );
};

export default JejuTravelPlanner;
