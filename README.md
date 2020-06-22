Examples show virtual makeup try on and face touch up features which you can implement with [Banuba SDK on iOS](https://docs.banuba.com/docs/ios/ios_getting_started). Banuba SDK includes neural networks for lips, hair and skin detection and provides face touch up effect featuring skin smoothing, makeup filter, face morphing and teeth whitening.

# Getting Started

1. Get the latest Banuba SDK archive for iOS and the client token. Please fill in our form on [form on banuba.com](https://www.banuba.com/face-filters-sdk) website, or contact us via [info@banuba.com](mailto:info@banuba.com).
2. Copy `BanubaEffectPlayer.framework` and `BanubaSdk` project folder from the Banuba SDK archive into `Frameworks` dir:
    `BNBEffectPlayer/bin/BanubaEffectPlayer.framework` => `beauty-ios/Frameworks/`
    `BNBEffectPlayer/src/BanubaSdk/BanubaSdk/*` => `beauty-ios/Frameworks/`
3. Copy and Paste your client token into appropriate section of `beauty-ios/beauty-ios/Helpers/BanubaClientToken.swift`
4. Open the project in xCode, open `beauty-ios/Frameworks/BanubaSdk.xcodeproj`
5. Under `General` tab for BanubaSdk target delete the existing reference to `BanubaEffectPlayer.framework` and add a correct location for BanubaEffectPlayer which was copied during step 2.
6. Run the example.

# Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
