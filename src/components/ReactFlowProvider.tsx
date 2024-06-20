import React, { useRef, type FC, type PropsWithChildren } from 'react';
import { StoreApi } from 'zustand';
import { UseBoundStoreWithEqualityFn } from 'zustand/traditional';

import { Provider } from '../store/storeContext';
import { createRStore } from '../store/createRstore';
import type { ReactFlowState } from '../types/store';

const ReactFlowProvider: FC<PropsWithChildren<unknown>> = ({ children }) => {
  const storeRef = useRef<UseBoundStoreWithEqualityFn<StoreApi<ReactFlowState>> | null>(null);

  if (!storeRef.current) {
    storeRef.current = createRStore();
  }

  return(
  <Provider value={storeRef.current}>
    {children}
  </Provider>
  );
};

ReactFlowProvider.displayName = 'ReactFlowProvider';

export default ReactFlowProvider;