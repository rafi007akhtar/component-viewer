/* eslint-disable @typescript-eslint/no-var-requires */

// List all the component names here
// source folder will be ../components/html
// do not put .html extension at the end
// TODO: figure out a way to make this list dynamic, so that it automatically lists the components from the folder
const COMPONENTS = [
  "component1",
  "component2",
  "component3",
  "component4",
  "component5",
];

// add buttons for each component in the DOM
const componentList = document.querySelector("#component-list");
COMPONENTS.forEach((comp) => {
  const el = document.createElement("button");
  el.setAttribute("type", "button");
  el.setAttribute("class", `list-group-item list-group-item-action ${comp}`);
  el.innerText = comp;
  el.onclick = () => {
    selectAComponent(comp, el);
  };
  componentList.append(el);
});

/**
 * Pass the name and HTML element of the component to be selected, and it will be displayed in the DOM.
 * Also, the corresponding component name will be highlighted on the left pane.
 * @param {string} name the name of the component
 * @param {HTMLElement} el the HTML element for the component
 */
function selectAComponent(name, el) {
    console.log('component to be selected', name);
    const currentlyActive = document.querySelector(".list-group-item.active");
    if (currentlyActive) {
      currentlyActive.classList.remove("active");
    }
    el.classList.add("active");
    displayComponent(name);
}

function displayComponent(name) {
  const jsFileName = `${name}.js`;
  const jsFile = require("./js/" + jsFileName);
  const dump = document.querySelector("#dump");
  dump.innerHTML = jsFile.getHTML();
}

