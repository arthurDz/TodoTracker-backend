const express = require("express");
const verifyToken = require("../middlewares/verifyJWT");
const User = require("../models/user");
const Todo = require("../models/todo");

const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user?.userId).populate("todos");
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    res.json({ todos: user.todos });
  } catch (error) {
    res.status(500).json({ message: "Some error occured", error });
  }
});

router.get("/:date", verifyToken, async (req, res) => {
  try {
    const date = req.params.date;
    const userId = req.user?.userId;

    const user = await User.findById(userId).populate({
      path: "todos",
      match: {
        status: { $ne: "deleted" },
        createdAt: {
          $gte: new Date(`${date}T00:00:00.000Z`), // Start of the selected date
          $lte: new Date(`${date}T23:59:59.999Z`), // End of the selected date
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let todoObj = user.todos.reduce((acc, currentTodo) => {
      const dateKey = JSON.stringify(currentTodo.createdAt).substring(1, 11);

      if (!acc[dateKey]) {
        acc[dateKey] = []; // Initialize the array for each date if it doesn't exist
      }

      acc[dateKey].push(currentTodo); // Push the current todo to the corresponding date array
      return acc;
    }, {});

    res.json({ todos: todoObj });
  } catch (error) {
    res.status(500).json({ message: "Some error occured", error });
  }
});

router.post("/addTodo", verifyToken, async (req, res) => {
  const user = await User.findById(req.user?.userId);
  const { title, category, dueDate, description } = req.body;

  try {
    if (user) {
      const newTodo = new Todo({
        title,
        category,
        dueDate,
        description,
      });

      await newTodo.save();

      user?.todos.push(newTodo._id);
      await user.save();
      res.json({ message: "Todo added successfully", todo: newTodo });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Some error occured", error });
  }
});

router.patch("/statusChange/:todoId", verifyToken, async (req, res) => {
  const status = req.body?.status;
  try {
    const todoId = req.params.todoId;
    const updatedTodo = await Todo.findByIdAndUpdate(
      todoId,
      {
        status: status,
      },
      { new: true }
    );
    if (!updatedTodo) res.status(404).json({ message: "Todo not found" });
    res.json({
      message:
        status === "deleted"
          ? "Todo deleted successfully"
          : "Todo marked as completed",
      todo: updatedTodo,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Some error occured", error });
  }
});

// router.delete("/:todoId", verifyToken, async (req, res) => {
//   try {
//     const todoId = req.params.todoId;
//     await Todo.findByIdAndDelete(todoId, { new: true });
//     res.json({ message: "Todo deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Some error occured", error });
//   }
// });

module.exports = router;
