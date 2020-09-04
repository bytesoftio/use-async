import { useEffect } from "react"
import { AsyncAction, AsyncHandle, UseAsync } from "./types"
import { useValue } from "@bytesoftio/use-value"

const defaultHandle: AsyncHandle<any> = { data: undefined, loading: false, error: undefined, reload: null as any }

export const useAsync: UseAsync = <TData>(action, dependencies = [] as any) => {
  const reload = async (newAction: AsyncAction<TData> = action) => {
    setHandle({ ...defaultHandle, loading: true })

    try {
      const data = await newAction()
      setHandle({ ...defaultHandle, data })
    } catch (error) {
      setHandle({ ...defaultHandle, error })
    }
  }

  const [handle, setHandle] = useValue({ ...defaultHandle, loading: true })

  useEffect(() => {
    reload(action)
  }, dependencies)

  return [handle.data, { ...handle, reload }]
}
