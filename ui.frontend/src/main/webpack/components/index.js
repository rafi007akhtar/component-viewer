/* eslint-disable @typescript-eslint/no-var-requires */
import { getHTML } from '../helpers/util';

const componentFiles = require.context(
  '../components/html',
  false,
  /\.html$/
).keys();

// List of all the components
// DONE: figure out a way to make this list dynamic, so that it automatically lists the components from the folder
const COMPONENTS = componentFiles.map(file => {
  const extensionInd = file.lastIndexOf('.');
  const FIST_LETTER_IND = 2;  // because files are retrieved like './component1.html'
  return file.substring(FIST_LETTER_IND, extensionInd);
});



// add buttons for each component in the DOM
const componentList = document.querySelector("#component-list");

/**
 * To generate the list of components on the left panel of the index page
 * @param {string} searchTerms (optional) The search terms user enters on the input field.
 * When not supplied, it will list all the components.
 */
function generateComponentList(searchTerms) {
  componentList.innerHTML = "";
  let searchedComponents = [...COMPONENTS];
  if (searchTerms) {
    searchedComponents = searchedComponents.filter((comp) =>
      comp.includes(searchTerms)
    );
  }
  searchedComponents.forEach((comp) => {
    const el = document.createElement("button");
    el.setAttribute("type", "button");
    el.setAttribute("class", `list-group-item list-group-item-action ${comp}`);
    el.innerText = comp;
    el.onclick = () => {
      selectAComponent(comp, el);
    };
    componentList.append(el);
  });
}

generateComponentList();

const componentSearch = document.querySelector("#component-search");
componentSearch.onchange = () => {
  generateComponentList(componentSearch.value);
};

// implement show / hide panel functionality
const hidePanelButton = document.querySelector("#hide-panel");
const panel = document.querySelector("#panel");
const componentView = document.querySelector("#component-view");

/**
 * Hides the left panel containing component list, and gives all the columns to the selected component
 */
function hidePanel() {
  panel.style.display = "none";
  componentView.classList.remove("col-8");
  componentView.classList.add("col-12");

  const toastTrigger = document.getElementById("hide-panel");
  const toastLiveExample = document.getElementById("panelToast");
  if (toastTrigger) {
    const toastBootstrap =
      bootstrap.Toast.getOrCreateInstance(toastLiveExample);
    toastBootstrap.show();
  }
}

/**
 * Brings back the left panel, if hidden.
 */
function showPanel() {
  panel.style.display = "block";
  componentView.classList.remove("col-12");
  componentView.classList.add("col-8");
}

hidePanelButton.onclick = () => {
  hidePanel();
};

document.onkeyup = (e) => {
  if (e.ctrlKey) {
    if (e.key === "ArrowRight") {
      showPanel();
    }
    if (e.key === "ArrowLeft") {
      hidePanel();
    }
  }
};

/**
 * Pass the name and HTML element of the component to be selected, and it will be displayed in the DOM.
 * Also, the corresponding component name will be highlighted on the left pane.
 * @param {string} name the name of the component
 * @param {HTMLElement} el the HTML element for the component
 */
function selectAComponent(name, el) {
  const currentlyActive = document.querySelector(".list-group-item.active");
  if (currentlyActive) {
    currentlyActive.classList.remove("active");
  }
  el.classList.add("active");
  displayComponent(name);
}

function displayComponent(name) {
  dump.innerHTML = getHTML(name);
}
