// uncomment line below to register offline cache service worker
// navigator.serviceWorker.register('../serviceworker.js');

if (typeof fin !== "undefined") {
    init();
} else {
    document.querySelector("#of-version").innerText =
        "The fin API is not available - you are probably running in a browser.";
}

// once the DOM has loaded and the OpenFin API is ready
let numOfWindows = 2;
async function init() {
    // get a reference to the current Application.
    const app = await fin.Application.getCurrent();

    // get a reference to the current view.
    const view = window.fin.View.getCurrentSync();

    // get a reference to the parent window fro the current view.
    const win = await view.getCurrentWindow();

    const ofVersion = document.querySelector("#of-version");
    ofVersion.innerText = await fin.System.getVersion();

    const tickerSpan = document.querySelector("#tickerSpan");
    const lastPriceSpan = document.querySelector("#lastPriceSpan");

    function handleIncomingContext(contextInfo) {
        const { type, id } = contextInfo;
        switch (type) {
            case "instrument":
                handleInstrumentContext(contextInfo);
                break;
            case "country":
                handleCountryContext(contextInfo);
                break;

            default:
                break;
        }
    }

    function handleInstrumentContext(contextInfo) {
        const { type, id } = contextInfo;
        tickerSpan.innerText = contextInfo.name;
        lastPriceSpan.innerText = contextInfo.id.LAST_PRICE;
    }

    function handleCountryContext(contextInfo) {
        const { type, id } = contextInfo;
    }

    fdc3.addContextListener(null, handleIncomingContext);

    const storeSSBtn = document.querySelector("#store");
    storeSSBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        const snapshot = await fin.Platform.getCurrentSync().getSnapshot();
        window.localStorage.setItem("snapshot", JSON.stringify(snapshot));
    });

    const restoreSSbtn = document.querySelector("#restore");
    restoreSSbtn.addEventListener("click", async (e) => {
        e.preventDefault();

        const snapshot = JSON.parse(window.localStorage.getItem("snapshot"));
        fin.Platform.getCurrentSync().applySnapshot(snapshot);
    });

    document
        .querySelector("#newwindow")
        .addEventListener("click", async (e) => {
            e.preventDefault();

            const platform = fin.Platform.getCurrentSync();
            const url = "http://localhost:5555/provider.html";
            return platform.createWindow({
                contextMenu: true,
                layout: {
                    content: [
                        {
                            type: "row",
                            content: [
                                {
                                    type: "component",
                                    componentName: "view",
                                    componentState: {
                                        url,
                                    },
                                },
                            ],
                        },
                    ],
                },
            });
        });

    function makeView(redirect) {
        return {
            type: "component",
            componentName: "view",
            componentState: {
                preloadScripts: [
                    {
                        url: redirect
                            ? "http://localhost:5555/js/preload4.js"
                            : "http://localhost:5555/js/preload3.js",
                    },
                ],
                url: "http://localhost:5555/client.html",
            },
        };
    }
    document
        .querySelector("#multiviewswindow")
        .addEventListener("click", async (e) => {
            e.preventDefault();
            const contentArray = [];
            for (i = 0; i < numOfWindows; i++) {
                // contentArray.push(makeView(`v-${Date.now()}`));
                contentArray.push(makeView(i % 2 === 0 ? false : false));
            }
            const platform = fin.Platform.getCurrentSync();
            const win = await platform.createWindow({
                name: `multiviewswin-${Date.now()}`,
                contextMenu: true,
                layout: {
                    content: [
                        {
                            type: "stack",
                            content: contentArray,
                        },
                    ],
                },
            });
            const layout = await fin.Platform.Layout.wrapSync(win.identity);
            await layout.applyPreset({ presetType: "grid" });
        });
}
