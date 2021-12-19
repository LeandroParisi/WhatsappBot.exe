import staticImplements from "../Anotations/staticImplements";

type Entries<T> = {
  [K in keyof T]: [K, T[K]]
}[keyof T][]

@staticImplements()
export default class SystemUtils {
  public static GetObjectEntries<T>(obj: T): Entries<T> {
    return Object.entries(obj) as any;
  }
}