import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import { FaUtensils, FaCoffee, FaUmbrellaBeach, FaCamera, FaInfoCircle, FaMapMarkerAlt, FaPlus, FaTimes, FaSun, FaCloudRain, FaWalking } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// CSV 파일 경로 설정
const csvFilePath = '/src/jeju_list_0822.csv';

const loadCSVData = async () => {
  return new Promise((resolve, reject) => {
    Papa.parse(csvFilePath, {
      download: true,
      header: true,
      delimiter: '\t',  // 탭 구분자 설정
      complete: (result) => {
        const imageMap = {};
        result.data.forEach(row => {
          imageMap[row['name']] = `/images/${row['picture']}`;
        });
        resolve(imageMap);
      },
      error: (error) => reject(error),
    });
  });
};

const RecommendationBox = ({ place, onDelete }) => {
  const [showInfo, setShowInfo] = useState(false);
  const [imageMap, setImageMap] = useState({});

  useEffect(() => {
    // CSV 데이터 로드
    const fetchData = async () => {
      const map = await loadCSVData();
      setImageMap(map);
    };
    fetchData();
  }, []);

  const fallbackImageUrl = '/images/default.jpg'; // 기본 이미지 경로 (필요한 경우 public/images에 넣어두세요)

  const handleInfoClick = () => setShowInfo(true);

  const handleMapClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const url = `https://www.google.com/maps/dir/${latitude},${longitude}/${place.name}`;
        window.open(url, '_blank');
      }, (error) => {
        console.error("Error getting user's location:", error);
        alert('위치 정보를 가져올 수 없습니다. 권한을 확인해주세요.');
      });
    } else {
      alert('이 브라우저에서는 위치 정보를 지원하지 않습니다.');
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6 transition-all duration-300 hover:shadow-2xl"
    >
      <div className="relative">
        <img
          src={imageMap[place.name] || fallbackImageUrl} // 장소 이름에 맞는 이미지를 사용
          alt={place.name}
          className="w-full h-56 object-cover"
          onError={(e) => { e.target.onerror = null; e.target.src = fallbackImageUrl; }}
        />
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onDelete}
          className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-300"
        >
          <FaTimes className="text-red-500" />
        </motion.button>
      </div>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-3 text-gray-800">{place.name || '이름 없음'}</h2>
        <p className="text-gray-600 mb-2">주소: {place.address || '주소 정보 없음'}</p>
        <p className="text-gray-600 mb-2">리뷰: {place.reviews || '리뷰 정보 없음'}</p>
        <p className="text-gray-600 mb-4">연락처: {place.contact || '연락처 정보 없음'}</p>
        <div className="flex justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleInfoClick}
            className="flex-1 py-3 px-4 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-lg transition duration-300 mr-2 flex items-center justify-center"
          >
            <FaInfoCircle className="mr-2" /> 정보
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleMapClick}
            className="flex-1 py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition duration-300 flex items-center justify-center"
          >
            <FaMapMarkerAlt className="mr-2" /> 지도
          </motion.button>
        </div>
      </div>
      <AnimatePresence>
        {showInfo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-6 rounded-lg max-w-md w-full"
            >
              <h2 className="text-2xl font-bold mb-4">{place.name}</h2>
              <p className="mb-2"><strong>주소:</strong> {place.address}</p>
              <p className="mb-2"><strong>리뷰:</strong> {place.reviews}</p>
              <p className="mb-2"><strong>운영 시간:</strong> {place.hours || '운영 시간 정보 없음'}</p>
              <p className="mb-2"><strong>입장료:</strong> {place.entryFee || '입장료 정보 없음'}</p>
              <p className="mb-2"><strong>주차 정보:</strong> {place.parking || '주차 정보 없음'}</p>
              <p className="mb-2"><strong>연락처:</strong> {place.contact || '연락처 정보 없음'}</p>
              {place.website && <p className="mb-2"><strong>웹사이트:</strong> <a href={place.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">여기</a></p>}
              <p className="mb-4"><strong>특별한 팁:</strong> {place.tips || '특별한 팁 정보 없음'}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowInfo(false)}
                className="w-full py-2 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-lg transition duration-300"
              >
                닫기
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const CategoryIcon = ({ Icon, label, onClick, isActive }) => (
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors duration-300 focus:outline-none ${
      isActive ? 'text-teal-500' : 'text-gray-600 hover:text-teal-500'
    }`}
  >
    <Icon className="text-2xl mb-1" />
    <span className="text-xs font-medium">{label}</span>
  </motion.button>
);

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=Jeju&appid=${process.env.REACT_APP_OPENWEATHER_API_KEY}&units=metric`);
        setWeather(response.data);
      } catch (error) {
        console.error('Error fetching weather:', error);
      }
    };
    fetchWeather();
  }, []);

  if (!weather) return null;

  const getWeatherIcon = (weatherCode) => {
    if (weatherCode >= 200 && weatherCode < 600) return <FaCloudRain />;
    return <FaSun />;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-400 to-teal-400 p-4 rounded-lg shadow-lg mb-4 flex items-center justify-between text-white"
      >
        <div className="flex items-center">
          {getWeatherIcon(weather.weather[0].id)}
          <span className="ml-2 text-2xl font-bold">{Math.round(weather.main.temp)}°C</span>
        </div>
        <span className="text-lg">{weather.weather[0].description}</span>
      </motion.div>
    );
  };
  
  const ChatBot = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [lastCategory, setLastCategory] = useState(null);
  
    const isDuplicateRecommendation = (newRecommendation) => {
      return recommendations.some(
        (recommendation) => 
          recommendation.name === newRecommendation.name &&
          recommendation.address === newRecommendation.address
      );
    };
  
    const fetchRecommendation = async (category) => {
      setIsLoading(true);
      try {
        const headers = {
          'Content-Type': 'application/json',
          'api-key': process.env.REACT_APP_OPENAI_API_KEY,
        };
  
        const payload = {
          messages: [
            {
              role: 'system',
              content: `제주도 현지 10대 MZ 가이드 역할, 발랄하고 맛있는 것, 재밌는 것, 놀러다니는 것을 좋아함. 제주도의 ${category} 1곳을 추천해주세요. 응답은 JSON 형식으로 해주세요. 예시: {"name": "장소이름", "address": "주소", "reviews": "리뷰내용", "hours": "운영시간", "entryFee": "입장료", "parking": "주차 정보", "contact": "연락처", "website": "웹사이트", "tips": "특별한 팁"}.`
            }
          ],
          temperature: 0.7,
          top_p: 0.95,
          max_tokens: 500,
        };
  
        const response = await axios.post(
          'https://a1418openai.openai.azure.com/openai/deployments/A1418openai/chat/completions?api-version=2023-03-15-preview',
          payload,
          { headers }
        );
  
        if (response.data && response.data.choices && response.data.choices[0].message) {
          const botResponse = response.data.choices[0].message.content.trim();
          const parsedResponse = JSON.parse(botResponse);
          parsedResponse.category = category;
          parsedResponse.id = Date.now();
          
          if (!isDuplicateRecommendation(parsedResponse)) {
            setRecommendations(prevRecommendations => [...prevRecommendations, parsedResponse]);
          } else {
            alert('중복된 추천이 있습니다. 다시 시도해 주세요.');
          }
        } else {
          throw new Error('No valid response from API');
        }
      } catch (error) {
        console.error('Error fetching recommendation:', error);
        alert('추천을 가져오는 데 문제가 발생했습니다. 다시 시도해 주세요.');
      } finally {
        setIsLoading(false);
        setCurrentCategory(null);
      }
    };
  
    const handleAddRecommendation = () => {
      if (lastCategory) {
        fetchRecommendation(lastCategory);
      }
    };
  
    const handleCategoryClick = (category) => {
      setCurrentCategory(category);
      setLastCategory(category);
      fetchRecommendation(category);
    };
  
    const handleDeleteRecommendation = (id) => {
      setRecommendations(prevRecommendations => prevRecommendations.filter(rec => rec.id !== id));
    };
  
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-400 to-blue-500 p-6 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[90vh]"
        >
          <WeatherWidget />
          <div className="flex-grow flex flex-col overflow-hidden">
            <div className="flex-grow p-6 overflow-y-auto">
              <AnimatePresence>
                {recommendations.length > 0 ? (
                  <>
                    {recommendations.map((recommendation) => (
                      <RecommendationBox
                        key={recommendation.id}
                        place={recommendation}
                        onDelete={() => handleDeleteRecommendation(recommendation.id)}
                      />
                    ))}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleAddRecommendation}
                      disabled={isLoading}
                      className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition duration-300 flex items-center justify-center mt-6 disabled:bg-blue-300"
                    >
                      <FaPlus className="mr-2" /> 새로운 추천 추가
                    </motion.button>
                  </>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center h-full"
                  >
                    <p className="text-2xl text-gray-600">카테고리를 선택하여 추천을 받아보세요!</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="bg-white border-t border-gray-200 p-4 relative">
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10"
                >
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </motion.div>
              )}
              <div className="flex justify-between items-center">
                <CategoryIcon Icon={FaUtensils} label="맛집" onClick={() => handleCategoryClick('맛집')} isActive={currentCategory === '맛집'} />
                <CategoryIcon Icon={FaCoffee} label="카페" onClick={() => handleCategoryClick('카페')} isActive={currentCategory === '카페'} />
                <CategoryIcon Icon={FaUmbrellaBeach} label="해변" onClick={() => handleCategoryClick('해변')} isActive={currentCategory === '해변'} />
                <CategoryIcon Icon={FaWalking} label="관광지" onClick={() => handleCategoryClick('관광지')} isActive={currentCategory === '관광지'} />
                <CategoryIcon Icon={FaCamera} label="포토스팟" onClick={() => handleCategoryClick('포토스팟')} isActive={currentCategory === '포토스팟'} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };
  
  export default ChatBot;
  







