/**
 * 替换模板中参数
 *
 * @param template 模板
 * @param params   参数
 * @return 替换后的模板
 */
export function replaceTemplate(template: string, params: Recordable<Undefinable<string | number>>) {
  let result = template;
  for (const key of keys(params)) {
    const value = params[key];
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
  }
  return result;
}
