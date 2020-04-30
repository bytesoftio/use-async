import { useEffect } from "react"
import { AsyncAction, AsyncStatus, UseAsync } from "./types"
import { useValue } from "@bytesoftio/use-value"

const defaultStatus: AsyncStatus<any> = { data: undefined, loading: false, error: undefined }

export const useAsync: UseAsync = <T>(action, dependencies = [] as any) => {
  const [status, setStatus] = useValue({ ...defaultStatus, loading: true })

  const retry = (newAction: AsyncAction<T> = action) => {
    setStatus({ ...defaultStatus, loading: true })

    Promise.resolve(newAction())
      .then((data) => {
        setStatus({ ...defaultStatus, data })
      })
      .catch((error) => {
        setStatus({ ...defaultStatus, error })

        return error
      })
  }

  useEffect(() => { retry(action) }, dependencies)

  return [status.data, status.loading, status.error, retry]
}