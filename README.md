# BCF-js

bcf-js is a [BIM Collaboration Format](https://technical.buildingsmart.org/standards/bcf/ "BIM Collaboration Format") (BCF) reader & parser.

This fork was made to read both BCF 2.1 and 3.0 versions.
Futurely will also convert versions and write BCFs.

Find it on npmjs.com https://www.npmjs.com/package/@nelsonhp3/bcf-js

## Getting Started
To install the library use:
`npm install @nelsonhp3/bcf-js` or `yarn add @nelsonhp3/bcf-js`

## Using the library

For BCF-XML 3.0:
``` javascript
import { BcfReader } from '@nelsonhp3/bcf-js';
```
For BCF-XML 2.1:
``` javascript
import { BcfReader } from '@nelsonhp3/bcf-js/2.1';
```
Reading a file:

``` javascript
  const file = "some_bcf_file.bcf"

  const reader = new BcfReader();
  
  await reader.read(file);
  
  reader.markups.forEach((markup) => {
    console.log(markup.topic);
  })
  
```

## Contribution
There's a few ways to contribute to this project and improve it:
1. Fork the project repository and make your first pull request
2. Submit sample BCF and it's linked IFC files in the 'test' folder
3. Test it and create Issues so that we can start working on them

## Developed
BCF-js is developed and maintained by [Parametricos Ltd.](https://parametricos.com "Parametricos Ltd.") for [Studio 3DX](https://studio3dx.com "Studio 3DX.") and was open sourced on the 26th of May 2021 in the name of BIM and it's community!
### Join Parametricos Community
Ask us to invite you to our Slack Channels or join our newly created community on [Discord](https://discord.gg/qcTMXVa44S)

## License
BCF-js is licensed under the [Mozilla Public License 2.0](https://github.com/Parametricos/bcf-js/blob/6110f8ec70f86dbe1b3644441e5ca8935843d233/LICENSE "Mozilla Public License 2.0"). Please read the LICENSE file in this repository for more details. 
