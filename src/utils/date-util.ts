import { formatDistanceToNow, format, differenceInCalendarDays } from 'date-fns';
import { zhCN } from 'date-fns/locale';

/**
 * 格式化相对时间
 *
 * @param date       日期
 * @param formatDays 触发格式化天数
 */
export function formatRelativeTime(date: string | Date, formatDays?: number): string {
  if (!formatDays) {
    formatDays = 3;
  }
  const target = new Date(toValue(date));
  const now = new Date();

  // 相差的「日历天数」
  const diffDays = Math.abs(differenceInCalendarDays(now, target));

  // 超过格式化天数
  if (diffDays > formatDays) {
    const isSameYear = target.getFullYear() === now.getFullYear();

    return format(target, isSameYear ? 'MM-dd' : 'yyyy-MM-dd');
  }

  // 3 天以内：相对时间
  const relative = formatDistanceToNow(target, {
    addSuffix: true,
    locale: zhCN,
  });

  // 不是今天（昨天 / 前天），追加时分
  if (diffDays >= 1) {
    return `${relative} ${format(target, 'HH:mm')}`;
  }

  // 今天
  return relative;
}
