export interface IResponseStructure<T> {
    success: boolean;
    message: string;
    data: T
}