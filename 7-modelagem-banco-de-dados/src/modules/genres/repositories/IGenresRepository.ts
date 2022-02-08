import { Genre } from '../entities/Genre';

export interface IGenresRepository {
  findByTitleContaining(title: string): Promise<Genre[]>;
}
