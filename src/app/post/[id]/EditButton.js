"use client";

import Link from 'next/link';

export default function EditButton({ postId }) {
  return (
    <Link href={`/post/edit/${postId}`}>
      <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1.5 px-4 rounded-md shadow transition duration-200 mr-2">수정</button>
    </Link>
  );
}
