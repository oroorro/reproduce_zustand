import { createContext } from 'react';

import { createRStore } from './createRstore';

const StoreContext = createContext<ReturnType<typeof createRStore> | null>(null);

export const Provider = StoreContext.Provider;
export default StoreContext;