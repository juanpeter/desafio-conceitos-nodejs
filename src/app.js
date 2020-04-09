const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

function validadeProjectId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({
      "error": "Invalid project id"
    })
  }
  return next();
}

app.use('/repositories/:id', validadeProjectId);
app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.send(repositories);
});

app.post("/repositories", (request, response) => {
  const { url, title, techs } = request.body;
  const likes = 0;

  if(!url || !title || !techs) {
    return response.status(400).json({"error": "You are missing one or more arguments for your repository"});
  }

  const repository = { id: uuid(), url, title, techs, likes};

  repositories.push(repository);

  return response.send(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { url, title, techs} = request.body;

  if (request.body.likes) {
    return response.status(400).json({"likes": 0});
  }

  if(!url || !title || !techs) {
    return response.status(400).json({"error": "You are missing one or more arguments for your repository"});
  }

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  const likes = repositories[repositoryIndex].likes;

  const repository = {
    id,
    url,
    title,
    techs,
    likes
  }

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  const repository = repositories[repositoryIndex]

  const likes = repositories[repositoryIndex].likes;

  repositories[repositoryIndex].likes = likes + 1;

  return response.json(repository);
});

module.exports = app;
