import { each } from './array'
import { isFn } from './types'

type Subscriber = (notification: any) => void

type Filter = (payload: any, subscription: any) => any

export class Broadcast {
  private entries = []
  private buffer = []
  private length: number

  public subscribe(subscriber: Subscriber, subscription: any) {
    if (!isFn(subscriber)) {
      return () => ({})
    }
    const index = this.entries.length
    this.entries.push({
      subscriber,
      subscription
    })
    this.flushBuffer(this.entries[index])
    return () => {
      this.entries.splice(index, 1)
    }
  }

  public unsubscribe() {
    this.entries.length = 0
    this.buffer.length = 0
  }

  public flushBuffer({ subscriber, subscription }) {
    each(this.buffer, ({ payload, filter }) => {
      if (isFn(filter)) {
        let notification: any
        if (filter(payload, subscription)) {
          notification = filter(payload, subscription)
          subscriber(notification)
        }
      } else {
        subscriber(payload, subscription)
      }
    })
  }

  public notify(payload: any, filter: Filter) {
    if (this.length === 0) {
      this.buffer.push({ payload, filter })
      return
    }
    each(this.entries, ({ subscriber, subscription }) => {
      if (isFn(filter)) {
        let notification: any
        if (filter(payload, subscription)) {
          notification = filter(payload, subscription)
          subscriber(notification)
        }
      } else {
        subscriber(payload, subscription)
      }
    })
    this.buffer.length = 0
  }
}
