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

            // let object = {
            //     text: text,
            //     saved: this.inStorage(text),
            // };

            let object = text;

            if (this.items[this.items.length - 1] !== object) {
                this.items.push(object);
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
            console.log(text);
            let existing = JSON.parse(localStorage.getItem("saved"));
            // console.log(existing);
            if (
                existing === null ||
                existing === undefined ||
                existing === "undefined"
            ) {
                existing = [];
                existing.push(text);
                localStorage.setItem("saved", JSON.stringify(existing));
                console.log(localStorage);
            } else {
                if (!existing.includes(text)) {
                    existing.push(text);
                    localStorage.setItem("saved", JSON.stringify(existing));
                    console.log(localStorage);
                } else {
                    console.log("Message in saved!");
                }
            }
        },
        inStorage(data) {
            // let existing = JSON.parse(localStorage.getItem("saved"));
        },
    },
}).mount("#app");
