export type ReactFlowState = ReactFlowStore & ReactFlowActions;

export type Relation = {
    nodeId: string,
    contentForIter: string[],
}
    
export type Relations = Map<string, Relation>;


export type ReactFlowActions= {
    getRelationElement:(nodeId: string)=> Relation;
    getRelations:()=>Relations;
    setRelation:(payload:any) => void;
    createRelation:(payload:any) => void;
}

export type ReactFlowStore = {
    rfId: string;
    relations? : Relations;
    newlyAddedId: string | null;

}