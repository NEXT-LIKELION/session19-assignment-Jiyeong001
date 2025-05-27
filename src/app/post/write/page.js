"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WritePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [location, setLocation] = useState(null); 
  const router = useRouter();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          console.log("📍 내 위치: ", latitude, longitude);
          const address = await fetchAddress(latitude, longitude);
          setLocation(address);
        },
        (error) => {
          console.error("위치 정보를 가져올 수 없습니다.", error.message);
        }
      );
    }
  }, []);

  const fetchAddress = async (lat, lng) => {
    console.log("🔎 Kakao API Key:", process.env.NEXT_PUBLIC_KAKAO_API_KEY);

    try {
      const response = await fetch(
        `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${lng}&y=${lat}`,
        {
          headers: {
            Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_API_KEY}`,
          },
        }
      );

      console.log("🔎 응답 상태:", response.status);
      const text = await response.text();
      console.log("🔎 응답 내용:", text); // ✅ 응답 내용 확인

      if (!response.ok) {
        throw new Error(`Failed to fetch address: ${response.statusText}`);
      }

      const data = JSON.parse(text);
      console.log("🔎 주소 변환 결과:", data);

      return data.documents[0].address.address_name;
    } catch (error) {
      console.error("주소 변환 실패:", error.message);
      return "주소를 찾을 수 없습니다.";
    }
  };

  // ✅ 여기 handleSubmit 정의가 빠져 있었음!
  const handleSubmit = async () => {
    if (!title || !content) {
      alert("제목과 내용은 필수 입력 사항입니다.");
      return;
    }
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, author, content, location }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit post");
      }

      await res.json();
      router.push("/");
    } catch (error) {
      console.error("Error during submission:", error.message);
    }
  };

  return (
    <div>
      <h1>글 작성</h1>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목을 입력하세요"
      />
      <input
        type="text"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        placeholder="작성자 (비우면 랜덤 닉네임)"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="글 내용을 입력하세요"
      />
      {location ? (
        <p>📍 작성 위치: {location}</p>
      ) : (
        <p>🌐 위치 정보를 불러오는 중...</p>
      )}
      <button onClick={handleSubmit}>작성하기</button>
    </div>
  );
}
