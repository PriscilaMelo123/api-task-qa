import { closeConnection } from "../../../../util/close-connection";
import { openConnection } from "../../../../util/open-connection";
import { LoginUserUseCase } from "../../../../../src/app/features/users/usecases/login-user.usecase";
import { UserRepository } from "../../../../../src/app/features/users/repositories/user.repository";
import { CacheRepository } from "../../../../../src/app/shared/repositories/cache.repository";
import { User } from "../../../../../src/app/models/user";

describe("Login user usecase test", () => {
  beforeAll(async () => {
    await openConnection();
  });

  afterAll(async () => {
    await closeConnection();
  });

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  const makeSut = () => {
    const sut = new LoginUserUseCase(
      new UserRepository(),
      new CacheRepository()
    );
    return sut;
  };

  //*? FINALIZADO
  test("deve retornar um user valido se o id existir", async () => {
    const sut = makeSut();

    const userDTO = {
      name: "dev@teste.com",
      pass: "dev123",
    };
    const user = new User(userDTO.name, userDTO.pass);
    jest.spyOn(UserRepository.prototype, "get").mockResolvedValue(user);
    jest.spyOn(CacheRepository.prototype, "get").mockResolvedValue(null);

    const result = await sut.execute(user);

    expect(result).not.toBeNull();
    expect(result.name).toBe(user.name);
    expect(result).toBeDefined();
    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("name", user.name);
    expect(result).toHaveProperty("pass", user.pass);
  });

  //*? FINALIZADO
  test("deve retornar null quando o user não existe", async () => {
    const sut = makeSut();

    jest.spyOn(CacheRepository.prototype, "get").mockResolvedValue(null);
    jest.spyOn(UserRepository.prototype, "get").mockResolvedValue(null);

    const result = await sut.execute("fbc2572a-c0d2-4580-a54a-ab5b860f2695");
    expect(result).toBeNull();
  });

  //*? FINALIZADO
  test("deve retornar um user caso esteja em cache", async () => {
    const sut = makeSut();
    const user = new User("dev@teste.com", "dev123");
    jest
      .spyOn(CacheRepository.prototype, "get")
      .mockResolvedValue(user.toJson());

    const result = await sut.execute(user.id);

    expect(result).not.toBeNull();
    expect(result).toHaveProperty("id");
    expect(result.id).toBe(user.id);
  });
});
