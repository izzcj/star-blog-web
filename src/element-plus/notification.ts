import { ElNotification, ElMessage, ElLoading } from 'element-plus';
import 'element-plus/es/components/notification/style/index';
import 'element-plus/es/components/message/style/index';
import 'element-plus/es/components/loading/style/index';

const commonNotificationOptions = {
  // 是否允许使用html作为文本
  dangerouslyUseHTMLString: true,
  // 是否显示关闭按钮
  showClose: true,
};

const commonMessageOptions = {
  // 是否允许使用html作为文本
  dangerouslyUseHTMLString: true,
  // 是否显示关闭按钮
  showClose: true,
  // 文字是否居中
  center: true,
};

/**
 * 成功消息
 *
 * @param message 消息
 */
export function successMessage(message: string) {
  return ElMessage.success({
    ...commonMessageOptions,
    message,
  });
}

/**
 * 警告消息
 *
 * @param message 消息
 */
export function warningMessage(message: string) {
  return ElMessage.warning({
    ...commonMessageOptions,
    message,
  });
}

/**
 * 异常消息
 *
 * @param message 消息
 */
export function errorMessage(message: string) {
  return ElMessage.error({
    ...commonMessageOptions,
    message,
  });
}

/**
 * 普通消息
 *
 * @param message 消息
 */
export function infoMessage(message: string) {
  return ElMessage.info({
    ...commonMessageOptions,
    message,
  });
}

/**
 * 加载信息
 */
export function loadingMessage(message: string) {
  const loading = ElLoading.service({
    lock: true,
    text: message,
  });
  return () => loading.close();
}

/**
 * 成功通知
 *
 * @param message 消息
 * @param title   标题
 */
export function successNotification(message: string, title?: string) {
  return ElNotification.success({
    ...commonNotificationOptions,
    title: title ?? '成功',
    message,
  });
}

/**
 * 警告通知
 *
 * @param message 消息
 * @param title   标题
 */
export function warningNotification(message: string, title?: string) {
  return ElNotification.warning({
    ...commonNotificationOptions,
    title: title ?? '警告',
    message,
  });
}

/**
 * 异常通知
 *
 * @param message 消息
 * @param title   标题
 */
export function errorNotification(message: string, title?: string) {
  return ElNotification.error({
    ...commonNotificationOptions,
    title: title ?? '异常',
    message,
  });
}

/**
 * 消息通知
 *
 * @param message 消息
 * @param title   标题
 */
export function infoNotification(message: string, title?: string) {
  return ElNotification.info({
    ...commonNotificationOptions,
    title: title ?? '消息',
    message,
  });
}
