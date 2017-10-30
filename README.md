**NOTE**: This example was developed for a concrete backend so some of the logic may seem really odd and even break.

# slot-editor

> Visual editor that makes use of shortcodes as seen in WordPress, using [mblarsen/shortcode-tokenizer](https://github.com/mblarsen/shortcode-tokenizer).

## Development

```bash
# install dependencies
yarn

# serve with hot reload at localhost:8080
yarn start

# tag for production
yarn version --new-version <major|minor|patch>
```

When running `yarn build` the library is output to `dist`.

## Installation

Include the script anywhere. It will will attach itself as new editor
placeholders are added to the DOM.

```HTML
<textarea id="slot-body" style="display: none"></textarea>
<div class="slot-editor" src="slot-body"></div>
```

The editor will attach itself to all elements with class `slot-editor`. Each
instance will use the `src` property to update the value of the element that
matches that query. In this case the hidden `textarea`.

