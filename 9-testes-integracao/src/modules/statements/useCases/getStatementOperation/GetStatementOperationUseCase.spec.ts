import 'reflect-metadata'
import { GetStatementOperationUseCase } from './GetStatementOperationUseCase';

import { IUsersRepository } from '../../../users/repositories/IUsersRepository';
import { IStatementsRepository } from '../../repositories/IStatementsRepository';
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';

import { User } from '../../../users/entities/User';
import { OperationType, Statement } from '../../entities/Statement';
import { GetStatementOperationError } from "./GetStatementOperationError";


let usersRepository: IUsersRepository;
let statementRepository: IStatementsRepository;

let getStatementOperationUseCase: GetStatementOperationUseCase;

describe('Get Statement operation', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementRepository = new InMemoryStatementsRepository();

    getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepository, statementRepository);
  });
  it('Should be able to get a statement operation', async () => {
    const user: User = await usersRepository.create({
      name: 'user test',
      email: 'test@example.com',
      password: 'test'
    })

    if (user.id != undefined) {
      const statement: Statement = await statementRepository.create({
        user_id: user.id,
        type: OperationType.DEPOSIT,
        amount: 1000,
        description: 'test'
      });
      if (statement.id != undefined) {
        const operationStatement = await getStatementOperationUseCase.execute({
          user_id: user.id,
          statement_id: statement.id,
        })
        expect(operationStatement).toBe(statement)
      }
    }


  })
  it('Should not be able to get a statement operation with non existent statement', async () => {
    const statement: Statement = await statementRepository.create({
      user_id: 'no user',
      type: OperationType.DEPOSIT,
      amount: 1,
      description: 'test operation statement'
    })
    if (statement.id != undefined) {
      await expect(getStatementOperationUseCase.execute({
        user_id: 'no-user',
        statement_id: statement.id
      })).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
    }
  })
  it('should not be able to get a statement operation without a statement id', async () => {
    const user: User = await usersRepository.create({
      name: 'user test',
      email: 'test@example.com',
      password: 'password'
    })
    if (user.id != undefined) {
      expect(getStatementOperationUseCase.execute({
        user_id: user.id,
        statement_id: 'not valid'
      })).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
    }
  })
})
