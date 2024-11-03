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
            // Attempt to resolve necessary services for price updates and configurations
            const services = [
                "ConfigServer"
            ];

            services.forEach((service) => {
                try {
                    const resolvedService = container.resolve(service);
                    this[service] = resolvedService; // Store reference to the resolved service for later use
                    console.log(`${service} resolved successfully.`);
                } catch (error) {
                    console.error(`Error resolving ${service}:`, error.message);
                }
            });

            // Delay updating flea market prices on startup by 5 seconds to ensure data is loaded
            setTimeout(() => {
                this.updatePrices(true);
            }, 5000);

            // Setup a refresh interval to update prices every hour
            GnarAutoList.updateTimer = setInterval(() => this.updatePrices(), 60 * 60 * 1000);

            // Start the HTTP server
            this.startServer();

        } catch (error) {
            console.error("Error during service resolution:", error.message);
        }
    }

    updatePrices(fetchPrices = true) {
        try {
            let prices;

            // Fetch latest flea market data or read from disk if available
            if (fetchPrices || !fs.existsSync(GnarAutoList.pricesPath)) {
                console.log("Fetching live flea prices...");
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
                            const redirectUrl = new URL(res.headers.location);
                            options.hostname = redirectUrl.hostname;
                            options.path = redirectUrl.pathname;
                            https.request(options, this.handleRedirect.bind(this));
                            return;
                        }

                        res.on('data', (chunk) => {
                            data += chunk;
                        });

                        res.on('end', () => {
                            if (res.statusCode === 200) {
                                prices = JSON.parse(data);

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
                    return;
                }
            } else {
                prices = JSON.parse(fs.readFileSync(GnarAutoList.pricesPath, "utf-8"));
                console.log("Loaded prices from existing prices.json");
                this.cachedPrices = prices;
                console.log("Flea market prices updated and cached.");
            }
        } catch (error) {
            console.error("Error updating prices:", error);
        }
    }

    handleRedirect(res) {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            if (res.statusCode === 200) {
                let prices = JSON.parse(data);
                // Store prices locally for future use
                fs.writeFileSync(GnarAutoList.pricesPath, JSON.stringify(prices, null, 2));
                console.log("Prices saved to prices.json successfully.");
                this.cachedPrices = prices;
                console.log("Flea market prices updated and cached.");
            } else {
                console.error(`Error fetching redirected flea prices: ${res.statusCode}`);
            }
        });
    }

    startServer() {
        const server = http.createServer((req, res) => {
            if (req.method === "GET" && req.url === "/prices") {
                // Provide the cached prices to the client if requested
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