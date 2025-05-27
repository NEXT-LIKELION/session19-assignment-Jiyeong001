"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function PostPage() {
  const params = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${params.id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch post");
        }
        const data = await res.json();
        setPost(data);
      } catch (error) {
        console.error("Error fetching post:", error.message);
      }
    };

    fetchPost();
  }, [params.id]);

  if (!post) {
    return <p>글을 찾을 수 없습니다.</p>;
  }

  return (
    <div>
      <h1>{post.title}</h1>
      <p>
        <strong>작성자:</strong> {post.author}
      </p>
      <p>{post.content}</p>
      <Link href="/">홈으로 돌아가기</Link>
    </div>
  );
}
