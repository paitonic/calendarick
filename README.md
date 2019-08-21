#

## .editorconfig
```
root = true

[*]
charset = utf-8
end_of_line = lf
indent_size = 2
indent_style = space
insert_final_newline = true
trim_trailing_whitespace = true
```

## jest
### Testing with Jest in WebStorm
https://blog.jetbrains.com/webstorm/2018/10/testing-with-jest-in-webstorm/

### Getting Started
https://jestjs.io/docs/en/getting-started.html

```
npm install jest --save-dev
jest --init
```

npm install --save-dev babel-jest
jest.config.js:
    "transform": {
      "^.+\\.jsx?$": "babel-jest"
    }

npm install @babel/preset-env --save-dev


## Jest: ReferenceError: regeneratorRuntime is not defined
https://jestjs.io/docs/en/getting-started#using-babel
https://github.com/facebook/jest/issues/3126#issuecomment-521620199
.babelrc
```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "node": "current"
        }
      }
    ]
  ]
}

```
