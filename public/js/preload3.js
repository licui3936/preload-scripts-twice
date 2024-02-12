console.log("preload3 in view");

var count = 0;
fin.desktop.main(async () => {
    const client = await fin.InterApplicationBus.Channel.connect("channel");
    client.register("count", () => ++count);
    //setInterval(async () => {
    const result = await client.dispatch("sum", { x: 1, y: 2 });
    console.log("got result from provider: 1 + 2 = " + result);
    //}, 5000);
});
