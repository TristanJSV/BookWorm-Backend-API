// [SECTION] Dependencies and Modules
const express = require("express");
const { verify, verifyAdmin } = require("../auth");
const bookController = require("../controllers/book");

// [SECTION] Routing Component
const router = express.Router();

// Route for adding/creating a book
router.post("/addBook", verify, bookController.addBook);

// Route for getting all books
router.get("/getAllBooks", bookController.getAllBooks);

// Route for getting a specific book
router.get("/getBook/:bookId", bookController.getBook);

// Route for getting all books created by a specific user
router.get("/getMyBook", verify, bookController.getMyBook);

// Route for updating a book
router.patch("/updateBook/:bookId", verify, bookController.updateBook);

router.patch("/addComment/:bookId", verify, bookController.addComment);

router.get("/getComments/:bookId", bookController.getComments);

// Route for deleting a book
router.delete("/deleteBook/:bookId", verify, verifyAdmin, bookController.deleteBook );

// Route for searching a book
router.get("/search", bookController.searchBooks); 


router.patch(
  "/deleteComment/:bookId/comments/:commentId",
  verify,
  verifyAdmin,
  bookController.deleteComment
);

module.exports = router;
