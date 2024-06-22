export type ReactFlowState = ReactFlowStore & ReactFlowActions;

type IteratorTimeFrame = {
    nodeId: string,
    nodeTimeFrameIndex: number
}


export type ReactFlowActions= {
    getRelationElement:(nodeId: string)=> Relation;
    getRelations:()=>Relations;
    setRelation:(payload:any) => void;
    createRelation:(payload:any) => void;
    setUpdate:(frame:IteratorTimeFrame[]) => void;
}

export type ReactFlowStore = {
    rfId: string;
    relations? : Relations;
    newlyAddedId: string | null;
    update: Map<string, number>
}
export type Relations = Map<string, Relation>;

export type Relation = {
    nodeId: string,
    timeFrameId: number,
    contentForIter: string[],
}
    
