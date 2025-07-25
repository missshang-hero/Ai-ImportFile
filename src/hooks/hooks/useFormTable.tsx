import { useDebounceFn } from 'ahooks'
import { useState, useEffect } from 'react'
import axios from '@/utils/axios'

let searchData: any = {} // 搜索区域表单数据
let ajaxUrl = ''

/**
 * 表格hooks
 * @param url           请求接口
 * @param ajaxData      其他默认请求参数
 * @returns {{setSearchData: setSearchData, pagination: {current: number, onChange: onChange, showTotal: (function(*)), pageSize: number, showQuickJumper: boolean, showSizeChanger: boolean}, onChange: onChange, setLoading: (value: (((prevState: boolean) => boolean) | boolean)) => void, dataList: *[], responseData: {}, setDataList: (value: (((prevState: *[]) => *[]) | *[])) => void, loading: boolean, searchData: {}}}
 */
function useFormTable(url: string, ajaxData: any = {}) {
  const [dataList, setDataList] = useState([]) // 表格数据list
  const [pagination, setPag] = useState({
    // 分页
    pageSize: ajaxData.pageSize || 15,
    current: 1,
    showQuickJumper: true,
    showSizeChanger: false,
    showTotal: (total: number) => (
      <span>
        共<span className='text-warning'>{total}</span>条
      </span>
    ),
    onChange: (current = 1, pageSize = 15) => {
      setPagination({ current, pageSize })
    }
  })
  const [loading, setLoading] = useState(false) // loading
  const [responseData, setResponseData] = useState({}) // 接口返回的data

  /**
   * 获取获取表格数据
   * @param searchParam           Object 搜索区域表单数据
   * @param paginationParam       Object 分页请求数据
   * @param config                Object 其他参数
   */
  const { run: getList } = useDebounceFn(
    ({ searchParam, paginationParam = {}, config = {} } = {}) => {
      setLoading(true)
      const isSearch = typeof searchParam === 'object'
      const isCurrent = typeof paginationParam.current !== 'undefined'
      const param = isSearch ? searchParam : searchData
      if (isSearch) {
        searchData = searchParam
      }

      ajaxUrl = config?.url || url
      axios
        .post(ajaxUrl, {
          ...ajaxData,
          ...param,
          pageSize: isCurrent
            ? paginationParam.pageSize || pagination.pageSize
            : pagination.pageSize,
          curPage: isCurrent ? paginationParam.current - 1 : pagination.current - 1
        })
        .then(({ flag, data: { dataList, totalRows, curPage } = {}, data = {} }) => {
          if (flag === 1 && dataList) {
            setDataList(dataList)

            setPag({
              ...pagination,
              current: curPage + 1,
              total: totalRows
            })
            setLoading(false)
            setResponseData(data)

            if (dataList.length === 0 && totalRows !== 0) {
              setPag({ ...pagination, current: pagination.current - 1 })
              getList(searchParam, paginationParam, config)
            }
          } else if (Array.isArray(data)) {
            setDataList(data)
            setPag(false)
            setLoading(false)
          }
        })
    },
    { wait: 500, leading: true }
  )

  useEffect(() => {
    getList({ searchParam: ajaxData })
    // eslint-disable-next-line
  }, [])

  // 设置接口参数，获取新数据
  const setSearchData = function (searchParam, paginationParam, config) {
    getList({ searchParam, paginationParam, config })
  }

  // 分页变化调接口
  const setPagination = function (paginationParam) {
    getList({ paginationParam, config: { url: ajaxUrl } })
  }

  // table change
  // eslint-disable-next-line
  const onChange = (pagination, filters, sorter, extra) => {
    console.log('pagination', pagination)
    console.log('filters', filters)
    console.log('sorter', sorter)
    console.log('extra', extra)
    console.log('searchData', searchData)
    const sortForms = []
    switch (extra.action) {
      case 'sort': // 排序
        if (Object.prototype.toString.call(sorter) === '[object Object]') {
          if (sorter.order) {
            sortForms.push({
              sortFiled: sorter.field,
              sortType: sorter.order === 'ascend' ? 0 : sorter.order === 'descend' ? 1 : undefined,
              weight: sorter?.column?.sorter?.multiple
            })
          }
        } else if (Object.prototype.toString.call(sorter) === '[object Array]') {
          for (const item of sorter) {
            if (item.order) {
              sortForms.push({
                sortFiled: item.field,
                sortType: item.order === 'ascend' ? 0 : item.order === 'descend' ? 1 : undefined,
                weight: item?.column?.sorter?.multiple
              })
            }
          }
        }
        searchData = {
          ...searchData,
          sortForms: sortForms?.length ? sortForms : undefined
        }
        getList({ searchParam: searchData, paginationParam: { current: 1 } })
        break
      // case 'filter':
      //   searchData = {
      //     ...searchData,
      //     ...filters
      //   }
      //   getList({ searchParam: searchData, paginationParam: { current: 1 } })
      //   break
      case 'paginate':
        break
    }
  }

  return {
    dataList,
    setDataList,
    pagination,
    loading,
    setLoading,
    searchData,
    setSearchData,
    responseData,
    onChange
  }
}

export default useFormTable
