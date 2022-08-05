module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "globals": {
        "$": true,
        "jQuery": true,
        "GM_setting": true,
        "GM_SETTINGS": true,
        "GM": true,
        "unsafeWindow": true, 
        "GM_info": true,
        "GM_addStyle": true,
        "GM_getTab": true,
        "GM_getTabs": true,
        "GM_saveTab": true,
        "GM_xmlhttpRequest": true, 
        "document": true, 
        "console": true, 
        "location": true, 
        "setInterval": true, 
        "setTimeout": true, 
        "clearInterval": true, 
        "toggleFavoriteMenuGroup": true,
        "URLEncoder": true,
        "YT": true,
        "GLOBAL": true,
        "NOMO_DEBUG": true
    },
    "rules": {
        "no-global-assign": ["error", {"exceptions": ["page","ignores"]}],
        "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
        "no-console":0,
        "indent": [
            "error",
            4
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};