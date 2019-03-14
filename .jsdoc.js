module.exports = {
    "plugins": [
        "plugins/markdown",
        "plugins/shout"
    ],
    "opts": {
        "encoding": "utf8",
        "destination": "docs/",
        "recurse": true,
        "readme": "README.md",
        "tutorials": "tutorials/",
        "template": "node_modules/ink-docstrap/template"
    },
    "recurseDepth": 10,
    "source": {
        "include": "lib/",
        "includePattern": ".+\\.js(doc|x)?$",
        "excludePattern": "(^|\\/|\\\\)_"
    },
    "sourceType": "module",
    "tags": {
        "allowUnknownTags": true,
        "dictionaries": [
            "jsdoc"
        ]
    },
    "templates": {
        "cleverLinks": false,
        "monospaceLinks": false,
        "theme": "cosmo",
        "default": {
            "outputSourceFiles": true
        }
    },
};
