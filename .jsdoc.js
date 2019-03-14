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
        "copyright": "© 2018, BidiPass LTD",
        "footer": "<span class='jsdoc-message'>BidiPass. Bringing Security to All Digital Transactions. BidiPass is an identity authentication protocol designed to strengthen today’s KYC model that global businesses depend on.</span>",
        "systemName": "BidiPass SDK",
        "navType": "inline",
        "linenums": true,
        "theme": "cosmo",
        "default": {
            "outputSourceFiles": true
        }
    },
};
