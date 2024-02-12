console.log("preload4 in view");

fin.desktop.main(async () => {
    console.log(location.href);
    var count = 0;
    const client = await fin.InterApplicationBus.Channel.connect("channel");
    client.register("count", () => count++);
    //setInterval(async () => {
    const result = await client.dispatch("sum", { x: 1, y: 2 });
    console.log("got result from provider: 1 + 2 = " + result);
    //}, 5000);

    setTimeout(() => {
        location.href = "http://localhost:5555/client2.html";
    }, 5000);
});
