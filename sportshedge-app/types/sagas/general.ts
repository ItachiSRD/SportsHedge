export interface ISagaAction {
    type: string;
    payload: unknown;
}