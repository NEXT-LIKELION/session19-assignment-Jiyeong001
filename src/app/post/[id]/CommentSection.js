'use client';

import { useState, useEffect } from 'react';

export default function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState('');

  // 댓글 불러오기
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/posts/${postId}/comments`);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || `Failed to fetch comments: ${res.status}`);
        }
        const data = await res.json();
        setComments(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchComments();
    }
  }, [postId]);

  // 댓글 제출
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: commentText, author: commentAuthor }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Failed to add comment: ${res.status}`);
      }

      const newComment = await res.json();
      setComments([...comments, newComment]); // 새 댓글 목록에 추가
      setCommentText(''); // 입력 필드 초기화
      setCommentAuthor(''); // 작성자 필드 초기화
    } catch (error) {
      console.error("Error adding comment:", error);
      alert(`댓글 추가 실패: ${error.message}`);
    }
  };

  // 댓글 수정 시작
  const handleStartEdit = (comment) => {
    setEditingCommentId(comment.id);
    setEditText(comment.text);
  };

  // 댓글 수정 취소
  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditText('');
  };

  // 댓글 수정 제출
  const handleSubmitEdit = async (commentId) => {
    if (!editText.trim()) return;

    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ commentId, text: editText }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Failed to update comment: ${res.status}`);
      }

      const updatedComment = await res.json();
      setComments(comments.map(comment => 
        comment.id === commentId ? updatedComment : comment
      ));
      setEditingCommentId(null);
      setEditText('');
    } catch (error) {
      console.error("Error updating comment:", error);
      alert(`댓글 수정 실패: ${error.message}`);
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId) => {
    if (!confirm('정말로 이 댓글을 삭제하시겠습니까?')) return;

    try {
      const res = await fetch(`/api/posts/${postId}/comments?commentId=${commentId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Failed to delete comment: ${res.status}`);
      }

      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert(`댓글 삭제 실패: ${error.message}`);
    }
  };

  if (loading) return <p>댓글 로딩 중...</p>;
  if (error) return <p>댓글 로딩 에러: {error}</p>;

  return (
    <div className="mt-10 border-t border-gray-200 pt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">댓글</h2>

      {/* 댓글 목록 */}
      <div className="space-y-6 mb-8">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="bg-gray-100 p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-700">{comment.author}</span>
                <span className="text-xs text-gray-500">
                  {new Date(comment.createdAt).toLocaleString()}
                  {comment.updatedAt && ` (수정됨)`}
                </span>
              </div>
              {editingCommentId === comment.id ? (
                <div className="space-y-2">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleSubmitEdit(comment.id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      저장
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-gray-800">{comment.text}</p>
                  <div className="flex justify-end space-x-2 mt-2">
                    <button
                      onClick={() => handleStartEdit(comment)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      삭제
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-600">아직 댓글이 없습니다.</p>
        )}
      </div>

      {/* 댓글 작성 폼 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">댓글 작성</h3>
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <div>
            <label htmlFor="commentAuthor" className="block text-sm font-medium text-gray-700 mb-1">이름 (선택 사항)</label>
            <input
              type="text"
              id="commentAuthor"
              value={commentAuthor}
              onChange={(e) => setCommentAuthor(e.target.value)}
              placeholder="이름"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="commentText" className="block text-sm font-medium text-gray-700 mb-1">댓글</label>
            <textarea
              id="commentText"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="댓글을 입력하세요"
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow transition duration-200">
              댓글 달기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 