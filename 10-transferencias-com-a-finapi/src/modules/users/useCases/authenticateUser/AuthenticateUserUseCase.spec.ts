import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";



let usersRepositoryInMemory: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe('Authenticate user with email and password', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository

    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory)

    createUserUseCase = new CreateUserUseCase(
      usersRepositoryInMemory)

  })

  it('should be able to login with email and password', async () => {
    const user: ICreateUserDTO = {
      name: 'user test auth',
      email: 'test@example.com',
      password: 'password'
    }
    await createUserUseCase.execute(user)

    const authTest = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    })
    expect(authTest).toHaveProperty('token')
  })

  it('should not be able to login with an non existing user', async () => {
    expect(async () => {
      const authTest = await authenticateUserUseCase.execute({
        email: 'nonexistent@example.com',
        password: 'password'
      })
    }).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to login with an incorrect email', async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: 'user test auth',
        email: 'test@example.com',
        password: 'password'
      }
      await createUserUseCase.execute(user)

      const authTest = await authenticateUserUseCase.execute({
        email: 'incorrect@example.com',
        password: user.password
      })
    }).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to login with an incorrect password', async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: 'user test auth',
        email: 'test@example.com',
        password: 'password'
      }
      await createUserUseCase.execute(user)

      const authTest = await authenticateUserUseCase.execute({
        email: user.email,
        password: 'wrong password'
      })
    }).rejects.toBeInstanceOf(AppError)
  })
})
