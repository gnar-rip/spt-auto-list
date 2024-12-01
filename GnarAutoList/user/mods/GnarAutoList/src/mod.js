const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");

class GnarAutoList {
    static container;
    static pricesPath = path.resolve(process.cwd(), "BepInEx/plugins/GnarAutoList/prices.json");
    static updateTimer;

    postDBLoad(container) {
        console.log("GnarAutoList loaded after DB!");
        GnarAutoList.container = container;

        try {
            // Delay starting the server and updating flea market prices
            setTimeout(() => {
                this.startServer();
                this.updatePrices(true);
            }, 10000); // 10-second delay to avoid load interference during profile loading

            // Setup a refresh interval to update prices every 6 hours (adjust as needed)
            GnarAutoList.updateTimer = setInterval(() => this.updatePrices(), 6 * 60 * 60 * 1000);

        } catch (error) {
            console.error("Error during initialization:", error.message);
        }
    }

    updatePrices(fetchPrices = true) {
        try {
            let prices;

            // Fetch latest flea market data or read from disk if available
            if (fetchPrices || !fs.existsSync(GnarAutoList.pricesPath)) {
                console.log("Fetching live flea prices...");
                this.fetchPricesFromRemote();
            } else {
                this.loadPricesFromDisk();
            }
        } catch (error) {
            console.error("Error updating prices:", error);
        }
    }

    fetchPricesFromRemote() {
        try {
            const options = {
                hostname: 'raw.githubusercontent.com',
                port: 443,
                path: '/DrakiaXYZ/SPT-LiveFleaPriceDB/main/prices-regular.json',
                method: 'GET'
            };

            const req = https.request(options, (res) => {
                let data = '';

                if (res.statusCode === 301 || res.statusCode === 302) {
                    console.error("Redirect encountered while fetching prices. Aborting update.");
                    return;
                }

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    if (res.statusCode === 200) {
                        const prices = JSON.parse(data);
                        this.savePricesToDisk(prices);
                    } else {
                        console.error(`Error fetching flea prices: ${res.statusCode}`);
                    }
                });
            });

            req.on('error', (error) => {
                console.error("Error fetching live flea prices:", error);
            });

            req.end();
        } catch (error) {
            console.error("Error fetching live flea prices:", error);
        }
    }

    loadPricesFromDisk() {
        try {
            const prices = JSON.parse(fs.readFileSync(GnarAutoList.pricesPath, "utf-8"));
            console.log("Loaded prices from existing prices.json");
            this.cachedPrices = prices;
            console.log("Flea market prices updated and cached.");
        } catch (error) {
            console.error("Error loading cached prices from disk:", error);
        }
    }

    savePricesToDisk(prices) {
        try {
            // Ensure the directory exists before writing to it
            const dirPath = path.dirname(GnarAutoList.pricesPath);
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
            }

            // Store prices locally for future use
            fs.writeFileSync(GnarAutoList.pricesPath, JSON.stringify(prices, null, 2));
            console.log("Prices saved to prices.json successfully.");
            this.cachedPrices = prices;
            console.log("Flea market prices updated and cached.");
        } catch (error) {
            console.error("Error saving prices to disk:", error);
        }
    }

    startServer() {
        const server = http.createServer((req, res) => {
            if (req.method === "GET" && req.url === "/prices") {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(this.cachedPrices || {}));
            } else {
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Not found" }));
            }
        });

        const port = 7979;
        server.listen(port, () => {
            console.log(`GnarAutoList server running at http://127.0.0.1:${port}`);
        });
    }
}

module.exports = { mod: new GnarAutoList() };
