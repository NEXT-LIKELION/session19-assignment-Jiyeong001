"use client";

import { useRouter } from 'next/navigation';

export default function DeleteButton({ postId }) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = confirm('이 글을 삭제하시겠습니까?');
    if (confirmed) {
      try {
        const deleteRes = await fetch(`/api/posts/${postId}`, {
          method: 'DELETE',
        });

        if (!deleteRes.ok) {
          const errorData = await deleteRes.json();
          throw new Error(errorData.error || `Failed to delete post: ${deleteRes.status}`);
        }

        alert('글이 삭제되었습니다.');
        router.push('/'); // 삭제 후 메인 페이지로 이동
      } catch (error) {
        console.error("Error deleting post:", error.message);
        alert(`글 삭제 실패: ${error.message}`);
      }
    }
  };

  return (
    <button onClick={handleDelete} style={{ marginRight: '10px', cursor: 'pointer' }}>삭제</button>
  );
}