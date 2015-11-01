import EventEmitter from "events";
import appEvents from "../appEvents/appEvents.jsx";
import Dispatcher from "../dispatcher/dispatcher.jsx";
import $ from "jquery";

class BlockStore extends EventEmitter {
    constructor() {
        super();
        this.blocks = [];
    }

    getRootBlocks() {
        return this.blocks.filter((b) => !b.parentId);
    }

    addBlocksLoadedListener(callback) {
        this.on(appEvents.BLOCKS_LOADED, callback);
    }

    removeBlocksLoadedListener(callback) {
        this.removeListener(appEvents.BLOCKS_LOADED, callback);
    }

    emitBlocksLoaded() {
        this.emit(appEvents.BLOCKS_LOADED);
    }

    emitChildrenBlocks(blockId, childrenBlocks) {
        this.emit(appEvents.CHILDREN_BLOCKS, blockId, childrenBlocks);
    }

    addChildrenBlocksListener(callback) {
        this.on(appEvents.CHILDREN_BLOCKS, callback);
    }

    removeChildrenBlocksListener(callback) {
        this.removeListener(appEvents.CHILDREN_BLOCKS, callback);
    }

    emitBlockDeleted(parentBlockId) {
        this.emit(appEvents.BLOCK_DELETED, parentBlockId);
    }

    addBlockDeletedListener(callback) {
        this.on(appEvents.BLOCK_DELETED, callback);
    }

    removeBlockDeletedListener(callback) {
        this.removeListener(appEvents.BLOCK_DELETED, callback);
    }

    loadBlocks(documentId) {
        // TODO: generate a proper url using documentid
        let url = 'http://ec2-52-18-91-104.eu-west-1.compute.amazonaws.com:8081/blocks';
        $.get(url)
            .done((data) => {
                this.blocks = data.blocks.map((b) => {
                    return {
                        id: b.id,
                        parentId: b.parent_id,
                        type: b.type,
                        content: b.content,
                        position: b.position
                    };
                });

                this.emitBlocksLoaded()
            });
    }

    getChildrenBlocks(blockId) {
        let childrenBlocks = this.blocks
            .filter((b) => b.parentId == blockId)
            .sort((a, b) => {
                return +(a.position > b.position) || +(a.position === b.position) - 1;
            });

        this.emitChildrenBlocks(blockId, childrenBlocks);
    }

    deleteBlock(blockId) {
        let childrenBlocks;
        let originalBlockToRemove = this.blocks.find((b) => b.id == blockId);
        let blocksToRemove = [originalBlockToRemove];

        let parentId = blockId;

        childrenBlocks = this.blocks.filter((b) => b.parentId == parentId);
        do {
            childrenBlocks.forEach((b) => {
                parentId = b.id;
                childrenBlocks = this.blocks.filter((b) => b.parentId == parentId);
                blocksToRemove.push(...childrenBlocks);
            });
        } while (childrenBlocks.length > 0);

        blocksToRemove.forEach((b) => {
            let index = this.blocks.indexOf(b);
            if (index != -1) {
                this.blocks.splice(index, 1);
            }
        });

        this.emitBlockDeleted(originalBlockToRemove.parentId);
    }
}

let blockStore = new BlockStore();

Dispatcher.register((action) => {
    switch (action.type) {
        case appEvents.LOAD_BLOCKS:
            blockStore.loadBlocks(action.documentId);
            break;
        case appEvents.GET_CHILDREN_BLOCKS:
            blockStore.getChildrenBlocks(action.blockId);
            break;
        case appEvents.DELETE_BLOCK:
            blockStore.deleteBlock(action.blockId);
            break;
        default:
            break;
    }
});

export default blockStore;