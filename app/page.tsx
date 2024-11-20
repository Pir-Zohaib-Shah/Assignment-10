'use client'
import { useEffect, useState } from "react";
import { Merriweather } from "@next/font/google"
import Image from "next/image";

const candal = Merriweather({
  subsets: ["latin"],
  weight: ["300"]
})

type Book = {
  id: number;
  title: string;
  author: string;
  available: boolean;
  image: string;
};

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await fetch("/api/books");
        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }
        const data: Book[] = await response.json();
        setBooks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error fetching books");
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, []);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-6 flex justify-center flex-col items-center">
      <div className={candal.className}><h1 className="text-5xl font-bold text-center mb-10 z-10">Explore a World of Stories</h1></div> 
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-9">
        {books.map((book) => (
          <div
            key={book.id}
            className="bg-white text-black shadow-md rounded-lg overflow-hidden w-52 transform hover:scale-105 transition-all duration-200 relative"
          >
            <Image
              src={book.image}
              alt={book.title}
              width={208}
              height={500}
              className="object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold">{book.title}</h3>
              <p className="text-gray-700 mb-5">Author: {book.author}</p>
            </div>
           
            <p
              className={`text-sm absolute bottom-2 left-2 ${
                book.available ? "text-green-500" : "text-red-500"
              }`}
            >
              {book.available ? "Available" : "Not Available"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
