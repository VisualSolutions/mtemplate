# MVision-Template CLI
This tool is used to create and maintain MVision HTML Templates.

To install the cli tool:

```
npm install mtemplate -g
```

In order to get started, you will have to:

```
mkdir my-new-template
cd my-new-template
npm init
npm install mtemplate-loader --save
mtemplate init
```

This will create a default `mframe.json`, `index.html` and `mtemplate.json` for the template. In order to add a couple of components and parameters, you can:

```
mtemplate mframe add myComponent1 myParameter1 --type string
mtemplate mframe add myComponent1 myParameter2 --type int
mtemplate mframe list --all
```

In order to launch a live-server that will open index.html with all the paths configured correctly, you can run

```
mtemplate watch
```

When you are done developing, you can simply run

```
mtemplate compile
```

## Adding dependencies
If you want to use any dependencies (npm, bower, etc) you will have to:

1) run npm/bower/etc install
2) manually edit the `mtemplate.json` file to add the file or folder e.g. `node_modules/some_module/release` or `bower_components/angular/release/angular.js`.
3) `watch` and `compile` should now work properly.
