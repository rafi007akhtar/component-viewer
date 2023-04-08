/* eslint-disable @typescript-eslint/no-var-requires */
import { getHTML, createElem, toastEmitter } from "../../helpers/util";

const componentFiles = require.context("../html/", false, /\.html$/).keys();

// List of all the components
// DONE: figure out a way to make this list dynamic, so that it automatically lists the components from the folder
const COMPONENTS = componentFiles.map((file) => {
  const extensionInd = file.lastIndexOf(".");
  const FIST_LETTER_IND = 2; // because files are retrieved like './component1.html'
  return file.substring(FIST_LETTER_IND, extensionInd);
});

let selectedComponent = null;

// get some DOM elements and data that will be needed throughout the file
const componentList = document.querySelector("#component-list");
const toast = toastEmitter('generalToast', 'toast-message');
let lockedComponent = localStorage.getItem("selectedComponent");
let panelIsHidden = localStorage.getItem("panelIsHidden");
const hidePanelButton = document.querySelector("#hide-panel");
const panel = document.querySelector("#panel");
const componentView = document.querySelector("#component-view");
const clearInputButton = document.querySelector("#clear_input");

// remember the visibility of panel earlier
// if the panel was hidden while a component was locked, keep it hidden
if (panelIsHidden) {
  if (lockedComponent) {
    hidePanel();
  } else {
    localStorage.removeItem("panelIsHidden");
  }
}

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
/**
 * Hides the left panel containing component list, and gives all the columns to the selected component
 */
function hidePanel() {
  panel.style.display = "none";
  componentView.classList.remove("col-8");
  componentView.classList.add("col-12");
  toast.show("Panel Hidden! To bring it back, press Ctrl + Right Arrow Key, or refresh.");
  localStorage.setItem("panelIsHidden", "true");
}

/**
 * Brings back the left panel, if hidden.
 */
function showPanel() {
  panel.style.display = "block";
  componentView.classList.remove("col-12");
  componentView.classList.add("col-8");
  localStorage.removeItem("panelIsHidden");
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

  lockedComponent = localStorage.getItem("selectedComponent");
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
    toast.show("Please first select a component in order to lock it.");
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
  toast.show(`Component ${name} is now locked. To unlock it, press the lock key again, or click Alt + Shift + L.`);
}

/** Unlock the currently locked component, and show a toast message on success. */
function unlockSelectedComponent() {
  localStorage.removeItem("selectedComponent");
  lockComponentButton.classList.remove("locked");
  document.querySelector(".isLocked").classList.remove("isLocked");
  toast.show(`Selected component is now unlocked.`);
}

// implement clear input functionality

function clearInputField() {
  componentSearch.value = "";
  conductComponentSearch(componentSearch.value);
  focusOnInputField();
}
function focusOnInputField() {
  document.querySelector("#component-search").focus();
}
clearInputButton.onclick = clearInputField;

// KEYBOARD SHORTCUTS - this is where they are all defined.
document.onkeyup = (e) => {
  // console.log('key pressed:', e);  // uncomment to help when creating new shortcuts

  if (e.ctrlKey || e.code) {
    if (e.altKey && e.key === 'v') {
      document.querySelector('#btn__keyboard-shortcuts').click();
    }
    if (e.key === "ArrowRight") {
      showPanel();
    }
    if (e.key === "ArrowLeft") {
      hidePanel();
    }
    if (e.shiftKey && "S") {
      focusOnInputField();
    }
    if (e.key === 'Backspace') {
      clearInputField();
    }
  }
  if (e.altKey && e.shiftKey && "lL".match(e.key)) {
    handleLockComponent();
  }
};

const shortcutDescriptions = [
  {
    shortcut: "Ctrl + Alt + V",
    description: "Show / hide the keyboard shortcuts modal"
  },
  {
    shortcut: "Ctrl + Left Arrow Key ◀",
    description: "Hide the components panel",
  },
  {
    shortcut: "Ctrl + Right Arrow Key ▶",
    description: "Show the components panel",
  },
  {
    shortcut: "Alt + Shift + L",
    description: "Toggle lock / unlock component",
    subdescription:
      "To lock a component, select it and hit this shortcut. To unlock a component, hit this shortcut again.",
  },
  {
    shortcut: "Ctrl + Shift + S",
    description: "Puts the search bar in focus",
  },
  {
    shortcut: "Ctrl + Backspace",
    description: "Clear the contents of the search bar even when you are not focused on it"
  }
];

const shortCutsTable = document.querySelector("#keyboard-shortcuts");
shortcutDescriptions.forEach((obj) => {
  const row = createElem("tr", {
    children: [
      createElem("td", { text: obj.shortcut }),
      createElem("td", {
        text: obj.description,
        children: obj.subdescription
          ? [
              createElem("p", {
                text: obj.subdescription,
                classes: "light-text",
              }),
            ]
          : null,
      }),
    ],
  });
  shortCutsTable.append(row);
});
