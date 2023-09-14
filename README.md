# BCF-js

Bcf-js is a [BIM Collaboration Format](https://technical.buildingsmart.org/standards/bcf/ "BIM Collaboration Format") (BCF) reader & parser.

This fork was made to read and write both BCF 2.1 and 3.0 versions.

Find it on npmjs.com https://www.npmjs.com/package/@parametricos/bcf-js

## Getting Started
To install the library use:
`npm install @parametricos/bcf-js` or `yarn add @parametricos/bcf-js`

## Using the library

For BCF-XML 3.0:
``` javascript
import { BcfReader, BcfWriter } from '@parametricos/bcf-js';
```
For BCF-XML 2.1:
``` javascript
import { BcfReader, BcfWriter } from '@parametricos/bcf-js/2.1';
```

### Reading a file:

``` javascript
  const file = "some_bcf_file.bcf"

  const reader = new BcfReader();
  
  await reader.read(file);

  const project = reader.project
  
  project.markups.forEach((markup) => {
    console.log(markup.topic);
  })

  // See ./test/BasicReadExample.js for more examples
```

### Writing a project:

``` typescript
  const bcfProject: IProject = {
    ...
  }
  
  const savePath = "./test-data/bcf3.0/Writer/WriteTest.bcf"

  const writer = new BcfWriter();
  
  const content = await writer.write(bcfproject)
  fs.writeFile(savePath, content, (err) => {})

  // See ./test/BasicWriteExample.js for more examples
```

## Contribution
There's a few ways to contribute to this project and improve it:
1. Fork the project repository and make your first pull request
2. Submit sample BCF and it's linked IFC files in the 'test' folder
3. Test it and create Issues so that we can start working on them

## License
BCF-js is licensed under the [Mozilla Public License 2.0](https://github.com/Parametricos/bcf-js/blob/6110f8ec70f86dbe1b3644441e5ca8935843d233/LICENSE "Mozilla Public License 2.0"). Please read the LICENSE file in this repository for more details. 