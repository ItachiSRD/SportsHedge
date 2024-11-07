export interface IErrorActionPayload {
    message: string;
    [key: string]: unknown;
}

export interface IReducerEntityState<T = undefined> {
  data: T;
  status?: 'loading' | 'error' | 'success';
  error?: IErrorActionPayload;
}