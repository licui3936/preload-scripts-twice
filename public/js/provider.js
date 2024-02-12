if (typeof fin !== "undefined") {
    init();
} else {
    document.querySelector("#of-version").innerText =
        "The fin API is not available - you are probably running in a browser.";
}

async function init() {
    const instument = document.getElementById("instument");
    const lastPrice = document.getElementById("lastPrice");

    const broadcastButton = document.querySelector("#broadcastBtn");
    broadcastButton.addEventListener("click", async (e) => {
        e.preventDefault();

        fdc3.broadcast({
            type: "instrument",
            name: instument.value,
            id: { LAST_PRICE: lastPrice.value },
        });
    });
    /*
    let count = 1;
    setInterval(myTimer, 1000);

    function myTimer() {
        count++;
        fdc3.broadcast({
            type: "instrument",
            name: "VOD LN Equity",
            id: { LAST_PRICE: count },
        });
    }
    */
}
