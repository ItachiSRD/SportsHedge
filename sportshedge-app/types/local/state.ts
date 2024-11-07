export interface IFetchState {
    status: 'init' | 'pending' | 'failed' | 'success';
    message?: string;
}