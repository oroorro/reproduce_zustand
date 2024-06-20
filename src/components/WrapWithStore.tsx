

import React, { useContext, forwardRef, PropsWithChildren } from 'react';
import StoreContext from '../store/storeContext';
import ReactFlowProvider from './ReactFlowProvider';

const WrapWithStore = forwardRef<HTMLDivElement, PropsWithChildren<{}>>(({ children }, ref) => {
  const isWrapped = useContext(StoreContext);

  if (isWrapped) {
    return <>{children}</>;  // Just render children if already wrapped
  }
  return (
    <ReactFlowProvider>
        {children}
    </ReactFlowProvider>
  );
});

WrapWithStore.displayName = 'WrapWithStore';
export default WrapWithStore;
