GnarAutoList

GnarAutoList is a mod for SPT that enhances the Flea Market experience in Escape from Tarkov by allowing players to automatically list items at average prices based on live flea market data. The mod adds an "Auto-List" option in the stash context menu for quick and easy selling.
Currently Known Bugs

    Ignores Flea Offer Limit: Currently, you can use this mod to surpass the amount of offers you have on the flea. This will be changed in the future.
    Does Not Take Stack Size into Account: If you auto list a stack of ammo, it will list the ENTIRE STACK for the price of a SINGLE ROUND.

Features

    Auto-List Items: Automatically lists items on the Flea Market at the current average price.
    Integrated with Flea Market Prices: Uses live data from the flea market to determine the listing price.
    Convenient Context Menu: Right-click on items in your stash and select "Auto-List" to easily sell them.

Installation

    Place everything in BepInEx/plugins inside the BepInEx/plugins folder of your SPT install, same with user/mods/GnarAutoList.

Requirements

    SPT 3.9.x or later
    Live Flea Price Data provided by DrakiaXYZ's SPT-LiveFleaPrices.

Usage

    Launch your SPT server and client.
    In-game, navigate to your stash.
    Right-click on an item you wish to list and select "Auto-List".
    The item will be listed on the Flea Market at the current average price.

Credits

    DrakiaXYZ: Special thanks for providing the live flea price data through SPT-LiveFleaPrices, which is essential for accurate pricing in GnarAutoList.

License

This project is open source and licensed under the MIT License.
Patch Notes

Version 1.1.0 - Update Date: November 28, 2024
New Features and Improvements

    Player Level Restriction:
        Players below level 15 are now restricted from using the Auto-List feature, ensuring early-game progression maintains a balance before accessing the Flea Market.

    Reputation-Based Flea Market Limit:
        Flea market listing limits are now dynamically set based on the player's Ragfair reputation level. Players can only list a certain number of items based on their reputation, with higher levels allowing more listings.

    Item Listing Functionality:
        Players can now list items automatically via the "Auto-List" option, which appears in the stash context menu. Items will be priced based on live market data or use a default fallback price if data is not available.

    Stability and Performance Improvements:
        Removed the problematic coroutine for monitoring RagfairInfo initialization, which previously caused game launch to hang. This significantly improves stability.
        Optimized profile ID retrieval to prevent unnecessary repeated calls, leading to better in-game performance.

    Bug Fixes:
        Fixed an issue where item prices were not correctly fetched from cached price data.
        Corrected the item listing logic to ensure only items present in the player’s inventory are listed.
        Addressed the problem where the flea market offer count wasn't updating properly, allowing players to list more offers than intended.

    Logging Enhancements:
        Improved logging to provide better insights when listing items, checking player reputation, or when encountering issues.
        Removed redundant and excessive logging to minimize console spam during gameplay.

Known Issues

    Context Menu Button Placement:
        The "Auto-List" button does not always appear at the bottom of the context menu. This will be addressed in future updates.
    Button Visibility Outside Stash:
        The "Auto-List" button currently appears in some non-stash menus. Planned updates will ensure it only shows in the stash context.



