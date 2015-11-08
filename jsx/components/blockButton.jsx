import React from "react";


let BlockButton = React.createClass({
    render: function () {
        let cssClasses = 'btn btn-default';

        return (
            <button data-tooltip={this.props.tooltip}
                    type="button"
                    className={cssClasses}
                    onClick={this.props.onClick}>
                {this.props.text}
            </button>
        );
    }
});

export default BlockButton;