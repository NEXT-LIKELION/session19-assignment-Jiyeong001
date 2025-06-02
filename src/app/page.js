import Link from "next/link";

export default async function HomePage() {
  const res = await fetch("http://localhost:3000/api/posts", {
    cache: "no-store",
  });
  const posts = await res.json();

  return (
    <div className="container mx-auto px-4 py-12 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
         <h1 className="text-4xl font-extrabold text-gray-800">Simple Blog</h1>
         <Link href="/post/write">
           <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg shadow transition duration-200">
             새 글 작성
           </button>
         </Link>
      </div>
     

      {posts.length === 0 ? (
        <p className="text-center text-xl text-gray-600 mt-10">아직 작성된 글이 없습니다.</p>
      ) : (
        <ul className="space-y-8">
          {posts.map((post) => (
            <li key={post.id} className="bg-white border border-gray-200 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Link href={`/post/${post.id}`} className="block">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 hover:text-blue-600 transition duration-200">
                  {post.title}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>
              </Link>
              <p className="text-sm text-gray-500 text-right">작성자: <span className="font-medium">{post.author}</span> | {new Date(post.createdAt).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
