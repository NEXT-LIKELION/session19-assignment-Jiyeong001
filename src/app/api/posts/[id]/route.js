import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  console.log("현재 posts 배열:", globalThis.posts); // 🔍 디버그
  const post = globalThis.posts.find((p) => p.id === params.id);

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json(post);
}
