# ex-gratia

> adj. As a favour; given as a gift. ([Wiktionary](https://en.wiktionary.org/wiki/ex_gratia))

Ex-gratia gives website and app owners a hands-off mechanism to share revenue with contributuors.

Ex-gratia currently support google ads as a revenue source. To facilitate revenue sharing, ex-gratia shares your ad space with a "raffle" of Google Publisher ID's, [ala Google's ad space sharing recommendation](https://adsense.googleblog.com/2008/07/sharing-your-ad-space.html). (We *are* planning on adding others revenue sources.)

## Installation and Setup

#### 1. Install from NPM.

```
npm install ex-gratia
```

Or

```
yarn add ex-gratia
```

#### 2. Update your `package.json`.

Run the `ex-gratia` CLI prior to builds. This will scrape your git log and write contributor data to the `ex-gratia` module.

```
"build": "npx ex-gratia && ..."
```

Or

```
"build": "yarn ex-gratia && ..."
```

#### 3. Include the Google Adsense tag in your app.

At runtime on the client, use the provided DOM node:

```
const GoogleAds = require('ex-gratia/google');
const ga = new GoogleAds();
document.head.appendChild(ga.node);
```

The provided node is generated once per instantiation of the `GoogleAds` class.

#### 4. Let your contributors know.

Before contributors can benefit, they need to create an ex-gratia profile and add your site to their adsense account. (Otherwise, we can't find them and/or Google won't allow you to show ads on their behalf.)

You may direct contributors to the [Contributors Guide](contributors-guide.md).
