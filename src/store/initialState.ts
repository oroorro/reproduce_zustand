import { ReactFlowStore } from "../types/store"

const initialState: ReactFlowStore = {
    rfId: '1',
    relations: new Map(),
    newlyAddedId: null,
    update: new Map(),
}

export default initialState;