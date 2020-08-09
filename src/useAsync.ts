import { useEffect } from "react"
import { AsyncAction, AsyncStatus, UseAsync } from "./types"
import { useValue } from "@bytesoftio/use-value"

const defaultStatus: AsyncStatus<any> = { data: undefined, loading: false, error: undefined }

export const useAsync: UseAsync = <TData>(action, dependencies = [] as any) => {
  const [status, setStatus] = useValue({ ...defaultStatus, loading: true })

  const retry = async (newAction: AsyncAction<TData> = action) => {
    setStatus({ ...defaultStatus, loading: true })

    try {
      const data = await newAction()
      setStatus({ ...defaultStatus, data })
    } catch (error) {
      setStatus({ ...defaultStatus, error })
    }
  }

  useEffect(() => { retry(action) }, dependencies)

  return [status.data, status.loading, status.error, retry]
}
