"use client"
import { useState } from "react";
import { api } from "@/trpc/react";

export default function HelloPage() {
  const [text, setText] = useState("");
  const helloQuery = api.post.hello.useQuery({ text }, { enabled: !!text });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold">TRPC Hello Query</h1>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text"
        className="mt-4 p-2 border rounded"
      />
      {helloQuery.data && (
        <p className="mt-4 text-lg">{helloQuery.data.greeting}</p>
      )}
    </div>
  );
}
