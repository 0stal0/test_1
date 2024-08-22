import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

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

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
      <div className="relative">
        <img
          src={imageMap[place.name] || fallbackImageUrl} // 장소 이름에 맞는 이미지를 사용
          alt={place.name}
          className="w-full h-56 object-cover"
          onError={(e) => { e.target.onerror = null; e.target.src = fallbackImageUrl; }}
        />
        <button onClick={onDelete} className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md">
          X
        </button>
      </div>
      <div className="p-4">
        <h2 className="text-xl font-bold">{place.name}</h2>
        <p>{place.address}</p>
        <button onClick={handleInfoClick} className="bg-blue-500 text-white px-4 py-2 rounded">
          자세히 보기
        </button>
      </div>
    </div>
  );
};

export default RecommendationBox;

