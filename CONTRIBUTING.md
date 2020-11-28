# Contributing

## File structure

Everything goes into the `src` folder. The file structure inside the `src` folder is inspired in [Fractal](https://hackernoon.com/fractal-a-react-app-structure-for-infinite-scale-4dab943092af).

1. All components go in a file with the same name, and no file should define more than one component.
2. Root component is called `App` and goes in the `App.js` file.
3. Single use componets go in a folder with the `lisp-cased` name of the parent component and in the same directory. For example, a component called `Settings` that is used by the `App` component defined in `src/App.js` will go in `src/app/Settings.js`
4. Reusable components go in a `components` folder next to the first common ancestor of all components that are meant to use it.
5. Hooks structure is analogous to the components structure defined in rules 3 and 4.
