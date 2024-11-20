'use client';
import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
import { Merriweather } from "@next/font/google";
import { 
  AlertDialog, 
  AlertDialogTrigger, 
  AlertDialogContent, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogDescription, 
  AlertDialogAction, 
  AlertDialogCancel 
} from '@/components/ui/alert-dialog'; // Import ShadCN AlertDialog components
import Image from "next/image";

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300"]
});

type Book = {
  id: number;
  title: string;
  author: string;
  available: boolean;
  image: string;
};

export default function Admin() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newBook, setNewBook] = useState<Book>({
    id: 0,
    title: "",
    author: "",
    available: true,
    image: "",
  });
  const [editBook, setEditBook] = useState<Book | null>(null); // Track the book being edited
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null); // Store the book to delete
  // const router = useRouter();

  // Fetch books data from the API
  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await fetch("/api/books");
        if (!response.ok) throw new Error("Failed to fetch books");
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

  // Add a new book
  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/books", {
        method: "POST",
        body: JSON.stringify(newBook),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Failed to add book");
      const addedBook = await response.json();
      setBooks([...books, addedBook]);
      setNewBook({
        id: 0,
        title: "",
        author: "",
        available: true,
        image: "",
      }); // Reset the form
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error adding book");
    }
  };

  // Handle editing book inside the dialog
  const handleEditBook = async () => {
    if (editBook) {
      try {
        const response = await fetch("/api/books", {
          method: "PUT",
          body: JSON.stringify(editBook),
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Failed to update book");
        const updatedBook = await response.json();
        const updatedBooks = books.map((book) =>
          book.id === updatedBook.id ? updatedBook : book
        );
        setBooks(updatedBooks);
        setEditBook(null); // Close the edit dialog
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error updating book");
      }
    }
  };

  // Handle deleting a book
  const handleDeleteBook = async () => {
    if (bookToDelete) {
      try {
        const response = await fetch("/api/books", {
          method: "DELETE",
          body: JSON.stringify({ id: bookToDelete.id }),
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Failed to delete book");
        setBooks(books.filter((book) => book.id !== bookToDelete.id));
        alert("Book deleted successfully!");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error deleting book");
      } finally {
        setBookToDelete(null);
      }
    }
  };

  // Loading and error states
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <div className={merriweather.className}>
        <h1 className="text-5xl font-bold text-center mb-6 text-white">Admin Dashboard</h1>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Add New Book</h2>
        <form onSubmit={handleAddBook} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              value={newBook.title}
              onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
              className="mt-1 p-2 border rounded w-full text-black"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Author</label>
            <input
              type="text"
              value={newBook.author}
              onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
              className="mt-1 p-2 border rounded w-full text-black"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Image URL</label>
            <input
              type="text"
              value={newBook.image}
              onChange={(e) => setNewBook({ ...newBook, image: e.target.value })}
              className="mt-1 p-2 border rounded w-full text-black"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Available</label>
            <input
              type="checkbox"
              checked={newBook.available}
              onChange={(e) => setNewBook({ ...newBook, available: e.target.checked })}
              className="mt-1"
            />
          </div>
          <button
            type="submit"
            className="mt-4 bg-blue-500 text-white p-2 rounded"
          >
            Add Book
          </button>
        </form>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Books List</h2>
      <div className="md:grid sm:grid sm:grid-cols-1 md:grid-cols-4 gap-6 flex flex-col justify-center items-center">
        {books.map((book) => (
          <div key={book.id} className="bg-white shadow-md rounded-lg mb-4 p-4 w-64 relative text-black">
            <div className="flex items-center mb-11">
              <Image
                src={book.image}
                alt={book.title}
                width={500}
                height={500}
                className="w-16 h-16 object-cover rounded-lg mr-4 mb-6"
              />
              <div className="flex-grow">
                <h3 className="text-xl font-semibold"> {book.title}</h3>
                <p className="text-gray-700">Author: &quot;{book.author}&quot;</p>
                <p className={`text-sm ${book.available ? "text-green-500" : "text-red-500"}`}>
                  {book.available ? "Available" : "Not Available"}
                </p>
              </div>
            </div>
            <div className="flex justify-between mt-4">
              {/* Edit Button */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    onClick={() => setEditBook(book)} // Set the book to edit
                    className="bg-yellow-400 text-white p-2 rounded absolute bottom-4 left-4"
                  >
                    Edit
                  </button>
                </AlertDialogTrigger>

                {/* AlertDialog for editing */}
                {editBook && (
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-black">Edit Book</AlertDialogTitle>
                      <AlertDialogDescription>
                        Modify the details of <strong>{editBook.title}</strong>
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <div>
                      <label className="block text-sm font-medium text-black">Title</label>
                      <input
                        type="text"
                        value={editBook.title}
                        onChange={(e) => setEditBook({ ...editBook, title: e.target.value })}
                        className="mt-1 p-2 border rounded w-full text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black">Author</label>
                      <input
                        type="text"
                        value={editBook.author}
                        onChange={(e) => setEditBook({ ...editBook, author: e.target.value })}
                        className="mt-1 p-2 border rounded w-full text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black">Image URL</label>
                      <input
                        type="text"
                        value={editBook.image}
                        onChange={(e) => setEditBook({ ...editBook, image: e.target.value })}
                        className="mt-1 p-2 border rounded w-full text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black">Available</label>
                      <input
                        type="checkbox"
                        checked={editBook.available}
                        onChange={(e) => setEditBook({ ...editBook, available: e.target.checked })}
                        className="mt-1 "
                      />
                    </div>

                    <div className="flex justify-between mt-4">
                      <AlertDialogCancel onClick={() => setEditBook(null)} className="text-black">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction onClick={handleEditBook}>
                        Save Changes
                      </AlertDialogAction>
                    </div>
                  </AlertDialogContent>
                )}
              </AlertDialog>
              {/* Delete Button */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    onClick={() => setBookToDelete(book)}
                    className="bg-red-500 text-white p-2 rounded absolute bottom-4 right-4"
                  >
                    Delete
                  </button>
                </AlertDialogTrigger>
                {/* AlertDialog for deletion */}
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-black">Delete Book</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete <strong>{book.title}</strong>?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="flex justify-between">
                    <AlertDialogCancel onClick={() => setBookToDelete(null)} className="text-black">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteBook}>
                      Delete
                    </AlertDialogAction>
                  </div>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
