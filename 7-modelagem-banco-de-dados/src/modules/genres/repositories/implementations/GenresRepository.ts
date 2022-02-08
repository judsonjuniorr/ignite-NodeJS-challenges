import { getRepository, ILike, Repository } from 'typeorm';
import { Genre } from '../../entities/Genre';
import { IGenresRepository } from '../IGenresRepository';

export class GenresRepository implements IGenresRepository {
  private repository: Repository<Genre>;

  constructor() {
    this.repository = getRepository(Genre);
  }

  async findByTitleContaining(param: string): Promise<Genre[]> {
    return await this.repository.find({
      title: ILike(`%${param}%`)
    });
  }
}
