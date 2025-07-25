import { useDebounceFn } from 'ahooks'
import {
  useState,
  useEffect,
  useRef,
  JSXElementConstructor,
  ReactElement,
  ReactNode,
  ReactPortal
} from 'react'
import http from '@/utils/httpOld'

export default function useTable(params: any) {
  const searchData = useRef({}) // 搜索区域表单数据
  let ajaxUrl = ''
  const { url = '', queryParams = {}, customConfig = {}, axios = http, method = 'POST' } = params

  const pageSizeOptions = customConfig.pageSizeOptions ?? [15, 30, 50, 100, 200]
  const immediate = customConfig.immediate ?? true // 自动加载
  const pageSizeName = customConfig.pageSizeName || 'page_size' // 自定义每页搜索数量key
  const curPageName = customConfig.curPageName || 'cur_page' // 自定义搜索第几页key
  const pageSize = customConfig.pageSize || 15 // 自定义每页搜索数量value
  const showQuickJumper = customConfig.showQuickJumper || true // 是否可以快速跳转至某页
  const showSizeChanger = customConfig.showSizeChanger || false // 是否展示 pageSize 切换器
  const showTotal = customConfig.showTotal || true // 是否显示数据总量
  const startSearchIndex = customConfig.startSearchIndex || 0 // 自定义接口搜索起始索引
  const difference = 1 - startSearchIndex // pagination.current - startSearchIndex，前端分页起始值与后端搜索起始值的差值
  const dataListName = customConfig.dataListName || 'dataList' // 自定义接口出参-列表数据key
  const totalRowsName = customConfig.totalRowsName || 'totalRows' // 自定义接口出参-总条数
  const responseCurPageName = customConfig.responseCurPageName || curPageName // 自定义接口出参-当前页key，默认取值为自定义参数curPageName值
  const responseDataName = customConfig.responseDataName || 'data' // 自定义接口出参-data key
  const responseDataType = customConfig.responseDataType || [] // 返回responseDataName 默认 值
  const sortFiledName = customConfig.sortFiledName || 'sortFiled' // 自定义排序字段key
  const sortTypeName = customConfig.sortTypeName || 'sortType' // 自定义排序 order by key
  const weightName = customConfig.weightName || 'weight' // 自定义排序权重key
  const sortFormsName = customConfig.sortFormsName || 'sortForms' // 自定义排序接口入参key
  const axiosConfig = customConfig.axiosConfig || {} // 自定义axios配置

  const [dataList, setDataList] = useState([]) // 表格数据list
  // antd pagination组件props
  const [pagination, setPag] = useState({
    // 分页
    pageSize,
    current: 1,
    pageSizeOptions,
    showQuickJumper,
    showSizeChanger,
    showTotal: (
      total:
        | string
        | number
        | boolean
        | ReactElement<any, string | JSXElementConstructor<any>>
        | Iterable<ReactNode>
        | ReactPortal
        | null
        | undefined
    ) => {
      if (showTotal) {
        if (typeof showTotal === 'function') {
          return showTotal()
        } else {
          return (
            <span>
              共<span className='text-warning'>{total}</span>条
            </span>
          )
        }
      } else {
        return null
      }
    },
    onChange: (current = 1, pageSize = 15) => {
      setPagination({ current, pageSize })
    }
  })
  const [loading, setLoading] = useState(false) // loading
  const [responseData, setResponseData] = useState<any>({}) // 接口返回的data

  /**
   * 获取获取表格数据
   * @param searchParam           Object 搜索区域表单数据
   * @param paginationParam       Object 分页请求数据
   * @param config                Object 其他参数
   */
  const { run: getList } = useDebounceFn(
    async ({ searchParam, paginationParam = {}, config = {} } = {}) => {
      setLoading(true)
      const isSearch = typeof searchParam === 'object'
      const isCurrent = typeof paginationParam.current !== 'undefined'
      const param = isSearch ? searchParam : searchData.current

      if (isSearch) {
        searchData.current = searchParam
      }
      const params = {
        ...param,
        [pageSizeName]: isCurrent
          ? paginationParam.pageSize || pagination.pageSize
          : pagination.pageSize,
        [curPageName]: isCurrent
          ? paginationParam.current - difference < 0
            ? 0
            : paginationParam.current - difference
          : pagination.current - difference < 0
            ? 0
            : pagination.current - difference,
        ...queryParams
      }

      ajaxUrl = config?.url || url
      const isGet = method.toLocaleLowerCase() === 'get'
      axios[method.toLocaleLowerCase()](ajaxUrl, isGet ? { params } : params, {
        ...axiosConfig
      })
        .then((res: any) => {
          const resData = { ...res }
          if (!resData[responseDataName]) {
            resData[responseDataName] = responseDataType
          }
          const {
            [responseDataName]: {
              [dataListName]: list = [],
              [totalRowsName]: totalRows,
              [responseCurPageName]: curPage = 0
            } = {},
            [responseDataName]: data = [],
            [totalRowsName]: total = 0
          } = resData
          if (Object.prototype.toString.call(data) === '[object Object]') {
            setDataList(list)
            console.log('1')
            setPag({
              ...pagination,
              current: curPage + difference,
              total: totalRows
            })
            setLoading(false)
            setResponseData(data)

            if (list.length === 0 && totalRows !== 0 && pagination.current > 0) {
              console.log('--------------list---------------')
              setPag({ ...pagination, current: pagination.current - 1 })
              getList(searchParam, paginationParam, config)
            }
          } else if (Array.isArray(data)) {
            setDataList(data)
            console.log('2')
            setPag({
              ...pagination,
              pageSize: params[pageSizeName],
              current: params[curPageName] + difference,
              total: resData.total
            })
            setLoading(false)
            setResponseData(resData)
            if (data.length === 0 && total !== 0 && pagination.current > 0) {
              console.log('--------------data---------------')
              setPag({ ...pagination, current: pagination.current - 1 })
              console.log(pagination)
              getList(searchParam, paginationParam, config)
            }
          }
        })
        .catch(() => {
          setLoading(false)
        })
    },
    { wait: 500, leading: true }
  )

  useEffect(() => {
    if (immediate) {
      console.log('immediate')
      getList({ searchParam: queryParams })
    }
  }, [immediate])

  if (!url) {
    console.error('useTable-请传入接口')
    return {}
  }

  if (!axios) {
    console.error('useTable-请传入axios实例')
    return {}
  }

  // 设置接口参数，获取新数据
  const setSearchData = function (searchParam?: any, paginationParam?: any, config?: any) {
    getList({ searchParam, paginationParam, config })
  }

  // 分页变化调接口
  const setPagination = function (paginationParam: { current: number; pageSize: number }) {
    // 使用自己的page传参
    if (params?.isUsePagination) {
      return
    }
    getList({ paginationParam, config: { url: ajaxUrl } })
  }

  // table change
  const onChange = (
    pagination: any,
    filters: any,
    sorter: { order: string; field: any; column: { sorter: { multiple: any } } },
    extra: { action: any }
  ) => {
    console.log('pagination', pagination)
    console.log('filters', filters)
    console.log('sorter', sorter)
    console.log('extra', extra)
    const sortForms = []
    switch (extra.action) {
      case 'sort': // 排序
        if (Object.prototype.toString.call(sorter) === '[object Object]') {
          if (sorter.order) {
            sortForms.push({
              [sortFiledName]: sorter.field,
              [sortTypeName]:
                sorter.order === 'ascend' ? 0 : sorter.order === 'descend' ? 1 : undefined,
              [weightName]: sorter?.column?.sorter?.multiple
            })
          }
        } else if (Object.prototype.toString.call(sorter) === '[object Array]') {
          // @ts-expect-error todo
          for (const item of sorter) {
            if (item.order) {
              sortForms.push({
                [sortFiledName]: item.field,
                [sortTypeName]:
                  item.order === 'ascend' ? 0 : item.order === 'descend' ? 1 : undefined,
                [weightName]: item?.column?.sorter?.multiple
              })
            }
          }
        }
        searchData.current = {
          ...searchData.current,
          [sortFormsName]: sortForms?.length ? JSON.stringify(sortForms) : undefined
        }
        getList({ searchParam: searchData.current, paginationParam: { current: 1 } })
        break
      case 'paginate':
        break
    }
  }

  const tableProps = {
    dataSource: dataList,
    loading,
    pagination,
    onChange
  }

  return {
    dataList,
    setDataList,
    pagination,
    loading,
    setLoading,
    searchData: searchData.current,
    setSearchData,
    responseData,
    onChange,
    tableProps
  }
}
