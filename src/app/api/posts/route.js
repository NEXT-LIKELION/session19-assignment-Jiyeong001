import { NextResponse } from "next/server";

if (!globalThis.posts) {
  globalThis.posts = [];
}

export async function GET() {
  return NextResponse.json(globalThis.posts);
}

export async function POST(req) {
  const { title, author, content, location } = await req.json();
  const newPost = {
    id: (globalThis.posts.length + 1).toString(),
    title,
    author,
    content,
    location,
    createdAt: new Date(),
  };
  globalThis.posts.push(newPost);
  return NextResponse.json(newPost);
}
