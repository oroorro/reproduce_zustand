import { useContext } from "react";

import GrapView from "./components/GraphView"
import StoreContext from "./store/storeContext";
import WrapWithStore from "./components/WrapWithStore";

export default function Flow(){

    const isWrapped = useContext(StoreContext);

    if(isWrapped){
        return(
            <div>
                <GrapView/>
            </div>
        )

    }
    return(
        <WrapWithStore>
            <GrapView/>
        </WrapWithStore>
    )
    
    
}