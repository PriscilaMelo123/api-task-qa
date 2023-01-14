import { closeConnection } from "../../../../util/close-connection";
import { openConnection } from "../../../../util/open-connection";

import { UserRepository } from "../../../../../src/app/features/users/repositories/user.repository";
import { CreateUserUseCase } from "../../../../../src/app/features/users/usecases/create-user.usecase";
import { CacheRepository } from "../../../../../src/app/shared/repositories/cache.repository";
import { User } from "../../../../../src/app/models/user";

describe("Create user usecase tests", () => {
  beforeAll(async () => {
    await openConnection();
  });

  afterAll(async () => {
    await closeConnection();
  });

  beforeEach(() => {
    jest.restoreAllMocks();

    jest.spyOn(UserRepository.prototype, "get").mockResolvedValue(null);
  });

  const makeSut = () => {
    const sut = new CreateUserUseCase(
      new UserRepository(),
      new CacheRepository()
    );

    return sut;
  };

  //*? FINALIZADO
  test("deve retornar os dados de um novo user quando criar com sucesso", async () => {
    const sut = makeSut();

    const user = {
      name: "dev@teste.com",
      pass: "dev123",
    };

    jest
      .spyOn(UserRepository.prototype, "create")
      .mockResolvedValue(new User(user.name, user.pass));

    jest.spyOn(CacheRepository.prototype, "delete").mockResolvedValue();

    const result = await sut.execute(user);

    expect(result).not.toBeNull();
    expect(result).toBeDefined();
    expect(result).toHaveProperty("name", user.name);
    expect(result).toHaveProperty("pass", user.pass);
  });
});
