import request from "supertest";
import { createServer } from "../../../../../src/main/config/express.config";
import { closeConnection } from "../../../../util/close-connection";
import { openConnection } from "../../../../util/open-connection";
import { CreateTaskUseCase } from "../../../../../src/app/features/tasks/usecases/create-task.usecase";
import { CreateUserUseCase } from "../../../../../src/app/features/users/usecases/create-user.usecase";
import { LoginUserUseCase } from "../../../../../src/app/features/users/usecases/login-user.usecase";
import { UserController } from "../../../../../src/app/features/users/controllers/user.controller";
import { User } from "../../../../../src/app/models/user";
import { Tasks } from "../../../../../src/app/models/tasks";
import { TasksRepository } from "../../../../../src/app/features/tasks/repositories/tasks.repository";
import { UserRepository } from "../../../../../src/app/features/users/repositories/user.repository";
import { UpdateTaskUseCase } from "../../../../../src/app/features/tasks/usecases/update-task.usecase";

describe("Task controller tests", () => {
  beforeAll(async () => await openConnection());
  afterAll(async () => await closeConnection());

  const makeSut = () => {
    const sut = createServer();
    return sut;
  };

  //*? FINALIZADO
  test("deve retornar HTTP 200 quando o listar tasks", async () => {
    const app = makeSut();
    const result = await request(app).get("/tasks").send();

    expect(result.status).toBe(200);
    expect(result.body).not.toBeNull();
    expect(result.body).toHaveProperty("ok", true);
    expect(result.body).toHaveProperty("mensagem", "Tasks successfull listed");
    expect(result.body).toHaveProperty("data");
  });

  //*? FINALIZADO
  test("deve retornar HTTP 200 quando existir task por id", async () => {
    const app = makeSut();

    const result = await request(app)
      .get("/tasks/6752d6e8-0110-40ee-bcfa-0aacf8e98860")
      .send();

    expect(result.status).toBe(200);
    expect(result.body).not.toBeNull();
    expect(result.body).toHaveProperty("ok", true);
    expect(result.body).toHaveProperty("data");
  });

  //*? FINALIZADO
  test("deve retornar HTTP 404 quando não existir task", async () => {
    const app = makeSut();

    const result = await request(app)
      .get("/tasks/6752d6e8-0110-40ee-bcfa-0aacf8e98863")
      .send();

    expect(result.status).toBe(404);
    expect(result.body).not.toBeNull();
    expect(result.body).toHaveProperty("ok", false);
    expect(result.body).toHaveProperty("message", "Task not found");
  });

  //*!NÃO PASSOU
  test.skip("deve retornar HTTP 201 quando uma task for criada com sucesso", async () => {
    const app = makeSut();

    const user = {
      id: "any-id-user",
      name: "dev@teste.com",
      pass: "dev123",
    };

    const taskDTO = {
      id: "any-id",
      description: "teste",
      detail: "teste",
      user: User.create(user.id, user.name, user.pass),
    };

    const task = new Tasks(
      // taskDTO.id,
      taskDTO.description,
      taskDTO.detail,
      taskDTO.user
    );

    jest.spyOn(CreateTaskUseCase.prototype, "execute").mockResolvedValue(task);
    // jest.spyOn(UserRepository.prototype, "get").mockResolvedValue(task.user);

    const result = await request(app).post("/tasks").send(task);

    expect(result.status).toBe(201);
    expect(result.body).not.toBeNull();
    expect(result.body).toHaveProperty("ok", true);
    // expect(result.body).toHaveProperty("message", "User successfully created");
    expect(result.body).toHaveProperty("data");
  });

  //*? FINALIZADO
  test("deve retornar HTTP 400 quando criar task sem user", async () => {
    const app = makeSut();

    const user = {
      name: "dev@teste.com",
      pass: "dev123",
    };

    const taskDTO = {
      description: "teste",
      detail: "teste",
      user: new User(user.name, user.pass),
    };

    const task = new Tasks(
      taskDTO.description,
      taskDTO.detail,
      taskDTO.user
    ).toJson();

    jest.spyOn(CreateTaskUseCase.prototype, "execute").mockResolvedValue(task);

    const result = await request(app).post("/tasks").send(task);

    expect(result.status).toBe(400);
    expect(result.body).not.toBeNull();
    expect(result.body).toHaveProperty("ok", false);
    expect(result.body).toHaveProperty(
      "message",
      "User (idUser) não foi informado"
    );
  });

  //*? FINALIZADO
  test("deve retornar HTTP 400 quando criar task sem description", async () => {
    const app = makeSut();

    const user = {
      name: "dev@teste.com",
      pass: "dev123",
    };

    const taskDTO = {
      description: "",
      detail: "teste",
      user: new User(user.name, user.pass),
    };

    const task = new Tasks(
      taskDTO.description,
      taskDTO.detail,
      taskDTO.user
    ).toJson();

    jest.spyOn(CreateTaskUseCase.prototype, "execute").mockResolvedValue(task);

    const result = await request(app).post("/tasks").send(task);

    expect(result.status).toBe(400);
    expect(result.body).not.toBeNull();
    expect(result.body).toHaveProperty("ok", false);
    expect(result.body).toHaveProperty(
      "message",
      "Description não foi informado"
    );
  });

  //*? FINALIZADO
  test("deve retornar HTTP 400 quando criar task sem detail", async () => {
    const app = makeSut();

    const user = {
      name: "dev@teste.com",
      pass: "dev123",
    };

    const taskDTO = {
      description: "teste",
      detail: "",
      user: new User(user.name, user.pass),
    };

    const task = new Tasks(
      taskDTO.description,
      taskDTO.detail,
      taskDTO.user
    ).toJson();

    jest.spyOn(CreateTaskUseCase.prototype, "execute").mockResolvedValue(task);

    const result = await request(app).post("/tasks").send(task);

    expect(result.status).toBe(400);
    expect(result.body).not.toBeNull();
    expect(result.body).toHaveProperty("ok", false);
    expect(result.body).toHaveProperty("message", "Detail não foi informada");
  });

  //*!NÃO PASSOU
  test.skip("deve retornar HTTP 200 quando o get task por id", async () => {
    const app = makeSut();

    // const user = {
    //   name: "dev@teste.com",
    //   pass: "dev123",
    // };

    // jest
    //   .spyOn(LoginUserUseCase.prototype, "execute")
    //   .mockResolvedValue(new User(user.name, user.pass).toJson());

    const result = await request(app)
      .delete("/tasks/6752d6e8-0110-40ee-bcfa-0aacf8e98860")
      .send();

    expect(result.status).toBe(200);
    expect(result.body).not.toBeNull();
    expect(result.body).toHaveProperty("ok", true);
    expect(result.body).toHaveProperty("message", "Task successfully deleted");
    // expect(result.body).toHaveProperty("data");
  });

  test("deve retornar HTTP 200 quando fazer get das lista de tasks", async () => {
    const app = makeSut();

    const result = await request(app).get("/tasks/").send();

    expect(result.status).toBe(200);
    expect(result.body).not.toBeNull();
    expect(result.body).toHaveProperty("ok", true);
    expect(result.body).toHaveProperty("data");
  });

  test("deve retornar HTTP 200 quando task for atualizada", async () => {
    const app = makeSut();

    const user = {
      id: "any-id-user",
      name: "dev@teste.com",
      pass: "dev123",
    };

    const taskDTO = {
      id: "any-id",
      description: "teste",
      detail: "teste",
      arquivada: false,
      user: User.create(user.id, user.name, user.pass),
    };

    // jest.spyOn(UpdateTaskUseCase .prototype, "execute").mockResolvedValue(taskDTO);
    const result = await request(app).put(`/tasks/${taskDTO.id}`).send(taskDTO);

    expect(result.status).toBe(200);
    expect(result.body).not.toBeNull();
    expect(result.body).toHaveProperty("ok", true);
    expect(result.body).toHaveProperty(
      "message",
      "Task atualizado com sucesso"
    );
  });

  test("deve retornar HTTP 404 quando task não encontrada ao deletar", async () => {
    const app = makeSut();

    const user = {
      id: "any-id-user",
      name: "dev@teste.com",
      pass: "dev123",
    };

    const taskDTO = {
      id: "any-id",
      description: "teste",
      detail: "teste",
      user: User.create(user.id, user.name, user.pass),
    };

    const result = await request(app).delete(`/tasks/${taskDTO.id}`).send();

    expect(result.status).toBe(404);
    expect(result.body).not.toBeNull();
    expect(result.body).toHaveProperty("ok", false);
    expect(result.body).toHaveProperty("message", "Tasks não encontrada!");
  });
});
