export const defer = () => {
  let internalResolve: (payload: any) => void
  let internalReject: (error: any) => void
  const promise = new Promise((resolve, reject) => {
    internalResolve = resolve
    internalReject = reject
  })
  return {
    promise,
    resolve: internalResolve,
    reject: internalReject
  }
}
