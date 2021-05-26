# bcf-js

bcf-js is a [BIM Collaboration Format](https://technical.buildingsmart.org/standards/bcf/ "BIM Collaboration Format") (BCF) reader & parser.
bcf-js is ready for BCF 2.1

Find it on npmjs.com https://www.npmjs.com/package/@parametricos/bcf-js

### Note: This software is experimental (WIP)

## Getting Started
To install the library use:
`npm install @parametricos/bcf-js` or `yarn add @parametricos/bcf-js`

## Contribution
There's a few ways to contribute to this project and improve it:
1. Fork the project repository and make your first pull request
2. Submit sample BCF and it's linked IFC files in the 'test-data' folder
3. Test it and create Issues so that we can start working on them

Please feel free to contact us about contributing at info@parametricos.com or send us a message on [Linkedin](https://www.linkedin.com/company/parametricos/), [Twitter](https://twitter.com/parametricoscom) & [Instagram](https://www.instagram.com/parametricoscompany/)

## Join our Community
Ask us to invite you to our Slack Channels or join our newly created community on [Discord](https://discord.gg/GVx6tARC)

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
## Developed
BCF-js is developed and maintained by [Parametricos Ltd.](https://parametricos.com "Parametricos Ltd.") for [Studio 3DX](https://studio3dx.com "Studio 3DX.") and was open sourced on the 26th of May 2021 in the name of BIM and it's community!

## License
BCF-js is licensed under the [Mozilla Public License 2.0](https://github.com/Parametricos/bcf-js/blob/6110f8ec70f86dbe1b3644441e5ca8935843d233/LICENSE "Mozilla Public License 2.0"). Please read the LICENSE file in this repository for more details. 
