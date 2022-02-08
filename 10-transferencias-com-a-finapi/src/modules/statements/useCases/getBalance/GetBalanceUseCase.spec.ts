import { OperationType } from '../../entities/Statement';

import { User } from '../../../users/entities/User';
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from './GetBalanceUseCase';
import { IUsersRepository } from '../../../users/repositories/IUsersRepository';
import { IStatementsRepository } from '../../repositories/IStatementsRepository';
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';

let getBalanceUseCase: GetBalanceUseCase;
let usersRepository: IUsersRepository;
let statementRepository: IStatementsRepository;

describe('Get Balance Use Case', () => {

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementRepository = new InMemoryStatementsRepository();

    getBalanceUseCase = new GetBalanceUseCase(
      statementRepository,
      usersRepository
    );
  });

  it('should be able to show users balance', async () => {
    const user: User = await usersRepository.create({
      name: 'balance test',
      email: 'test@example.com',
      password: 'test'
    });

    if (user.id != undefined) {
      const statement = await statementRepository.create({
        user_id: user.id,
        type: OperationType.DEPOSIT,
        amount: 1000,
        description: 'statment n 1'
      });

      const statement2 = await statementRepository.create({
        user_id: user.id,
        type: OperationType.DEPOSIT,
        amount: 1000,
        description: 'statement n 2'
      });

      const statement3 = await statementRepository.create({
        user_id: user.id,
        type: OperationType.WITHDRAW,
        amount: 500,
        description: 'statement n 3'
      });

      const userBalance = await getBalanceUseCase.execute({ user_id: user.id })
      expect(userBalance).toStrictEqual({
        statement: expect.arrayContaining([statement, statement2, statement3]),
        balance: 1500
      })
    }
  })
  it('Should not be able to list a balance with a non existing user', async () => {
    await expect(getBalanceUseCase.execute({
      user_id: 'non existent user',
    })).rejects.toBeInstanceOf(GetBalanceError)
  })

});
