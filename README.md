[Learn more](https://github.com/geeklearningio/gl-vsts-tasks-semver/wiki) about this extension on the wiki!

## Tasks included

* **[Encode Semver To Integer](https://github.com/geeklearningio/gl-vsts-tasks-semver/wiki/Encode Semver To Integer)**: Encode a semantic versioning number to an integer, assigning each part to configurable bits

## To contribute

1. Globally install typescript and tfx-cli (to package VSTS extensions): `npm install -g typescript tfx-cli`
2. From the root of the repo run `npm install`. This will pull down the necessary modules for the different tasks and for the build tools.
3. Run `npm run build` to compile the build tasks.
4. Run `npm run package -- --version <version>` to create the .vsix extension packages (supports multiple environments) that includes the build tasks.

## Release Notes

> **8-3-2016**
> - Added: Encode Semver To Integer

## Contributors

This extension was created by [Geek Learning](http://geeklearning.io/), with help from the community.
