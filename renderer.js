const { createApp } = require("vue");
const { clipboard } = require("electron");

createApp({
    data() {
        return {
            items: [],
        };
    },
    mounted() {
        setInterval(this.loop, 500);
    },
    methods: {
        loop() {
            const text = clipboard.readText();
            console.log(text);
            if (this.items[this.items.length - 1] !== text) {
                this.items.push(text);
            }
        },
        copyToClipboard(item) {
            clipboard.writeText(item);
        },
    },
}).mount("#app");
