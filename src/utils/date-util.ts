import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

/**
 * 格式化相对时间
 *
 * @param date 日期
 */
export function formatRelativeTime(date: string | Date): string {
  return formatDistanceToNow(new Date(toValue(date)), {
    addSuffix: true,
    locale: zhCN,
  });
}
