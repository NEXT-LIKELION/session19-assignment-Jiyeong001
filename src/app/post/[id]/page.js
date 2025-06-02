import Link from "next/link";
import dynamic from 'next/dynamic';

const DeleteButton = dynamic(() => import('./DeleteButton'), { ssr: false });
const EditButton = dynamic(() => import('./EditButton'), { ssr: false });
const CommentSection = dynamic(() => import('./CommentSection'), { ssr: false });

export default async function PostPage({ params }) {
  const res = await fetch(`http://localhost:3000/api/posts/${params.id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return <p className="text-center text-xl text-gray-600 mt-10">글을 찾을 수 없습니다.</p>;
  }

  const post = await res.json();

  return (
    <div className="container mx-auto px-4 py-12 bg-gray-50 min-h-screen">
      <div className="bg-white border border-gray-200 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{post.title}</h1>
        <p className="text-sm text-gray-500 mb-6">작성자: <span className="font-medium">{post.author}</span> | {new Date(post.createdAt).toLocaleDateString()}</p>
        <div className="prose lg:prose-xl mb-8">
            <p>{post.content}</p>
        </div>

        <div className="flex items-center border-t border-gray-200 pt-6">
          <EditButton postId={post.id} />
          <DeleteButton postId={post.id} />
          <Link href="/" className="ml-auto text-blue-600 hover:underline">
            홈으로 돌아가기
          </Link>
        </div>

        <CommentSection postId={post.id} />
      </div>
    </div>
  );
}
