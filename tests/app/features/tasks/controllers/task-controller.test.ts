import { closeConnection } from "../../../../util/close-connection";
import { openConnection } from "../../../../util/open-connection";
import { createServer } from "../../../../../src/main/config/express.config";
import request from "supertest";
import { DatabaseConnection } from "../../../../../src/main/database/typeorm.connection";
import { UserEntity } from "../../../../../src/app/shared/entities/user.entity";
import { TasksEntity } from "../../../../../src/app/shared/entities/tasks.entity";
import { User } from "../../../../../src/app/models/user";
import { Tasks } from "../../../../../src/app/models/tasks";
import { UserRepository } from "../../../../../src/app/features/users/repositories/user.repository";
import { TasksRepository } from "../../../../../src/app/features/tasks/repositories/tasks.repository";

describe("Get task by id - integration controller test", () => {
  beforeAll(async () => await openConnection());
  afterAll(async () => await closeConnection());

  const makeSut = () => {
    const sut = createServer();
    return sut;
  };

  beforeEach(async () => {
    const manager = DatabaseConnection.connection.manager;
    await manager.clear(TasksEntity);
  });

  const createTask = async () => {
    const user = new User("dev@teste.com", "dev123");
    const task = new Tasks("new test", "new test", user);

    const taskRepository = new TasksRepository();
    await taskRepository.create(task);

    return task;
  };

  //*!FALHOU
  test.skip("deve retornar 200 se existir lista de tasks", async () => {
    const app = makeSut();
    const task = await createTask();
    const result = await request(app).get("/tasks/").send();

    expect(result).not.toBeNull();
    expect(result.statusCode).toEqual(200);
    expect(result).toHaveProperty("body.ok", true);
  });

  //*!FALHOU
  test.skip("deve retornar 200 se o task existir", async () => {
    const app = makeSut();
    const task = await createTask();
    const result = await request(app)
      .get("/tasks/" + task.id)
      .send();

    expect(result).not.toBeNull();
    expect(result.statusCode).toEqual(200);
    expect(result).toHaveProperty("body.ok", true);
  });

  //*? FINALIZADO
  test("deve retornar 404 se o task não existir id", async () => {
    const app = makeSut();
    const result = await request(app).get("/tasks/abc").send();

    expect(result).not.toBeNull();
    expect(result.statusCode).toEqual(404);
    expect(result).toHaveProperty("body.ok", false);
  });

  //*? FINALIZADO
  test("deve retornar 404 quando criar um task e não existir user", async () => {
    const app = makeSut();
    const user = new User("dev@teste.com", "dev123");
    const result = await request(app).post("/tasks/").send({
      id: "any-id",
      description: "new test",
      detail: "new test",
      idUser: user.id,
    });

    expect(result).not.toBeNull();
    expect(result.status).toEqual(404);
    expect(result).toHaveProperty("body.ok", false);
    expect(result).toHaveProperty("body.message", "User não existe");
  });

  //*? FINALIZADO
  test("deve retornar 400 se não passar description ao criar task", async () => {
    const app = makeSut();
    const user = new User("dev@teste.com", "dev123");
    const result = await request(app).post("/tasks/").send({
      id: "any-id",
      description: "",
      detail: "new test",
      idUser: user.id,
    });

    expect(result).not.toBeNull();
    expect(result.status).toEqual(400);
    expect(result).toHaveProperty("body.ok", false);
  });

  //*? FINALIZADO
  test("deve retornar 400 se não passar detail ao criar task", async () => {
    const app = makeSut();
    const user = new User("dev@teste.com", "dev123");
    const result = await request(app).post("/tasks/").send({
      id: "any-id",
      description: "new test",
      detail: "",
      idUser: user.id,
    });

    expect(result).not.toBeNull();
    expect(result.status).toEqual(400);
    expect(result).toHaveProperty("body.ok", false);
  });

  //*? FINALIZADO
  test("deve retornar 400 se não passar detail ao criar task", async () => {
    const app = makeSut();
    const user = new User("dev@teste.com", "dev123");
    const result = await request(app).post("/tasks/").send({
      id: "any-id",
      description: "new test",
      detail: "new test",
      idUser: "",
    });

    expect(result).not.toBeNull();
    expect(result.status).toEqual(400);
    expect(result).toHaveProperty("body.ok", false);
  });

  //*!FALHOU
  test("deve retornar 404 se o task não existir", async () => {
    const app = makeSut();
    const user = new User("dev@teste.com", "dev123");
    const task = new Tasks("new test", "new test", user);
    const result = await request(app)
      .delete("/tasks/" + task.id)
      .send();

    expect(result).not.toBeNull();
    expect(result.statusCode).toEqual(404);
    expect(result).toHaveProperty("body.ok", false);
  });
});
