// import { useState, useEffect } from 'react';

// export const useImageFetcher = (name) => {
//   const [imageUrl, setImageUrl] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch('/jeju_list_0822.csv');
//         const text = await response.text();
        
//         const rows = text.split('\n').slice(1); // 첫 번째 줄은 헤더이므로 제외
//         let pictureName = null;

//         // CSV 데이터를 파싱하여 name에 맞는 pictureName 찾기
//         for (let row of rows) {
//           const [no, cls, placeName, address, menu, picture, insta] = row.split(',');
//           if (placeName.trim() === name.trim()) {
//             pictureName = picture.trim();
//             break;
//           }
//         }

//         if (pictureName) {
//           const imagePath = `/images/${pictureName}.jpg`;
//           setImageUrl(imagePath);
//         } else {
//           setError('Name not found in CSV');
//         }
//       } catch (err) {
//         setError('An error occurred while fetching the data.');
//       }
//     };

//     if (name) {
//       fetchData();
//     }
//   }, [name]);

//   return { imageUrl, error };
// };

import React from 'react';
import { useState, useEffect } from 'react';

// useImageFetcher 훅 정의
export const useImageFetcher = (name) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/jeju_list_0822.csv');
        const text = await response.text();
        
        const rows = text.split('\n').slice(1); // 첫 번째 줄은 헤더이므로 제외
        let pictureName = null;

        // CSV 데이터를 파싱하여 name에 맞는 pictureName 찾기
        for (let row of rows) {
          const [no, cls, placeName, address, menu, picture, insta] = row.split(',');
          if (placeName.trim() === name.trim()) {
            pictureName = picture.trim();
            break;
          }
        }

        if (pictureName) {
          const imagePath = `/images/${pictureName}`;
          setImageUrl(imagePath);
        } else {
          setError('Name not found in CSV');
          setImageUrl(null); // 이미지 URL을 null로 설정
        }
      } catch (err) {
        setError('An error occurred while fetching the data.');
        setImageUrl(null); // 오류 발생 시 이미지 URL을 null로 설정
      }
    };

    if (name) {
      fetchData();
    }
  }, [name]);

  return { imageUrl, error };
};

// Picture 컴포넌트 정의
const Picture = ({ name }) => {
  const { imageUrl, error } = useImageFetcher(name);

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!imageUrl) {
    return <p>Loading...</p>; // 이미지가 로드될 때까지 로딩 표시
  }

  return (
    <div>
      <img src={imageUrl} alt={name} />
    </div>
  );
};

// Picture 컴포넌트를 default export로 설정
export default Picture;

