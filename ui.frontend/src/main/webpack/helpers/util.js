/* eslint-disable @typescript-eslint/no-var-requires */

/**
 * Get the HTML code of a component's HTML file
 * @param {string} componentName The component name inside ../components/html folder (without .html extension)
 * @returns The string containing HTML code of the given component
 */
function getHTML(componentName) {
    if (! componentName) {
        return null;
    }
    const html = require(`../components/html/${componentName}.html`);
    return html.default;
}

function createElem(tagName, opts) {
    const elem = document.createElement(tagName);
    if (opts.classes) {
        const classes = opts.classes.split(' ');
        classes.forEach(className => {
            elem.classList.add(className);
        });
    }
    
    if (opts.attributes) {
        const attributes = Object.keys(opts.attributes);
        attributes.forEach(attrKey => {
            elem.setAttribute(attrKey, opts.attributes[attrKey]);
        });
    }

    if (opts.text) {
        elem.innerText = opts.text;
    }

    if (opts.children && opts.children.length) {
        opts.children.forEach(child => {
            elem.append(child);
        });
    }

    return elem;
}

export { createElem, getHTML };
