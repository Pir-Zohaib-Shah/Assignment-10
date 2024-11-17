import { NextResponse } from "next/server";

// Define the type for the book object
interface Book {
  id: number;
  title: string;
  author: string;
  available: boolean;
  image: string;
}

// Sample in-memory books array
let books: Book[] = [
  { id: 1, title: "The Hunger Games", author: "Suzanne Collins", available: true, image: "/the_hunger_games.png" },
  { id: 2, title: "Harry Potter", author: "J.K Rowling", available: false, image: "/harry_potter.png" },
  { id: 3, title: "Pride and Prejudice", author: "Jane Austen, Anna Quindlen", available: true, image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1320399351i/1885.jpg" },
  { id: 4, title: "To Kill a Mockingbird", author: "Harper Lee", available: true, image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1553383690i/2657.jpg" },
  { id: 5, title: "The Book Thief", author: "Markus Zusak", available: true, image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1522157426i/19063.jpg" },
  { id: 6, title: "Twilight", author: "Stephenie Meyer", available: true, image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1700522826i/41865.jpg" },
  { id: 7, title: "The Chronicles of Narnia", author: "C.S. Lewis, Pauline Baynes", available: true, image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1661032875i/11127.jpg" },
  { id: 8, title: "The Fault in Our Stars", author: "John Green", available: true, image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1660273739i/11870085.jpg" },
  { id: 9, title: "The Picture of Dorian Gray", author: "Oscar Wilde, Jeffrey Eugenides", available: true, image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1546103428i/5297.jpg" },
  { id: 10, title: "The Giving Tree", author: "Shel Silverstein", available: true, image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1725807591i/370493.jpg" },
];

// GET: Fetch all books
export async function GET() {
  try {
    return NextResponse.json(books); // Return all books as JSON
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ message: "Error fetching books", error: errorMessage }, { status: 500 });
  }
}

// POST: Add a new book
export async function POST(req: Request) {
  try {
    const newBook: Omit<Book, "id"> = await req.json(); // Parse incoming book data (without the 'id' field)
    
    // Generate a new ID by taking the highest current ID and adding 1
    const newId = books.length > 0 ? Math.max(...books.map((book) => book.id)) + 1 : 1;
    
    // Create the new book with the new ID
    const bookToAdd: Book = { ...newBook, id: newId };
    
    // Add the new book to the books array
    books.push(bookToAdd);
    
    return NextResponse.json(bookToAdd, { status: 201 }); // Return the newly added book with status 201 (Created)
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ message: "Failed to add book", error: errorMessage }, { status: 500 });
  }
}

// PUT: Update an existing book
export async function PUT(req: Request) {
  try {
    const { id, title, author, available, image }: Book = await req.json(); // Parse the updated book data
    const bookIndex = books.findIndex((book) => book.id === id); // Find the book by its ID

    if (bookIndex === -1) {
      return NextResponse.json({ message: "Book not found" }, { status: 404 }); // If the book doesn't exist
    }

    // Update the book's properties
    books[bookIndex] = { id, title, author, available, image };
    
    return NextResponse.json(books[bookIndex], { status: 200 }); // Return the updated book with status 200 (OK)
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ message: "Failed to update book", error: errorMessage }, { status: 500 });
  }
}

// DELETE: Delete a book by its ID
export async function DELETE(req: Request) {
  try {
    const { id }: { id: number } = await req.json(); // Parse the book ID to be deleted
    const bookIndex = books.findIndex((book) => book.id === id); // Find the book by its ID

    if (bookIndex === -1) {
      return NextResponse.json({ message: "Book not found" }, { status: 404 }); // If the book doesn't exist
    }

    // Remove the book from the array
    books.splice(bookIndex, 1);
    
    return NextResponse.json({ message: "Book deleted successfully" }, { status: 200 }); // Return success message
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ message: "Failed to delete book", error: errorMessage,}, { status: 500 });
  }
}
