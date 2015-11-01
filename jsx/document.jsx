import React from "react"
import Block from "./block";
import BlockStore from "./stores/blockStore.jsx"
import {BlockActionCreator} from "./actions/blockActions.jsx"


export default React.createClass({
    getInitialState: function () {
        return {
            rootBlocks: []
        };
    },

    componentDidMount: function () {
        BlockActionCreator.createLoadBlocksAction(this.props.documentId);
        BlockStore.addBlocksLoadedListener(this._onBlocksLoaded);
        BlockStore.addBlockDeletedListener(this._onBlockDeleted);
    },

    componentWillUnmount: function() {
        BlockStore.removeBlocksLoadedListener(this._onBlocksLoaded);
        BlockStore.removeBlockDeletedListener(this._onBlockDeleted);
    },

    _onBlocksLoaded: function () {
        this.setState({
            rootBlocks: BlockStore.getRootBlocks()
        });
    },

    _onBlockDeleted: function (blockId) {
        if (blockId == 0) {
            this.setState({
                rootBlocks: BlockStore.getRootBlocks()
            });
        }
    },

    render: function () {
        var blocks = this.state.rootBlocks.map(function(b) {
            return (
                <Block key={b.id} blockId={b.id} type="{b.type}">{b.content}</Block>
            );
        });

        return (
            <div className="k-document">
                <div>{this.props.title}</div>
                {blocks}
            </div>
        )
    }
});
