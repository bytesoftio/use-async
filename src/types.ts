export type AsyncStatus<T> = { data?: T, loading: boolean, error?: any }
export type AsyncStatusArray<T> = [T | undefined, boolean, any | undefined, (action?: AsyncAction<T>) => Promise<void>|void]
export type AsyncAction<T> = () => Promise<T> | T
export type UseAsync = <T>(action: AsyncAction<T>, dependencies?: any[]) => AsyncStatusArray<T>