export class CoreApiResonseSchema<T> {
  public readonly code: number;
  public readonly message: string;
  public readonly data: NonNullable<T>;
  public readonly error: NonNullable<T>;

  constructor(code: number, message: string, data?: T, error?: T) {
    this.code = code;
    this.message = message;
    this.data = data;
    this.error = error;
  }

  public static success<T>(
    data?: T,
    message?: string,
  ): CoreApiResonseSchema<T> {
    return new CoreApiResonseSchema(200, message || 'Success', data);
  }

  public static error<T>(
    code?: number,
    message?: string,
    error?: T,
  ): CoreApiResonseSchema<T> {
    return new CoreApiResonseSchema(
      code || 500,
      message || 'Internal Server Error',
      undefined,
      error,
    );
  }
}
