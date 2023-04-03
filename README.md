# Component Viewer

Maven project to view selected component from a list of components. Written in vanilla JS.

## Quickstart

- Clone the repo, and enter the root folder.
    ```sh
    git clone https://github.com/rafi007akhtar/component-viewer.git
    cd component-viewer
    ```
- Build the project. See the [How to build](#how-to-build) section below.
- Install the dependencies.
    ```sh
    npm install
    ```
- Run the project. This will open the project in http://localhost:8080/.
    ```sh
    npm start
    ```

The list of components will be shown in the left pane. Select any component, and its contents will be shown in the rest of the page.

## How to build

To build all the modules run in the project root directory the following command with Maven 3:

    mvn clean install

To build all the modules and deploy the `all` package to a local instance of AEM, run in the project root directory the following command:

    mvn clean install -PautoInstallSinglePackage

Or to deploy it to a publish instance, run

    mvn clean install -PautoInstallSinglePackagePublish

Or alternatively

    mvn clean install -PautoInstallSinglePackage -Daem.port=4503

Or to deploy only the bundle to the author, run

    mvn clean install -PautoInstallBundle

Or to deploy only a single content package, run in the sub-module directory (i.e `ui.apps`)

    mvn clean install -PautoInstallPackage
