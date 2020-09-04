export type AsyncHandle<TResult> = { result?: TResult, loading: boolean, error?: any, reload: AsyncReload<TResult> }
export type AsyncAction<TResult> = () => Promise<TResult> | TResult
export type AsyncReload<TResult> = (action?: AsyncAction<TResult>) => Promise<void> | undefined
export type UseAsync = <TResult>(action: AsyncAction<TResult>, dependencies?: any[]) => AsyncHandle<TResult>
