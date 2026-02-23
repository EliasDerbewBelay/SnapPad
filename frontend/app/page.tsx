"use client";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-center mt-10">
        Welcome to SnapPad
      </h1>
      <p className="text-center text-gray-600 mt-4">
        Your personal note-taking app
      </p>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 mx-auto block">
        <Link href="/register">Get Started</Link>
      </button>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 mx-auto block">
        <Link href="/login">I already have an account</Link>
      </button>
    </div>
  );
}
