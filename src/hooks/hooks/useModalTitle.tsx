import { useMemo } from 'react'

/**
 * 弹窗标题
 * @param currentMode 状态
 * @param name 名称
 * @returns
 */
export default function useModalTitle(currentMode: string | undefined, name: string) {
  const title = useMemo(() => {
    const map: Record<any, string> = {
      create: '新增' + name,
      edit: '编辑' + name,
      read: '查看' + name
    }
    return currentMode ? map[currentMode] : name
  }, [currentMode, name])

  return {
    title
  }
}
