
export type Node<T = any, U extends string | undefined = string | undefined> = {
    id: string;
    data: T;
    type?: U;
}