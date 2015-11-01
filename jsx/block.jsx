import React from "react";
import {BlockActionCreator} from "./actions/blockActions.jsx";
import BlockStore from "./stores/blockStore.jsx";
import BlockButton from "./blockButton.jsx";

let Block = React.createClass({
    getInitialState: function () {
        return { blocks: [] };
    },

    componentDidMount: function () {
        BlockStore.addChildrenBlocksListener(this._onChildrenBlocks);
        BlockStore.addBlockDeletedListener(this._onBlockDeleted);
        BlockActionCreator.createGetChildrenAction(this.props.blockId);
    },

    componentWillUnmount: function () {
        BlockStore.removeChildrenBlocksListener(this._onChildrenBlocks);
        BlockStore.removeBlockDeletedListener(this._onBlockDeleted);
    },

    _onChildrenBlocks: function (blockId, childrenBlocks) {
        if (this.props.blockId != blockId) {
            return;
        }

        this.setState({
            blocks: childrenBlocks
        });
    },

    _onBlockDeleted: function (blockToRefresh) {
        if (this.props.blockId == blockToRefresh) {
            //  dirty hack to avoid the following error : `Cannot dispatch in the middle of a dispatch`
            setTimeout(() => {
                BlockActionCreator.createGetChildrenAction(this.props.blockId);
            }, 0);
        }
    },

    doStuff: function () {
        console.log('doing stuff');
    },

    deleteBlock: function () {
        BlockActionCreator.createDeleteBlockAction(this.props.blockId);
    },

    render: function() {
        let childrenBlocks = this.state.blocks.map((b) => {
            return (
                <Block key={b.id} blockId={b.id} type={b.type}>{b.content}</Block>
            );
        });

        return (
            <div className="block" data-block-id={this.props.blockId} data-type={this.props.type}>
                {this.props.children}
                {childrenBlocks}
                <div className="actions">
                    <BlockButton tooltip="Add block here" text="^" onClick={this.doStuff} />
                    <BlockButton tooltip="Add block after" text="v" onClick={this.doStuff} />
                    <BlockButton tooltip="Delete block" text="x" onClick={this.deleteBlock} />
                </div>
            </div>
        )
    }
});

export default Block;