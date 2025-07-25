import http from "@/utils/http"

/**
 *  alioss 文件上传 授权接口
 * @param params * {file_suffix: string,file_name:string}
 * @returns  * {policy,access_id,signature,object_key,host,expire} : IUploadSign
 */
export const getUploadSign = (params: {
    file_suffix: string
    file_name: string
    content_type?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }): Promise<any> =>
    http.post('https://xxx.com/xbb/oss/pri/upload_sign', params)

export const batchDownloadSigns = (
    params: any[] = []
    ) =>
    http.post('https://xxx.com/xbb/oss/pri/batch_download_signs', params)
    

    export const fileUpload = (data:any) =>
        http.post(data.host, data.formData)