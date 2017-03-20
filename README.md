![Icon](https://github.com/geeklearningio/gl-vsts-tasks-semver/blob/master/Extension/extension-icon.png)

# Semantic Versioning Build and Release Tasks

![cistatus](https://geeklearning.visualstudio.com/_apis/public/build/definitions/f841b266-7595-4d01-9ee1-4864cf65aa73/49/badge)

Visual Studio Team Services Build and Release Management extensions that help you work with semantic versioning.

You can find the latest stable version of the VSTS Extension tasks on the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=geeklearningio.gl-vsts-tasks-semver).

[Learn more](https://github.com/geeklearningio/gl-vsts-tasks-semver/wiki) about this extension on the wiki!

## Tasks included

* **[Encode Semver To Integer](https://github.com/geeklearningio/gl-vsts-tasks-semver/wiki/Encode-Semver-To-Integer)**: Encode a semantic versioning number to an integer, assigning each part to configurable bits

## To contribute

1. Globally install typescript and tfx-cli (to package VSTS extensions): `npm install -g typescript tfx-cli`
2. From the root of the repo run `npm install`. This will pull down the necessary modules for the different tasks and for the build tools.
3. Run `npm run build` to compile the build tasks.
4. Run `npm run package -- --version <version>` to create the .vsix extension packages (supports multiple environments) that includes the build tasks.
5. Run `npm run test` to execute the Jasmine unit tests.

## Release Notes

> **3-20-2017**
> - Fix few bugs and add unit tests

> **8-3-2016**
> - Added: Encode Semver To Integer

## Contributors

This extension was created by [Geek Learning](http://geeklearning.io/), with help from the community.

## Attributions
* [Mushroom by Lucian Novosel from the Noun Project](https://thenounproject.com/search/?q=mario&i=18500)
* [Pull request by Richard Slater from the Noun Project](https://thenounproject.com/search/?q=version&i=116190)
* [Connection by Jason D. Rowley from the Noun Project](https://thenounproject.com/search/?q=version&i=18989)
