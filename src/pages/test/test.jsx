import React, { Component } from 'react';

export default class Test extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <label>我是label</label>
            </div>
        )
    }
}

// render((<Test />), document.getElementById('app'))