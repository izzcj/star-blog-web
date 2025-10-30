import type { AxiosResponse } from 'axios';
import axios, { CanceledError } from 'axios';
import qs from 'qs';
import RequestHeader from '@/enum/request-header';
import { getAppConfig } from '@/utils/env-util';
import { warningNotification, infoNotification, errorNotification } from '@/element-plus/notification';
import CommonRouterPath from '@/enum/common-router-path';
import CommonRouterPathName from '@/enum/common-router-path-name';
import router from '@/router';
import ApiResultCode from '@/enum/api-result-code';
import { useAuthenticationStore } from '@/stores/authentication-store';

const instance = axios.create({
  baseURL: getAppConfig().apiBaseUrl,
  timeout: 10000,
  headers: {
    [RequestHeader.CONTENT_TYPE]: RequestHeader.CONTENT_TYPE_APPLICATION_JSON,
  },
  paramsSerializer: {
    serialize: params => qs.stringify(params, { arrayFormat: 'brackets', skipNulls: true }),
  },
  responseType: 'json',
});

let authenticationStore: Nullable<ReturnType<typeof useAuthenticationStore>> = null;
// 匹配uri参数的正则对象
const uriParamReg = /\{(\w+)\}/;

instance.interceptors.request.use(
  config => {
    if (authenticationStore == null) {
      authenticationStore = useAuthenticationStore();
    }
    if (authenticationStore.isLoggedIn && config.headers) {
      config.headers[RequestHeader.AUTHORIZATION] = `Bearer ${authenticationStore.accessToken}`;
    }

    // 处理URI参数
    const params = config.params ?? {};
    let url = decodeURIComponent(config.url as string);
    let matched = uriParamReg.exec(url);
    while (matched) {
      url = url.replace(matched[0], params[matched[1]] ?? '');
      delete params[matched[1]];
      matched = uriParamReg.exec(url);
    }
    config.url = url;

    return config;
  },
  error => {
    const { message } = error;
    errorNotification(`发起请求异常：${message}！`);
    return Promise.reject(message);
  },
);

instance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    if (response.config.responseType === 'blob') {
      return response;
    }

    const data = response.data;
    if (!data) {
      handleApiError(
        response.status,
        response.statusText,
        response.config.method as string,
        response.config.url as string,
      ).catch(e => {
        errorNotification(`Api错误处理失败：${e}`);
      });

      return Promise.reject({
        code: response.status,
        message: response.statusText,
      });
    }

    const { code, message } = data;
    if (code === ApiResultCode.SUCCESS) {
      return response;
    }

    handleApiError(code, message, response.config.method as string, response.config.url as string).catch(e => {
      errorNotification(`Api错误处理失败：${e}`);
    });
    return Promise.reject(data);
  },
  error => {
    if (error instanceof CanceledError) {
      if (getAppConfig().showRapidDuplicateRequestWarning) {
        const canceledError = error as CanceledError<unknown>;
        warningNotification(
          '请求已取消，此类情况一般由于段时间内发起了两次相同的请求导致，说明代码逻辑不合理，请根据Console错误堆栈排查解决！',
        );
        console.log(canceledError.stack);
      }
      return Promise.reject();
    }

    const { response, message } = error;
    if (response?.data) {
      // 此处为处理响应信息时的逻辑错误
      errorNotification(`处理请求响应信息异常：${message ?? '无'}！`);
      return Promise.reject();
    } else {
      // 处理提示信息
      let info = message;
      if (message === 'Network Error') {
        info = '接口连接异常！可能原因：网络不通或存在跨域问题。';
      }
      if (message.includes('timeout')) {
        info = '接口请求超时！';
      }
      if (message.includes('Request failed with status code')) {
        const code = message.substring(message.length - 3);
        info = `接口状态码异常：${code}！`;
      }
      errorNotification(info || '接口未知异常！');

      return Promise.reject();
    }
  },
);

const noRedirectRoutePaths = [CommonRouterPath.FORBIDDEN, CommonRouterPath.NOT_FOUND, CommonRouterPath.HOME];

/**
 * 处理Api异常
 *
 * @param code 异常嘛
 * @param message 异常消息
 * @param method 请求方法
 * @param uri 请求URI
 */
async function handleApiError(code: number, message: string, method: string, uri: string) {
  if (authenticationStore == null) {
    authenticationStore = useAuthenticationStore();
  }

  const routePath = router.currentRoute.value.fullPath;
  const pathTokens = routePath.split('?');
  switch (code) {
    case ApiResultCode.UNAUTHORIZED:
      warningNotification('需要登录！');
      authenticationStore.clearAuthentication();
      await router.replace({
        name: CommonRouterPathName.LOGIN,
        query: noRedirectRoutePaths.includes(pathTokens[0] as CommonRouterPath)
          ? undefined
          : {
              redirect: routePath,
            },
      });
      break;
    case ApiResultCode.ACCESS_DENIED:
      warningNotification(`${message}请求：${method.toUpperCase()} - ${uri}，需要认证，请联系管理员为您开通！`);
      break;
    case ApiResultCode.TOKEN_EXPIRED:
      infoNotification('登录已失效！');
      authenticationStore.clearAuthentication();
      await router.replace({
        name: CommonRouterPathName.LOGIN,
        query: noRedirectRoutePaths.includes(pathTokens[0] as CommonRouterPath)
          ? undefined
          : {
              redirect: routePath,
            },
      });
      break;
    case 503:
      errorNotification('服务不可用，请检查后端服务是否启动成功或网络端口是否放开！');
      break;
    default:
      errorNotification(message);
  }
}

export default instance;
