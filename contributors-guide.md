# Contributors Guide

You're probably here because an open-source website or app owner is using ex-gratia to reward contributors. If that's the case, congrats! You're about to earn a little money for your hard work and dedication.

If you're trying to learn how to contribute to ex-gratia, that guide is [here](CONTRIBUTING.md).

Ex-gratia is still pretty young, and we currently only support sharing Google ad space currently. ([This is 100% permitted by Google.](https://adsense.googleblog.com/2008/07/sharing-your-ad-space.html)) So, the setup is just a few steps, and there aren't many settings to tinker with.

#### 1. Sign up for Google Adsense.
#### 2. Add the full site domain(s) to your "Sites" list in Google Adsense.
#### 3. Create a repository under your Github account called `ex-gratia-profile`.

You could even fork [this one](https://github.com/svidgen/ex-gratia-profile) ensure you get it right.

#### 4. Add a `profile.json` file to your new repository. 

If you forked mine, just edit the fields. They're not all in use yet (necessarily). But, site owners are 100% free to use these details to recognize you on their pages and/or link to *your* sites or profiles.

E.g.:

```
{
  "display_name": "Jon Wire",
  "profiles": {
    "linkedin": "https://www.linkedin.com/in/jonwire/"
  },
  "sites": {
    "the pointless dot-com": "https://www.thpeointless.com",
    "MTG Deck Analyzer": "https://mtg.deckanalyzer.com",
    "Rate My Disease": "https://www.ratemydisease.com/"
  },
  "google_adsense": {
    "publisher_id": "ca-pub-6115341109827821",
    "allowed_sites": [
      "www.thepointless.com",
      "www.svidgen.com",
      "mtg.deckanalyzer.com"
    ]
  }
}
```

**Be sure to include `allowed_sites` section.** Ex-gratia will not include you in a rotation if you haven't listed the domain for the site. This is intended to prevent ad space from going to waste by including ID's that do not have the site registered with Google Adsense (Step 2). 

#### 5. Update your GitHub profile

In order for Ex-gratia to find you, the email address to contribute with (which already shows up publicly in git logs) must be set as your "Public email" in [your Github profile](https://github.com/settings/profile).

![image](https://user-images.githubusercontent.com/8375502/115979204-36c56080-a54a-11eb-9b07-9d5e22fe547b.png)

#### 6. Profit.

Keep contributing. And make money &mdash; maybe just enough to buy a fancy coffee now and then. But, you'll know you that fancy coffee is your reward for contributing to an amazing open source website!
