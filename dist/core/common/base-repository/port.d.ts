import { Optional } from '../type/CommonTypes';
export interface IBaseRepository<T, TFindByType> {
    create: (entity: T) => Promise<T>;
    update: (entity: T) => Promise<T>;
    delete: (id: string) => Promise<boolean>;
    find: (by: TFindByType) => Promise<Optional<T>>;
    findAll: () => Promise<T[]>;
}
