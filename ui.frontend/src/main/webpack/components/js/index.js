/* eslint-disable @typescript-eslint/no-var-requires */
import { getHTML } from "../../helpers/util";

const componentFiles = require.context("../html/", false, /\.html$/).keys();

// List of all the components
// DONE: figure out a way to make this list dynamic, so that it automatically lists the components from the folder
const COMPONENTS = componentFiles.map((file) => {
  const extensionInd = file.lastIndexOf(".");
  const FIST_LETTER_IND = 2; // because files are retrieved like './component1.html'
  return file.substring(FIST_LETTER_IND, extensionInd);
});

let selectedComponent = null;

// get some DOM elements that will be needed throughout the file
const componentList = document.querySelector("#component-list");
const generalToast = document.querySelector("#generalToast");
const toast = bootstrap.Toast.getOrCreateInstance(generalToast);
const toastMessageElem = document.querySelector('#toast-message');
let lockedComponent = localStorage.getItem("selectedComponent");

/**
 * To generate the list of components on the left panel of the index page
 * @param {string} searchTerms (optional) The search terms user enters on the input field.
 * When not supplied, it will list all the components.
 */
function generateComponentList() {
  componentList.innerHTML = "";
  let searchedComponents = [...COMPONENTS];

  const lockIcon = document.createElement("i");
  lockIcon.setAttribute("class", "fa-solid fa-lock component_lock_indicator");
  lockIcon.setAttribute(
    "title",
    // eslint-disable-next-line max-len
    "This component has been locked. That means when you refresh, this component will load automatically. To unlock this component, toggle the Lock button in the toolbar."
  );

  searchedComponents.forEach((comp) => {
    const el = document.createElement("button");
    el.setAttribute("type", "button");
    el.setAttribute("class", `list-group-item list-group-item-action ${comp}`);
    el.innerHTML = comp + lockIcon.outerHTML;
    el.onclick = () => {
      selectAComponent(comp, el);
    };
    componentList.append(el);
  });
}
generateComponentList();

// set event listener for search
const componentSearch = document.querySelector("#component-search");
componentSearch.onkeyup = () => {
  conductComponentSearch(componentSearch.value);
};

/**
 * Uses the search terms provided in the input field to show only the matching components
 * @param {string} searchTerms The search keywords entered in the input field
 */
function conductComponentSearch(searchTerms) {
  const components = document.querySelectorAll("#component-list > button");
  components.forEach((comp) => {
    if (comp.innerText.toLowerCase().includes(searchTerms.toLowerCase())) {
      comp.classList.remove("hide");
    } else {
      comp.classList.add("hide");
    }
  });
}

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
  toastMessageElem.innerText = 'Panel Hidden! To bring it back, press Ctrl + Right Arrow Key, or refresh.';
  toast.show();
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

/**
 * Pass the name and HTML element of the component to be selected, and it will be displayed in the DOM.
 * Also, the corresponding component name will be highlighted on the left pane.
 * @param {string} name the name of the component
 * @param {HTMLElement} el (optional) the HTML element for the component.
 *  If not provided, it will fetch the class `.${name}` as the component.
 */
function selectAComponent(name, el) {
  if (!el) {
    el = document.querySelector(`.${name}`);
  }

  const currentlyActive = document.querySelector(".list-group-item.active");
  if (currentlyActive) {
    currentlyActive.classList.remove("active");
  }
  el.classList.add("active");
  if (lockedComponent && lockedComponent === name) {
    el.classList.add("isLocked");
  }
  selectedComponent = name;
  displayComponent(name);
}

/**
 * Dump the HTML of the selected component in the div created for the dump.
 * @param {string} name Name of the HTML file without .html extension
 */
function displayComponent(name) {
  dump.innerHTML = getHTML(name);
}

/**
 * Automatically load a locked component.
 */
const lockComponentButton = document.querySelector("#lock_component");
if (lockedComponent) {
  lockComponentButton.classList.add("locked");
  selectAComponent(
    lockedComponent,
    document.querySelector(`.${lockedComponent}`)
  );
}

lockComponentButton.onclick = () => {
  if (!selectedComponent) {
    toastMessageElem.innerText = 'Please first select a component in order to lock it.';
    toast.show();
    return;
  }
  handleLockComponent();
};

/**
 * This function will run when the lock button is toggled.
 * If a component is selected and no component is locked, it will lock the selected component.
 * If a component is already locked, it will unlock that component.
 * If no component is selected and no component is locked,
 *  it will show an error message asking user to select a component.
 */
function handleLockComponent() {
  lockedComponent = localStorage.getItem("selectedComponent");

  if (lockedComponent) {
    unlockSelectedComponent();
  } else if (!lockedComponent && selectedComponent) {
    lockAComponent(selectedComponent);
  }
}

/**
 * Lock the given component, and show a toast message on success.
 * @param {string} name the name of the component file without .html extension
 */
function lockAComponent(name) {
  localStorage.setItem("selectedComponent", name);
  lockComponentButton.classList.add("locked");
  document.querySelector(`.${name}`).classList.add("isLocked");
  // eslint-disable-next-line max-len
  toastMessageElem.innerText = `Component ${name} is now locked. To unlock it, press the lock key again, or click Alt + Shift + L.`;
  toast.show();
}

/** Unlock the currently locked component, and show a toast message on success. */
function unlockSelectedComponent() {
  localStorage.removeItem("selectedComponent");
  lockComponentButton.classList.remove("locked");
  document.querySelector(".isLocked").classList.remove("isLocked");
  toastMessageElem.innerText = `Selected component is now unlocked.`;
  toast.show();
}

// KEYBOARD SHORTCUTS - this is where they are all defined.
document.onkeyup = (e) => {
  if (e.ctrlKey) {
    if (e.key === "ArrowRight") {
      showPanel();
    }
    if (e.key === "ArrowLeft") {
      hidePanel();
    }
  }
  if (e.altKey && e.shiftKey && 'lL'.match(e.key)) {  // left Alt + left Shift + L (or l)
    handleLockComponent();
  }
};
