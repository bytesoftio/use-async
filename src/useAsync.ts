import { useCallback, useEffect, useState } from "react"
import { AsyncAction, AsyncCancel, AsyncReload, AsyncStatus, UseAsync } from "./types"

const createAsyncStatus = <TResult = any>(status: Partial<AsyncStatus<TResult>> = {}): AsyncStatus<TResult> => {
  return {
    loading: false,
    cancelled: false,
    errored: false,
    result: undefined,
    error: undefined,
    ...status,
  }
}

// todo: switch to state machine :)
export const useAsync: UseAsync = <TData>(action, dependencies = [] as any) => {
  const [status, setStatus] = useState(createAsyncStatus({ loading: true }))

  const reload: AsyncReload<TData> = useCallback(async (newAction: AsyncAction<TData> = action) => {
    setStatus(createAsyncStatus({ loading: true }))

    try {
      const result = await newAction()

      setStatus(status => {
        if (status.cancelled || ! status.loading) {
          return status
        }

        return createAsyncStatus({
          result: result,
        })
      })

    } catch (error) {
      setStatus(createAsyncStatus({
        errored: true,
        error: error,
      }))
    }
  }, [action])

  const cancel: AsyncCancel = useCallback(() => {
    setStatus(status => {
      if ( ! status.loading || status.cancelled) {
        return status
      }

      return createAsyncStatus({
        cancelled: true,
      })
    })
  }, [])

  const resolve = useCallback((result: TData) => {
    setStatus(createAsyncStatus({
        result: result,
      }),
    )
  }, [])

  useEffect(() => {
    reload(action)
  }, dependencies)

  return {
    ...status,
    cancel,
    reload,
    resolve,
  }
}
