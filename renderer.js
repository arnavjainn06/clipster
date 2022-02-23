const { createApp } = require("vue");
const { clipboard, ipcMain } = require("electron");

createApp({
    data() {
        return {
            items: [],
            reversedItems: [],
            savedItems: [],
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
            this.reversedItems = this.items.slice().reverse();
        },
        copyToClipboard(item) {
            clipboard.writeText(item);
            this.$refs.notification.style.display = "flex";
            const index = this.items.indexOf(item);
            this.items.splice(index, 1);

            setTimeout(() => {
                this.$refs.notification.style.animation = "opacifyOut 0.4s";
                setTimeout(() => {
                    this.$refs.notification.style.display = "none";
                    this.$refs.notification.style.animation = "opacify 0.4s";
                }, 400);
            }, 2000);
        },
        copyForTab($event) {
            if ($event.code === "Enter") {
                const mainText = $event.path[0].firstChild.textContent;
                this.copyToClipboard(mainText);
            }
        },
        saveItem(text) {
            let existing = JSON.parse(localStorage.getItem("saved"));
            existing.push(text);
        },
    },
}).mount("#app");
