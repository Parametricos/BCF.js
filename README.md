# bcf-js

### Warning: this is experimental software

bcf-js is a [BIM Collaboration Format](https://technical.buildingsmart.org/standards/bcf/ "BIM Collaboration Format") (BCF) reader & parser.

https://www.npmjs.com/package/@parametricos/bcf-js

## Installing the library
`npm install @parametricos/bcf-js` or `yarn add @parametricos/bcf-js`

## Using the library

```
  import { BcfReader } from '@parametricos/bcf-js';

  ...

  const file = "some_bcf_file.bcf"

  const reader = new BcfReader();
  
  await reader.read(file);
  
  reader.topics.forEach((topic) => {
    console.log(topic);
  })
  
```
