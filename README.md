# GnarAutoList

**GnarAutoList** is a mod for SPT that enhances the Flea Market experience in Escape from Tarkov by allowing players to automatically list items at average prices based on live flea market data. The mod adds an "Auto-List" option in the stash context menu for quick and easy selling.

## Currently Known Bugs

- **Ignores Flea Offer Limit**: Currently you can use this mod to surpass the amount of offers you have on the flea. This will be changed in the future.
- **Does not take stack size into account**: If you auto list a stack of ammo, it will list the ENTIRE STACK for the price of a SINGLE ROUND.

## Features

- **Auto-List Items**: Automatically lists items on the Flea Market at the current average price.
- **Integrated with Flea Market Prices**: Uses live data from the flea market to determine the listing price.
- **Convenient Context Menu**: Right-click on items in your stash and select "Auto-List" to easily sell them.

## Installation

1. Place everything in BepInEx/plugins inside the BepInEx/plugins folder of your SPT install, same with user/mods/GnarAutoList

## Requirements

- SPT 3.9.x or later
- Live Flea Price data provided by [DrakiaXYZ's SPT-LiveFleaPrices](https://github.com/DrakiaXYZ/SPT-LiveFleaPrices).

## Usage

1. Launch your SPT server and client.
2. In-game, navigate to your stash.
3. Right-click on an item you wish to list and select "Auto-List".
4. The item will be listed on the Flea Market at the current average price.

## Credits

- **DrakiaXYZ**: Special thanks for providing the live flea price data through [SPT-LiveFleaPrices](https://github.com/DrakiaXYZ/SPT-LiveFleaPrices), which is essential for accurate pricing in GnarAutoList.

## License

This project is open source and licensed under the MIT License.

