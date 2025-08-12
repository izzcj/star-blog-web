/**
 * 创建storage
 *
 * @param prefix  前缀
 * @param storage storage类型
 */
export function createStorage(prefix: string, storage: 'local' | 'session' = 'local') {
  const storageUsed = storage === 'local' ? localStorage : sessionStorage;

  /**
   * 存储类
   */
  class Storage {
    constructor(private prefix: string) {}

    private computeKey(key: string) {
      return `${prefix}${key}`;
    }

    /**
     * 设置值
     *
     * @param key 键
     * @param value 值
     * @param expiresSeconds 过期时间
     */
    set(key: string, value: any, expiresSeconds: Nullable<number> = null) {
      storageUsed.setItem(
        this.computeKey(key),
        JSON.stringify({
          value,
          expiresSeconds: expiresSeconds !== null ? Date.now() + expiresSeconds * 1000 : null,
        }),
      );
    }

    /**
     * 获取值
     *
     * @param key 键
     */
    get<T>(key: string): Nullable<T> {
      const valueString = storageUsed.getItem(this.computeKey(key));
      if (!valueString) {
        return null;
      }

      try {
        const data = JSON.parse(valueString);
        const { value, expiresSeconds } = data;
        // 在有效期内直接返回
        if (expiresSeconds === null || expiresSeconds >= Date.now()) {
          return value;
        }

        this.remove(key);
      } catch {
        /* empty */
      }

      return null;
    }

    /**
     * 删除值
     *
     * @param key 键
     */
    remove(key: string) {
      storageUsed.removeItem(this.computeKey(key));
    }

    /**
     * 清空数据
     */
    clear(): void {
      for (let i = 0; i < storageUsed.length; i++) {
        const key = storageUsed.key(i);
        if (key == null) {
          continue;
        }
        if (key.startsWith(this.prefix)) {
          storageUsed.removeItem(key);
        }
      }
    }
  }

  return new Storage(prefix);
}
