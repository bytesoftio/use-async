# @bytesoftio/use-async

## Installation

`yarn add @bytesoftio/use-async` or `npm install @bytesoftio/use-async`

## Table of contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Description](#description)
- [useAsync](#useasync)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Description

A convenient hook to deal with async operations inside React components.

## useAsync

Function `useAsync` takes any other function that returns anything that can be *awaited* and returns its result as soon as the promise resolves. You also get some useful things like a `loading` indicator, the possible `error` that might have been thrown / or occurred through rejection and a `retry` function to rerun the async procedure.

```tsx
import React from "react"
import { useAsync } from "@bytesoftio/use-async"

const fetchCommodityPrice = (commodity: string) => {
  return new Promise<string>((resolve) => {
    setTimeout(() => resolve(`${commodity}: 1000$`), 3000)
  })
}

const Component = () => {
  const [price, handle] = useAsync(() => fetchCommodityPrice("gold"))

  if (handle.loading) {
    return <span>Loading...</span>
  }

  if (handle.error) {
    return <span>There was an error :(</span>
  }

  return (
    <div>
      <span>{price}</span>
      {/* reload commodity price */}
      <button onClick={() => handle.retry()}>reload</button>
      {/* fetch price for another commodity by replacing */}
      {/* the async action with a slightly different one */}
      <button onClick={() => handle.retry(() => fetchCommodityPrice("silver"))}>fetch price for silver</button>
    </div>
  )
}
```
