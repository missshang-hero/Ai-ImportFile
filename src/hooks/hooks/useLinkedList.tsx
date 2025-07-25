import { useState, useCallback, useEffect } from 'react'

// 链表节点
export class ListNode<T> {
  data: T // 存储节点数据
  next: ListNode<T> | null = null // 指向下一个节点

  constructor(data: T) {
    this.data = data
  }
}

// 通用链表
class LinkedList<T> {
  head: ListNode<T> | null = null // 链表的头节点

  // 添加节点到链表的末尾
  addNode(data: T): void {
    const newNode = new ListNode(data)
    if (!this.head) {
      this.head = newNode
    } else {
      let current = this.head
      while (current.next) {
        current = current.next
      }
      current.next = newNode
    }
  }

  // 根据条件查找节点
  findNode(predicate: (data: T) => boolean): ListNode<T> | null {
    let current = this.head
    while (current) {
      if (predicate(current.data)) {
        return current
      }
      current = current.next
    }
    return null
  }

  // 查找下一个节点
  findNextNode(node: ListNode<T>): ListNode<T> | null {
    return node.next
  }

  // 根据条件删除节点
  removeNode(predicate: (data: T) => boolean): boolean {
    if (!this.head) {
      return false
    }

    if (predicate(this.head.data)) {
      this.head = this.head.next
      return true
    }

    let current = this.head
    while (current.next && !predicate(current.next.data)) {
      current = current.next
    }

    if (current.next) {
      current.next = current.next.next
      return true
    }

    return false
  }

  // 克隆链表
  clone(): LinkedList<T> {
    const newList = new LinkedList<T>()
    let current = this.head
    while (current) {
      newList.addNode(current.data)
      current = current.next
    }
    return newList
  }
}

// React Hook
function useLinkedList<T>(initialData: T[]) {
  // 初始化链表
  const [linkedList, setLinkedList] = useState(() => {
    const list = new LinkedList<T>()
    initialData.forEach((item) => list.addNode(item))
    return list
  })

  // 当初始数据发生变化时，重新初始化链表
  useEffect(() => {
    const list = new LinkedList<T>()
    initialData.forEach((item) => list.addNode(item))
    setLinkedList(list)
  }, [initialData])

  // 添加节点的回调函数
  const addNode = useCallback((data: T) => {
    setLinkedList((prevList) => {
      const newList = prevList.clone()
      newList.addNode(data)
      return newList
    })
  }, [])

  // 查找节点的回调函数
  const findNode = useCallback(
    (predicate: (data: T) => boolean): ListNode<T> | null => {
      return linkedList.findNode(predicate)
    },
    [linkedList]
  )

  // 查找下一个节点的回调函数
  const findNextNode = useCallback(
    (node: ListNode<T>): ListNode<T> | null => {
      return linkedList.findNextNode(node)
    },
    [linkedList]
  )

  // 删除节点的回调函数
  const removeNode = useCallback(
    (predicate: (data: T) => boolean): boolean => {
      setLinkedList((prevList) => {
        const newList = prevList.clone()
        const result = newList.removeNode(predicate)
        return result ? newList : prevList
      })
      return linkedList.removeNode(predicate)
    },
    [linkedList]
  )

  return { addNode, findNode, findNextNode, removeNode, linkedList }
}

export default useLinkedList
