/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-var-requires */

/**
 * Get the HTML code of a component's HTML file
 * @param {string} componentName The component name inside ../components/html folder (without .html extension)
 * @returns The string containing HTML code of the given component
 */
function getHTML(componentName) {
  if (!componentName) {
    return null;
  }
  const html = require(`../components/html/${componentName}.html`);
  return html.default;
}

/**
 * Dynamically create HTML elements right from your JavaScript, and not be limited by the HTML syntax.
 * @param {string} tagName Name of the HTML tag you wish to create
 * @param {Object} opts An object containing classes (`string`), attributes (`Object`), text (`string`) and children (`Array`) for the HTML element
 * @returns an HTML element with the specifications provided
 * 
 * ## Examples
 * ### Without nesting
 * For simple HTML elements like:
    ```html
    <div id="myElem" class="myElem show" role="alert" aria-live="assertive" aria-atomic="true">This is my element</div>
    ```
 * The corresponding JS code will be like
    ```js
        createElem('div', {
            classes: 'myElem show',
            attributes: {
                id: 'myElem',
                role: 'alert',
                'aria-live': 'assertive',
                'aria-atomic': 'true'
            },
            text: 'This is my element'
        });
    ```
 * ### With nesting
 * When nesting of code is involved, the `children` option comes into play.
 * For example, if the HTML code is like:
    ```html
        <tr>
            <td class="shortcut-combination">Alt + Shift + L</td>
            <td>
                Toggle lock / unlock component
                <p class="light-text">
                    To lock a component, select it and hit this shortcut. To unlock a component, hit this shortcut again.
                </p>
            </td>
        </tr>
    ```
 * The corresponding JS will be:
    ```js
    createElem("tr", {
        children: [
            createElem("td", {
                text: 'Alt + Shift + L',
                classes: 'shortcut-combination'
            }),
            createElem("td", {
                text: 'Alt + Shift + L',
                children: [
                    createElem("p", {
                        text: 'To lock a component, select it and hit this shortcut. To unlock a component, hit this shortcut again.',
                        classes: "light-text",
                    }),
                ]
            }),
        ],
    });
    ```
 * 
 * 
 */
function createElem(tagName, opts) {
  const elem = document.createElement(tagName);
  if (opts.classes) {
    const classes = opts.classes.split(" ");
    classes.forEach((className) => {
      elem.classList.add(className);
    });
  }

  if (opts.attributes) {
    const attributes = Object.keys(opts.attributes);
    attributes.forEach((attrKey) => {
      elem.setAttribute(attrKey, opts.attributes[attrKey]);
    });
  }

  if (opts.text) {
    elem.innerText = opts.text;
  }

  if (opts.children && opts.children.length) {
    opts.children.forEach((child) => {
      elem.append(child);
    });
  }

  return elem;
}

/**
 * Get an object with an `emit` method that will be used to show toast messages.
 * @param {string} toastId The id attribute value of the toast div
 * @param {string} toastMessageId The id attribute value of the element where the toast message needs to be shown
 * @returns An object with `emit` method that takes a `message` parameter. 
 * You can call this method on the object to show the toast message.
 * The string parameter you pass as `message` will be the message shown in the Toast.
 * 
 * ### Example
 * If you have created a simple toast div on your HTML like:
    ```html
        <div class="toast-container position-fixed p-3 bottom-0 start-50 translate-middle-x">
            <div id="myToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-body">
                <span id="toast-message"></span>
            </div>
            </div>
        </div>
    ```
 * Then the `toastId` for this div will be "myToast" (first parameter) and the `toastMessageId` will be "toast-message" (second parameter).
 * To fire the toast on an event, this is what you need to write inside the event handler.
    ```js
    const toast = toastEmitter('myToast', 'toast-message');
    toast.emit('This is my toast message');
    ```
 * This will fire a toast with a message that says: "This is my toast message".
 */
function toastEmitter(toastId, toastMessageId) {
  const toastElem = document.getElementById(toastId);
  const toast = bootstrap.Toast.getOrCreateInstance(toastElem);
  const toastMessageElem = document.getElementById(toastMessageId);

  const toastObj = {
    emit: (message) => {
      toastMessageElem.innerText = message;
      toast.show();
    },
  };

  return toastObj;
}

export { createElem, getHTML, toastEmitter };
