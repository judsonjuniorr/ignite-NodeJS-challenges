import { CreateUserUseCase } from './CreateUserUseCase'
import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository'
import { AppError } from '../../../../shared/errors/AppError';


let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create user test", () => {


  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
  })

  it("Should be able to create a new user", async () => {
    let newUser = {
      name: 'test sample',
      email: 'test@example.com',
      password: 'test'
    }
    await createUserUseCase.execute({
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
    })

    const userCreated = await inMemoryUsersRepository.findByEmail(newUser.email)
    expect(userCreated).toHaveProperty('id');
  })

  it("Should not be able to create a new user with an existing email", async () => {
    expect(async () => {
      let newUser = {
        name: 'test sample',
        email: 'test@example.com',
        password: 'test'
      }
      await createUserUseCase.execute({
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
      })
      await createUserUseCase.execute({
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
      })
    }).rejects.toBeInstanceOf(AppError)
  })
})
