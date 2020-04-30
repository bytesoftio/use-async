import React from "react"
import { mount } from "enzyme"
import { useAsync } from "./index"
import { act } from "react-dom/test-utils"
import { createTimeout } from "@bytesoftio/helpers-promises"

describe("useAsync", () => {
  test("update state after promise resolves", async () => {
    let receivedResolve: any

    const promise = new Promise<string>((resolve) => {
      receivedResolve = resolve
    })

    let changes = 0
    const Test = () => {
      changes++
      const [data, loading, error, retry] = useAsync(() => promise)

      return (
        <h1>{loading ? "loading" : error ? error : data}</h1>
      )
    }

    const wrapper = mount(<Test/>)
    const target = () => wrapper.find("h1")

    expect(target().text()).toEqual("loading")
    expect(changes).toBe(1)

    await act(async () => receivedResolve("data"))

    await createTimeout(1000)

    expect(changes).toBe(2)
    expect(target().text()).toEqual("data")
  })

  test("update state after promise rejects", async () => {
    let receivedResolve: any
    let receivedReject: any
    const promise = new Promise<string>((resolve, reject) => {
      receivedResolve = resolve
      receivedReject = reject
    })

    let changes = 0

    const Test = () => {
      changes++
      const [data, loading, error, retry] = useAsync(() => promise)

      return (
        <h1>{loading ? "loading" : error ? error : data}</h1>
      )
    }

    const wrapper = mount(<Test/>)
    const target = () => wrapper.find("h1")

    expect(target().text()).toEqual("loading")
    expect(changes).toBe(1)

    await act(async () => receivedReject("error"))

    expect(changes).toBe(2)
    expect(target().text()).toEqual("error")
  })

  test("works without a promise", async () => {
    let changes = 0
    const Test = () => {
      changes++
      const [data, loading, error, retry] = useAsync(() => "data")

      return (
        <h1>{loading ? "loading" : error ? error : data}</h1>
      )
    }

    const wrapper = mount(<Test/>)
    const target = () => wrapper.find("h1")

    expect(target().text()).toEqual("loading")
    expect(changes).toBe(1)

    await act(async () => {
      await createTimeout(0)
    })

    expect(changes).toBe(2)
    expect(target().text()).toEqual("data")
  })

  test("it allows to retry a promise", async () => {
    let receivedResolve: any
    let receivedReject: any
    let retries = 0
    let receivedRetry: any

    const promise = () => {
      return new Promise<string>((resolve, reject) => {
        receivedResolve = () => {
          retries++

          resolve(`data${retries}`)
        }
        receivedReject = reject
      })
    }

    let changes = 0
    const Test = () => {
      changes++
      const [data, loading, error, retry] = useAsync(promise)
      receivedRetry = retry

      return (
        <h1>{loading ? "loading" : error ? error : data}</h1>
      )
    }

    const wrapper = mount(<Test/>)
    const target = () => wrapper.find("h1")

    expect(target().text()).toEqual("loading")
    expect(changes).toBe(1)

    await act(async () => receivedResolve())

    expect(changes).toBe(2)
    expect(target().text()).toEqual("data1")

    await act(async () => receivedRetry())

    expect(changes).toBe(3)
    expect(target().text()).toEqual("loading")

    await act(async () => receivedResolve())

    expect(changes).toBe(4)
    expect(target().text()).toEqual("data2")
  })

  test("it allows to retry a promise with new action", async () => {
    let receivedResolve: any
    let receivedReject: any
    let retries = 0
    let receivedRetry: any

    const promise1 = () => {
      return new Promise<string>((resolve, reject) => {
        receivedResolve = () => {
          retries++

          resolve(`data${retries}`)
        }
        receivedReject = reject
      })
    }

    const promise2 = () => {
      return new Promise<string>((resolve, reject) => {
        receivedResolve = () => {
          retries++

          resolve(`data-${retries}`)
        }
        receivedReject = reject
      })
    }

    let changes = 0
    const Test = () => {
      changes++
      const [data, loading, error, retry] = useAsync(promise1)
      receivedRetry = retry

      return (
        <h1>{loading ? "loading" : error ? error : data}</h1>
      )
    }

    const wrapper = mount(<Test/>)
    const target = () => wrapper.find("h1")

    expect(target().text()).toEqual("loading")
    expect(changes).toBe(1)

    await act(async () => receivedResolve())

    expect(changes).toBe(2)
    expect(target().text()).toEqual("data1")

    await act(async () => receivedRetry(promise2))

    expect(changes).toBe(3)
    expect(target().text()).toEqual("loading")

    await act(async () => receivedResolve())

    expect(changes).toBe(4)
    expect(target().text()).toEqual("data-2")
  })
})