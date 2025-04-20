interface Book {
    _id: string;
    title: string;
    caption: string;
    image: string;
    rating: number;
    user: User;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface BooksApiResponse {
    books: Book[];
    currentPage: number;
    totalBooks: number;
    totalPages: number;
}
