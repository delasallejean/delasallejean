import Dispatcher from "../dispatcher/dispatcher.jsx";
import appEvents from "../appEvents/appEvents.jsx";

class LoadBlockAction {
    constructor(documentId) {
        this.type = appEvents.LOAD_BLOCKS;
        this.documentId = documentId;
    }
}

class GetChildrenAction {
    constructor(blockId) {
        this.type = appEvents.GET_CHILDREN_BLOCKS;
        this.blockId = blockId;
    }
}

class DeleteBlockAction {
    constructor(blockId) {
        this.type = appEvents.DELETE_BLOCK;
        this.blockId = blockId;
    }
}

export class BlockActionCreator {
    static createLoadBlocksAction(documentId) {
        Dispatcher.dispatch(new LoadBlockAction(documentId));
    }

    static createGetChildrenAction(blockId) {
        Dispatcher.dispatch(new GetChildrenAction(blockId));
    }

    static createDeleteBlockAction(blockId) {
        Dispatcher.dispatch(new DeleteBlockAction(blockId));
    }
}

