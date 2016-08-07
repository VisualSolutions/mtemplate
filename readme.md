# MVision-Template CLI

## Prerequisites
This tool helps you create and maintain MVision HTML Templates. In order to be able to use this tool, you will need to have `node-6.3.0`. Open a new command prompt and type `node --version` and upgrade as necessary from https://nodejs.org/en/

## Installation

To install the cli tool you only need to run `npm install mtemplate -g` from the command prompt. Run `mtemplate` afterwards to test the installation. You should see an output similar to:
```shell
Commands:
  compile           Create the template zip file. Please see the documentation
                    and the mtemplate.json file for details.
  init              Initialise current folder with the MVision Template
                    prerequisites
  mframe <command>  View or alter the mframe.json components and parameters.
  watch             Start live-server on the current directory.

Options:
  --help  Show help                                                    [boolean]

Not enough non-option arguments: got 0, need at least 1
```

## Creating a new template
Mtemplate works on top of npm, so it needs to be inside a npm package. It requires a `package.json` and at least the helper `mtemplate-loader` package present.

In order to set these up, you will need to create a new directory. Let's create a new template named `my-new-template`:
```shell
mkdir my-new-template
cd my-new-template
npm init
npm install mtemplate-loader --save
```

The next step is to initialise the template using `mtemplate init`. By default, mtemplate has verbose output so you should see something like:
```shell
[11:15:54] Found package.json...
[11:15:54] Found template-loader...
[11:15:54] Found no mframe.json. Creating default file.
[11:15:54] Found no index.html. Creating default file.
[11:15:54] Found no mtemplate.json. Creating default file.
[11:15:54] Checks ok. You can now add components or parameters, run the live server to test your template or prepare to publish.
```

This will create a default 
- `mframe.json`, file that defines components and parameters that can be viewed and edited in the template editor and advanced, as well as sent to the template when running in preview or on the player, 
- `index.html`, the default page that gets loaded in preview or on players, and 
- `mtemplate.json` (file used to resolve npm/bower and other file dependencies needed for `watch` and `compile`) for the template.

## Creating and updating components and parameters

You can always see the options available for viewing, creating or updating parameters by typing `mtemplate mframe`, since these operations all involve working with the `mframe.json` file. The help output is:
```shell
mtemplate mframe <command>

Commands:
  add <component> [parameter] [options]  Creates <component> if does not already
                                         exist. Adds [parameter] to component.
  list [options]                         Show the components inside mframe.json.
  remove <component> [parameter]         Removes <component>. If [parameter] is
                                         present, only removes that parameter.

Options:
  --help  Show help                                                    [boolean]
```

### Adding components and parameters
The `mframe add` command takes a `component`, `parameter` and optional `type`. 

If only a `component` is present, it will create a component with the specified name if one does not exist. If one exists it does nothing. The component also gets a default label for `en-US` with the name identical to the component name and a default tooltip. These should be edited manually in the `mframe.json` file.

If a `component` and a `parameter` is present, it will create or find the specified component and create the parameter if it does not exist. The parameter also gets a default label for `en-US` with the name identical to the parameter name and a default tooltip. These should be edited manually in the `mframe.json` file. 

If an optional `type` is present, the parameter is created using the specified type. The list of allowed types is: `array`, `bool`, `color`, `int`, `intRange`, `mediaReference`, `array`, `bool`, `color`, `int`, `intRange`, `mediaReference`, `multiselect`, `multiselect-btngroup`, `rangedInt`, `select`, `select-btngroup`, `select-fontSelect`, `select-fontSize`, `select-images`, `select-radio`, and `string` as default. Depending on the type, there will be some default/pre-filled `typeOptions` for some parameters.

### Listing components and parameters
`mtemplate mframe list` will show a list of components and the number of parameters each component has. If you want a more detailed view, you can add the `--all` flag which will also go through all parameters.

`mtemplate mframe list --component=comp` will show all components that start with the word `comp`. `mtemplate mframe list --component=0` will show the first component (index 0).

`mtemplate mframe list --component=comp --parameter=param` will show all components that start with `comp` and of their parameters that match `param`. You can also get parameters by index as with components.

### Removing components and parameters
`mtemplate mframe remove component parameter` will remove the parameter from component.
`mtemplate mframe remove component` will remove the component if empty. If you want to remove a non-empty component, use the `--force`.

## Development
In order to test your template, you can launch a live-server that will open index.html with all the paths configured correctly using `mtemplate watch`. This will launch a `live-server` instance that will watch for changes in your files and refresh the browser automatically.

## Compiling
When you are done developing, you can simply run `mtemplate compile`. This will create a zip file that is named like your `package.json` name plus version. You should run `npm version patch` to update the version number before your next compile.

## Adding dependencies
If you want to use any dependencies (npm, bower, etc) you will have to:

1) run npm/bower/etc install
2) manually edit the `mtemplate.json` file to add the file or folder e.g. `node_modules/some_module/release` or `bower_components/angular/release/angular.js`.
3) `watch` and `compile` should now work properly.
