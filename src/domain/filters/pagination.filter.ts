/**
 * Base filter class for pagination functionality.
 * Provides common pagination properties and methods for all filter classes.
 */
export class PaginationFilter {
  /**
   * Number of records to skip (for pagination)
   */
  skip?: number = 0;

  /**
   * Number of records to take (for pagination)
   */
  take?: number = 10;

  constructor(partial?: Partial<PaginationFilter>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
