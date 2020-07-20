export type AsyncStatus<TData> = { data?: TData, loading: boolean, error?: any }
export type AsyncStatusArray<TData> = [TData | undefined, boolean, any | undefined, (action?: AsyncAction<TData>) => Promise<void>|void]
export type AsyncAction<TData> = () => Promise<TData> | TData
export type UseAsync = <TData>(action: AsyncAction<TData>, dependencies?: any[]) => AsyncStatusArray<TData>
