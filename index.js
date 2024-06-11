const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static("dist"));
// app.use(morgan("tiny"));
morgan.token("req-body", (req) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  }
  return "";
});

//Middle for logging with custom format
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :req-body"
  )
);
let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
  {
    id: 5,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const generateId = () => {
  const maxId =
    persons.length > 0 ? Math.floor(Math.random() * (100 - 5 + 1) + 5) : 0;
  return maxId + 1;
};

app.get("/api/persons", (request, response) => {
  response.send(persons);
});

app.get("/info", (request, response) => {
  response.send(
    `Phonebook has info for ${persons.length} people. <br> ${Date()}`
  );
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (!person) {
    response.status(404).send(`Person with id:${id} is not found`);
  } else {
    response.status(200).send(person);
  }
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  body.id = generateId();
  if (!body.name || !body.number) {
    response.status(404).json({ error: "name or number is missing" });
  }

  const existingName = persons.find((person) => person.name === body.name);
  if (existingName) {
    response.status(400).json({ error: "name must be unique" });
  }
  persons = persons.concat(body);
  response.send(persons);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  let deletedPerson = persons.filter((person) => person.id !== id);
  response.send(deletedPerson);
});

app.listen(PORT, () => {
  console.log("Server is running succesfully!");
});
