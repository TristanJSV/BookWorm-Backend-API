const Book = require("../models/Book");
const User = require("../models/User");
const { errorHandler } = require("../auth");

const addBook = (req, res) => {
  const { title, author, isbn, genre } = req.body;
  const userId = req.user.id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      const newBook = new Book({
        title,
        author,
        isbn,
        genre,
        userId,
        username: user.username,
      });

      return newBook
        .save()
        .then((result) => res.status(201).send(result))
        .catch((error) => errorHandler(error, req, res));
    })
    .catch((error) => errorHandler(error, req, res));
};

const getAllBooks = (req, res) => {
  return Book.find()
    .then((result) => {
      return res.status(200).send(result);
    })
    .catch((error) => errorHandler(error, req, res));
};

const getBook = (req, res) => {
  return Book.findOne({ _id: req.params.bookId })
    .then((result) => {
      return res.status(200).send(result);
    })
    .catch((error) => errorHandler(error, req, res));
};

const getMyBook = (req, res) => {
  return Book.find({ userId: req.user.id })
    .then((result) => {
      if (!result.length) {
        return res
          .status(404)
          .send({ message: "No books found for this user." });
      }
      return res.status(200).send(result);
    })
    .catch((error) => errorHandler(error, req, res));
};

const updateBook = (req, res) => {
  let updatedBook = {
    title: req.body.title,
    author: req.body.author,
    isbn: req.body.isbn,
    genre: req.body.genre
  };

  return Book.findOneAndUpdate(
    { _id: req.params.bookId},
    updatedBook,
    { new: true }
  )
    .then((result) => {
      if (result) {
        return res.status(200).send({
          message: "Book updated successfully",
          updatedBook: result,
        });
      } else {
        return res.status(404).send({ error: "Book does not exist" });
      }
    })
    .catch((error) => {
      errorHandler(error, req, res);
    });
};

const addComment = (req, res) => {
  User.findById(req.user.id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      const newComment = {
        userId: req.user.id,
        username: user.username,
        comment: req.body.comment,
      };

      return Book.findByIdAndUpdate(
        req.params.bookId,
        { $push: { comments: newComment } },
        { new: true }
      )
        .then((result) => {
          if (!result) {
            return res.status(404).send({ message: "Book not found" });
          }
          return res.status(201).send(result);
        })
        .catch((error) => errorHandler(error, req, res));
    })

    .catch((error) => errorHandler(error, req, res));
};

const getComments = (req, res) => {
  return Book.findById(req.params.bookId, "comments")
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((error) => errorHandler(error, req, res));
};

const deleteBook = (req, res) => {
  return Book.findByIdAndDelete(req.params.bookId)
    .then((result) => {
      res.status(200).send({ message: "Book deleted successfully" });
    })
    .catch((error) => {
      errorHandler(error, req, res);
    });
};

const deleteComment = (req, res) => {
  return Book.findByIdAndUpdate(
    req.params.bookId,
    { $pull: { comments: { _id: req.params.commentId } } },
    { new: true }
  )
    .then((result) => {
      return res.status(200).send({ message: "Comment deleted successfully" });
    })
    .catch((error) => {
      errorHandler(error, req, res);
    });
};

const searchBooks = async (req, res) => {
  try {
    const { title, author } = req.query; // Get search parameters

    let filter = {};

    if (title) {
      filter.title = { $regex: title, $options: "i" }; // Case-insensitive search
    }

    if (author) {
      filter.author = { $regex: author, $options: "i" };
    }

    const books = await Book.find(filter); // Fetch books matching search criteria

    if (books.length === 0) {
      return res.status(404).json({ message: "No books found." });
    }

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


module.exports = {
  addBook,
  getAllBooks,
  getBook,
  addComment,
  getComments,
  deleteBook,
  deleteComment,
  updateBook,
  getMyBook,
  searchBooks
};
