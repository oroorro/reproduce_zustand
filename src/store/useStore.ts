import { useContext, useMemo } from 'react';
import { useStoreWithEqualityFn as useZustandStore } from 'zustand/traditional';
import type { StoreApi } from 'zustand';

import StoreContext from './storeContext';
import { ReactFlowState } from '../types/store';

type ExtractState = StoreApi<ReactFlowState> extends { getState: () => infer T } ? T : never;

function useStore<StateSlice = ExtractState>(
    selector: (state: ReactFlowState) => StateSlice,
    equalityFn?: (a: StateSlice, b: StateSlice) => boolean
  ) {
    const store = useContext(StoreContext);
  
    if (store === null) {
      throw new Error();
    }
  
    return useZustandStore(store, selector, equalityFn);
}
  
const useStoreApi = () => {
    const store = useContext(StoreContext);
  
    if (store === null) {
      throw new Error();
    }
  
    return useMemo(
      () => ({
        getState: store.getState,
        setState: store.setState,
        subscribe: store.subscribe,
        destroy: store.destroy,
      }),
      [store]
    );
  };
  
  export { useStore, useStoreApi };