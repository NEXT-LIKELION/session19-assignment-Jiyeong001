"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WritePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [location, setLocation] = useState(null);
  const router = useRouter();

  // 위치 정보 가져오는 로직 (클라이언트에서 실행)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(`Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocation("위치 정보를 가져오지 못했습니다.");
        }
      );
    } else {
      setLocation("위치 정보를 지원하지 않는 브라우저입니다.");
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault(); // 폼 기본 제출 방지

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, author, content, location }),
      });

      // 응답 상태 확인
      if (!res.ok) {
        // 에러 응답인 경우 JSON 본문을 파싱하여 에러 메시지 확인
        const errorData = await res.json();
        throw new Error(errorData.error || `Failed to submit post: ${res.status}`);
      }

      // 성공 응답인 경우 JSON 본문 파싱 (필요하다면)
      const result = await res.json();
      console.log("Post submitted successfully:", result); // 성공 로그

      alert("글이 성공적으로 작성되었습니다."); // 성공 알림
      router.push("/");
    } catch (error) {
      console.error("Error during submission:", error.message);
      // 사용자에게 에러 메시지를 표시하는 로직을 여기에 추가할 수 있습니다.
      alert(`글 작성 실패: ${error.message}`); // 예시로 alert 사용
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 bg-gray-50 min-h-screen">
      <div className="bg-white border border-gray-200 p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">새 글 작성</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">제목</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">작성자 (비우면 랜덤 닉네임)</label>
            <input
              type="text"
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="작성자"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">글 내용</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="글 내용을 입력하세요"
              rows="10"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* 위치 정보 표시 */}
          <div className="text-sm text-gray-600">
            {location ? (
              <p>📍 작성 위치: {location}</p>
            ) : (
              <p>�� 위치 정보를 불러오는 중...</p>
            )}
          </div>

          <div className="flex justify-end">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow transition duration-200">
              작성 완료
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
