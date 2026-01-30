/**
 * 객체에서 지정된 키들만 선택하여 새 객체를 반환합니다.
 * @param obj - 원본 객체
 * @param keys - 선택할 키 배열
 * @returns 선택된 키들만 포함하는 새 객체
 * @example
 * const user = { id: 1, name: 'John', email: 'john@example.com' };
 * const picked = pick(user, ['id', 'name']); // { id: 1, name: 'John' }
 */
export const pick = <T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> => {
  return keys.reduce(
    (pickedObj, curKey) => {
      if (curKey in obj) {
        pickedObj[curKey] = obj[curKey]
      }
      return pickedObj
    },
    {} as Pick<T, K>
  )
}

/**
 * 객체에서 지정된 키들을 제외한 새 객체를 반환합니다.
 * @param obj - 원본 객체
 * @param keys - 제외할 키 배열
 * @returns 지정된 키들이 제외된 새 객체
 * @example
 * const user = { id: 1, name: 'John', password: '123' };
 * const safe = omit(user, ['password']); // { id: 1, name: 'John' }
 */
export const omit = <T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> => {
  return Object.keys(obj).reduce(
    (omittedObj, curKey) => {
      if (!keys.includes(curKey as K)) {
        // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
        return { ...omittedObj, [curKey]: obj[curKey as K] }
      }
      return omittedObj
    },
    {} as Omit<T, K>
  )
}
