export type AsyncHandle<TData> = { data?: TData, loading: boolean, error?: any, retry: AsyncRetry<TData> }
export type AsyncStatusArray<TData> = [TData | undefined, AsyncHandle<TData>]
export type AsyncAction<TData> = () => Promise<TData> | TData
export type AsyncRetry<TData> = (action?: AsyncAction<TData>) => Promise<void> | undefined
export type UseAsync = <TData>(action: AsyncAction<TData>, dependencies?: any[]) => AsyncStatusArray<TData>
