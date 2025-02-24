export abstract class IBaseUseCase<TUseCaseInputData, TUseCaseResult> {
  abstract execute(data?: TUseCaseInputData): Promise<TUseCaseResult>;
}
