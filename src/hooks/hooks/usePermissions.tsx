import { uniq } from 'lodash'
import { useState, useEffect } from 'react'
import { getBtnFunctions } from '@/store/service'

interface IUsePermissionsResult {
  permissions: string[] | null
  loading: boolean
  error: string | null
}

/**
 * 自定制的 React hook，用于获取和管理特定应用 ID 的权限。
 *
 * @param appId - 要获取权限的应用 ID。
 * @returns 包含权限、加载状态和错误状态的对象。
 */
function usePermissions(appId: string | number): IUsePermissionsResult {
  /**
   * 状态变量，用于存储获取到的权限。
   */
  const [permissions, setPermissions] = useState<string[]>([])

  /**
   * 状态变量，用于指示是否正在获取数据。
   */
  const [loading, setLoading] = useState<boolean>(true)

  /**
   * 状态变量，用于存储获取数据期间发生的任何错误。
   */
  const [error, setError] = useState<string | null>(null)

  /**
   *  获取权限
   */
  const fetchPermissions = async () => {
    setLoading(true)
    setError(null)

    try {
      if (appId) {
        const { data } = await getBtnFunctions(appId)
        setPermissions(data)
      } else {
        const { data: data1 } = await getBtnFunctions('11033')
        const { data: data2 } = await getBtnFunctions('11003')
        let data = data1.concat(data2)
        data = uniq(data)
        setPermissions(data)
      }
    } catch (err: any) {
      setError(err.message || err.msg)
    } finally {
      setLoading(false)
    }
  }

  /**
   * 副作用钩子，在 `appId` prop 发生变化时获取权限。
   */
  useEffect(() => {
    if (!appId) return
    fetchPermissions()
  }, [appId])

  /**
   * 返回获取到的权限、加载状态和错误状态。
   */
  return { permissions, loading, error }
}

export default usePermissions
