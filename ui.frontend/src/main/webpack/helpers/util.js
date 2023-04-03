/* eslint-disable @typescript-eslint/no-var-requires */

/**
 * Get the HTML code of a component's HTML file
 * @param {string} componentName The component name inside ../components/html folder (without .html extension)
 * @returns The string containing HTML code of the given component
 */
export function getHTML(componentName) {
    if (! componentName) {
        return null;
    }
    const html = require(`../components/html/${componentName}.html`);
    return html.default;
}
