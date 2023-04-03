/* eslint-disable @typescript-eslint/no-var-requires */
// const html = require('../html/component1.html');
import html from '../html/component1.html';

export function getHTML() {
    console.log('html', html);
    return html;
}
