type ConvertDatesToStrings<T> = T extends Date
  ? string
  : T extends Array<infer U>
  ? Array<ConvertDatesToStrings<U>>
  : T extends object
  ? { [K in keyof T]: ConvertDatesToStrings<T[K]> }
  : T;

export function convertDatesToISO<T>(formData: T): ConvertDatesToStrings<T> {
  if (formData instanceof Date) {
    return formData.toISOString() as ConvertDatesToStrings<T>;
  }

  if (Array.isArray(formData)) {
    return formData.map((item) => convertDatesToISO(item)) as ConvertDatesToStrings<T>;
  }

  if (typeof formData === 'object' && formData !== null) {
    const result = {} as { [K in keyof T]: ConvertDatesToStrings<T[K]> };
    for (const key in formData) {
      if (Object.prototype.hasOwnProperty.call(formData, key)) {
        result[key] = convertDatesToISO(formData[key]);
      }
    }
    return result as ConvertDatesToStrings<T>;
  }

  return formData as ConvertDatesToStrings<T>;
}
