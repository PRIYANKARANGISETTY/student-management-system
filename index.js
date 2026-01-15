import express from "express";
import fs from "fs";

const app = express();
const PORT = 3000;
const DB_FILE = "./db.json";

app.use(express.json());

// Helper function to read DB
const readDB = () => {
  const data = fs.readFileSync(DB_FILE, "utf-8");
  return JSON.parse(data);
};

// Helper function to write DB
const writeDB = (data) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// GET all students
app.get("/students", (req, res) => {
  const db = readDB();
  res.json(db.students);
});

// POST new student
app.post("/students", (req, res) => {
  const db = readDB();
  const newStudent = req.body;

  if (!newStudent.id || !newStudent.name) {
    return res.status(400).json({ message: "Invalid student data" });
  }

  db.students.push(newStudent);
  writeDB(db);

  res.status(201).json({ message: "Student added successfully" });
});

// PUT update student
app.put("/students", (req, res) => {
  const db = readDB();
  const { id } = req.body;

  const student = db.students.find((s) => s.id === id);
  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  Object.assign(student, req.body);
  writeDB(db);

  res.json({ message: "Student updated successfully" });
});

// DELETE student by id
app.delete("/students/:id", (req, res) => {
  const db = readDB();
  const id = Number(req.params.id);

  const index = db.students.findIndex((s) => s.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Student not found" });
  }

  db.students.splice(index, 1);
  writeDB(db);

  res.json({ message: "Student deleted successfully" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
