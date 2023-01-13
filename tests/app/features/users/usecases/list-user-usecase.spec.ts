import { CacheRepository } from "../../../../../src/app/shared/repositories/cache.repository";
import { closeConnection } from "../../../../util/close-connection";
import { openConnection } from "../../../../util/open-connection";
import { ListUsersUseCase } from "../../../../../src/app/features/users/usecases/list-users.usecase";
import { UserRepository } from "../../../../../src/app/features/users/repositories/user.repository";
import { User } from "../../../../../src/app/models/user";

describe.skip("Get user usecase teste", () => {
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
    const sut = new ListUsersUseCase(
      new UserRepository(),
      new CacheRepository()
    );

    return sut;
  };

  //*? FINALIZADO -- acredito que seja teste de integração
  test("deve retornar uma lista de users do DB", async () => {
    const sut = makeSut();

    // jest.spyOn(UserRepository.prototype, "get").mockResolvedValue(null);
    jest.spyOn(CacheRepository.prototype, "get").mockResolvedValue(null);

    const result = await sut.execute();

    expect(result).not.toBeNull();
    expect(typeof result).toBe("object");
  });

  //*? FINALIZADO
  test("deve retornar uma lista de user caso esteja em cache", async () => {
    const sut = makeSut();

    const user = new User("nome@teste.com", "1234");
    jest
      .spyOn(CacheRepository.prototype, "get")
      .mockResolvedValue(user.toJson());

    const result = await sut.execute();

    expect(result).not.toBeNull();
    expect(typeof result).toBe("object");
    expect(result.id).toBe(user.id);
  });
});
