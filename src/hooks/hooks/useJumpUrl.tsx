import { useState, useEffect, useContext } from 'react'
import GStore from '@/store/index' // 假设你已经有一个类似的 React 状态管理工具

/**
 * 自定义 Hook，用于根据环境和模块类型生成对应的跳转 URL。
 * @param {string} moduleType - 模块类型，例如 'hrostaff' 或 'hrmv3'。
 * @returns {string} - 根据当前环境和模块类型生成的跳转 URL。
 */
const useJumpUrl = (moduleType: string): string => {
  const store = useContext(GStore)
  const [jumpUrl, setJumpUrl] = useState<string>('')

  useEffect(() => {
    const environment = store?.userData?.env

    const baseUrl =
      environment === 'formal'
        ? // 如果是 'xunhoujiesuan' 模块,需要特殊处理
          moduleType === 'xunhoujiesuan'
          ? 'https://settle.xunhou.cn/index.html#'
          : `https://common.xunhou.cn/${moduleType}/index.html#`
        : `https://xbbtest.xbanban.com/fe-${moduleType}-pc-${environment}/index.html#`
    setJumpUrl(baseUrl)
  }, [moduleType, store?.userData?.env])

  return jumpUrl
}

export default useJumpUrl
