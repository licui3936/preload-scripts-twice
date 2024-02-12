console.log("preload2");

fin.desktop.main(async () => {
    const provider = await fin.InterApplicationBus.Channel.create("channel");
    provider.onConnection((identity, payload) => {
        console.log("onConnection identity: ", JSON.stringify(identity));
        setTimeout(async () => {
            // setInterval(async () => {
            const c = await provider.dispatch(identity, "count");
            console.log("provider got count from client:" + c);
            //}, 5000);
        }, 1);
    });
    provider.onDisconnection((identity) => {
        console.log("onDisconnection identity: ", JSON.stringify(identity));
    });

    provider.register("sum", ({ x, y }) => {
        return x + y;
    });
});
