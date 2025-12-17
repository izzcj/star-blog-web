import type { AxiosResponse, RawAxiosRequestHeaders } from 'axios';
import RequestMethod from '@/enums/request-method';
import instance from '@/request';
import { replaceTemplate } from '@/utils/string-util';
import { uploadApiModule } from '@/api/upload';
import { useAuthenticationStore } from '@/stores/authentication-store';
import RequestHeader from '@/enums/request-header';

// ------------------简化请求方法-------------------- //
export async function get<T = any>(uri: string, params: Recordable = {}, headers: RawAxiosRequestHeaders = {}) {
  return instance
    .get<ApiResponse<T>>(uri, {
      headers,
      params,
    })
    .then(response => response.data);
}

export async function post<T = any, D = Recordable>(
  uri: string,
  data: D,
  params: Recordable = {},
  headers: RawAxiosRequestHeaders = {},
) {
  return instance
    .post<ApiResponse<T>, AxiosResponse<ApiResponse<T>, D>, D>(uri, data, {
      headers,
      params,
    })
    .then(response => response.data);
}

export async function put<T = any, D = Recordable>(
  uri: string,
  data: D,
  params: Recordable = {},
  headers: RawAxiosRequestHeaders = {},
) {
  return instance
    .put<ApiResponse<T>, AxiosResponse<ApiResponse<T>, D>, D>(uri, data, {
      headers,
      params,
    })
    .then(response => response.data);
}

export async function del<T = any>(uri: string, params: Recordable = {}, headers: RawAxiosRequestHeaders = {}) {
  return instance
    .delete<ApiResponse<T>>(uri, {
      headers,
      params,
    })
    .then(response => response.data);
}

const requestHandlerMapping = {
  [RequestMethod.GET]: get,
  [RequestMethod.POST]: post,
  [RequestMethod.PUT]: put,
  [RequestMethod.DELETE]: del,
};

/**
 * 执行请求
 *
 * @param uri        请求URI
 * @param method     请求方法
 * @param apiRequest 请求信息
 */
export function executeRequest<T = unknown, D extends Recordable = Recordable>(
  uri: string,
  method: RequestMethod,
  apiRequest?: ApiRequest<D>,
): Promise<ApiResponse<T>> {
  if (method == RequestMethod.GET || method == RequestMethod.DELETE) {
    return requestHandlerMapping[method].call(undefined, uri, apiRequest?.params, apiRequest?.headers) as Promise<ApiResponse<T>>;
  }

  return requestHandlerMapping[method].call(
    undefined,
    uri,
    apiRequest?.data,
    apiRequest?.params,
    apiRequest?.headers,
  ) as Promise<ApiResponse<T>>;
}

/**
 * 发送异步请求
 *
 * @param api        API
 * @param apiRequest 请求信息
 */
export function asyncRequest<T = any, D extends Recordable = Recordable>(
  api: ApiDescriptor,
  apiRequest?: ApiRequest<D>,
) {
  const requestInfo = mergedRequestInfo(api, apiRequest);

  return executeRequest<T, D>(requestInfo.uri, requestInfo.method, requestInfo.apiRequest);
}

/**
 * 发送异步上传请求
 *
 * @param formData    表单数据
 * @param api         API
 * @param fileType    文件类型
 * @param ossProvider OSS提供者
 */
export function asyncUploadRequest<T = any>(
  formData: FormData,
  api?: ApiDescriptor,
  fileType?: string,
  ossProvider?: string,
) {
  if (!api) {
    api = uploadApiModule.apis.uploadObject;
  }
  const authenticationStore = useAuthenticationStore();
  let headers: Recordable = {};
  if (authenticationStore.isLoggedIn) {
    headers = {
      [RequestHeader.AUTHORIZATION]: `Bearer ${authenticationStore.accessToken}`,
      [RequestHeader.CONTENT_TYPE]: RequestHeader.CONTENT_TYPE_MULTIPART_FORM_DATA,
    };
  }
  const apiRequest: ApiRequest<FormData> = {
    pathParams: {
      fileType: fileType || 'image',
      ossProvider: ossProvider || 'minio',
    },
    headers,
    data: formData,
  };
  return asyncRequest<T, FormData>(api, apiRequest);
}

/**
 * 合并请求信息
 * 将发起请求时携带的参数或请求头与api定义的固定参数或请求头合并
 *
 * @param api        API
 * @param apiRequest 请求信息
 * @returns 合并后的请求信息
 */
function mergedRequestInfo<D extends Recordable = Recordable>(
  api: ApiDescriptor,
  apiRequest?: ApiRequest<D>,
): Pick<ApiDescriptor, 'uri' | 'method'> & { apiRequest: ApiRequest<D> } {
  const mergedApiRequest: { [p: string]: any; [p: number]: any; [p: symbol]: any } = reactiveComputed(() => {
    let headers = apiRequest?.headers ?? {};
    if (isPlainObject(api.fixedHeaders)) {
      headers = {
        ...api.fixedHeaders,
        ...headers,
      };
    }

    let params = apiRequest?.params ?? {};
    if (isPlainObject(api.fixedParams)) {
      params = {
        ...api.fixedParams,
        ...params,
      };
    }

    let data = apiRequest?.data;
    if ((api.method == RequestMethod.POST || api.method == RequestMethod.PUT) && isPlainObject(api.fixedData)) {
      data = {
        ...api.fixedData,
        ...data,
      } as D;
    }

    return {
      headers,
      params,
      data,
    };
  });

  let uri = api.uri;
  if (apiRequest?.pathParams) {
    uri = replaceTemplate(api.uri, apiRequest.pathParams);
  }

  return {
    uri,
    method: api.method,
    apiRequest: mergedApiRequest,
  };
}
