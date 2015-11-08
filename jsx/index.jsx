import React from 'react';
import ReactDOM from 'react-dom';
import Document from './components/document.jsx';

ReactDOM.render(
    <Document documentId="2409" title="document title updated"/>,
    document.querySelector('#document')
);
