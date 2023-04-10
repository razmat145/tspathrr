# tspathrr

Resolves Typescript sourcefile absolute paths

## Description

Simple absolute path resolve of typescript source files based on input relative file paths and current `__dirname`.  

Pathrr will attempt to read the `tsconfig.json` found in the `cwd` and force absolute paths on the input source files considering the `outDir` and `rootDir` compiler opts; just so, at runtime, you don't have to care and always be aware that the relative file paths you need actually need to be relative to the `dist/` built file. 

This is especially useful when using/needing pre-built `.ts` file paths.

### Installing

```
npm install --save tspathrr
```

### Usage

```typescript
const files = await Pathrr.resolve(['./lib/model/User.ts'], __dirname);
console.error(files); // ['<cwd>/<path to source-file>/lib/model/User.ts']
```

## License
This library is licensed under the Apache 2.0 License
