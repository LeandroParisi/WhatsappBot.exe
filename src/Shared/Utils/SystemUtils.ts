import staticImplements from "../Anotations/staticImplements";

type Entries<T> = {
  [K in keyof T]: [K, T[K]]
}[keyof T][]

export interface Dictionary<T> {
  [Key: string]: T;
}

@staticImplements()
export default class SystemUtils {
  public static GetObjectEntries<T>(obj: T): Entries<T> {
    return Object.entries(obj) as any;
  }

  public static StringToHash(string : string) : number {
    let hash = 0;
      
    if (string.length == 0) return hash;
      
    for (let i = 0; i < string.length; i++) {
        let char = string.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
      
    return hash;
  }
}