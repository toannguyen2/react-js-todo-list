export const isFunction = (input: any) => typeof input === "function";
export const renderIf = (predicate: any) => (elemOrThunk: any) => predicate ? (isFunction(elemOrThunk) ? elemOrThunk() : elemOrThunk) : null;
