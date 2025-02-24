export class BaseFilterSchema {
  take: number;
  skip: number;
  constructor(take?: number, skip?: number) {
    this.take = take || 0;
    this.skip = skip || 0;
  }
}
