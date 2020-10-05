<template>
<div class='Experiment-container'>
    {{this.marks}}<br>
    {{this.mark.x}} {{this.mark.y}}
    <br>
    <div class='outsideWrapper'>
        <b-button class='prev-button'>
            Prev
        </b-button>
        <div class='insideWrapper'>
            <canvas id="frameCanvas" class="Experiment-canvas" :height="height" :width="width"></canvas>
        </div>
        <b-button class='next-button'>
            Next
        </b-button>
    </div>
    <!-- <img id="frame" style='width: 600px; height: 600px;' v-bind:src="src"> -->
    <!-- <img id="frame2" src="..\assets\image.png">-->
    <div class="menu">
        <div class="menu-item" v-on:click="test()">New</div>
        <hr>
        <div class="menu-item" v-on:click="menuType=1">Type 1</div>
        <div class="menu-item" v-on:click="menuType=2">Type 2</div>
        <div class="menu-item" v-on:click="menuType=3">Type 3</div>
        <div class="menu-item" v-on:click="menuType='-'">Unclassified</div>
        <hr>
        <div class="menu-item" v-on:click="test()">Remove</div>
    </div>
</div>
</template>

<script>
export default {
    name: "Experiment",
    data: () => ({
        counter: 2,
        mark: {
            x: 0,
            y: 0
        },
        pause_mark: {
            x: 0,
            y: 0
        },
        image: null,
        color: "white",
        src: null,
        height: 600,
        width: 600,
        menuDisplayed: false,
        menuType: 1,
    }),
    props: {
        id: String,
        marks: Array,
        type: Number
    },
    methods: {
        hideMenuDisplayed(e) {
            if (this.menuDisplayed == true) {
                window.document.querySelector(".menu").style.display = "none";
            }
            this.menuDisplayed = false;
        },
        menuContext(e) {
            let left = e.clientX;
            let top = e.clientY;
            this.pause_mark.x = e.offsetX;
            this.pause_mark.y = e.offsetY;
            let menuBox = window.document.querySelector(".menu");
            menuBox.style.left = left + "px";
            menuBox.style.top = top + "px";
            menuBox.style.display = "block";

            arguments[0].preventDefault();

            this.menuDisplayed = true;
        },
        menuItemClick(e) {
            if (this.menuDisplayed) return;
            this.menuDisplayed = false;
            let newMark = {
                number: this.counter++,
                x: this.pause_mark.x,
                y: this.pause_mark.y,
                type: this.menuType,
                color: this.typeColor(this.menuType)
            }
            this.marks.push(newMark)
            this.draw()
        },
        onKeyPress(e) {
            let flag = false;
            if (e.keyCode == 192) {
                this.menuType = "-";
                flag = true;
            } else if (e.keyCode == 49) {
                this.menuType = 1;
                flag = true;
            } else if (e.keyCode == 50) {
                this.menuType = 2;
                flag = true;
            } else if (e.keyCode == 51) {
                this.menuType = 3;
                flag = true;
            }
            if (flag) {
                const mark = {
                    number: this.counter++,
                    x: this.mark.x,
                    y: this.mark.y,
                    type: this.menuType,
                    color: this.typeColor(this.menuType)
                }
                this.marks.push(mark)
                this.draw()
            }

        },
        updateImage() {
            let canvas = document.getElementById('frameCanvas'),
                context = canvas.getContext('2d');
            let base_image = new Image();
            base_image.src = this.src;
            base_image.onload = function () {
                context.drawImage(base_image, 0, 0, this.height, this.width);
            }
            base_image.onerror = function (e) {
                this.$root.toast(
                    "Failed to load image",
                    "Image failed to load, try again later",
                    "danger"
                );
            }
        },
        onMouseUpdate(e) {
            this.mark.x = e.offsetX;
            this.mark.y = e.offsetY;
        },
        onMouseClick(e) {
            if (this.menuDisplayed == true) return;
            let canvas = document.getElementById("frameCanvas");
            let x = e.x - canvas.offsetLeft;
            let y = e.y - canvas.offsetTop;
            this.mark.x = x;
            this.mark.y = y;
            const mark = {
                number: this.counter++,
                x: x,
                y: y,
                type: this.type,
                color: this.typeColor(this.type)
            }
            this.marks.push(mark)
            this.menuDisplayed = true;
            this.draw()
        },
        test() {
            alert("test")
        },
        typeColor(type) {
            if (type == 1) {
                return "Chartreuse"
            } else if (type == 2) {
                return "CornflowerBlue"
            } else if (type == 3) {
                return "IndianRed"
            } else {
                return "white"
            }
        },
        async draw() {
            let canvas = document.getElementById("frameCanvas");
            let ctx = canvas.getContext("2d");
            this.marks.forEach((mark) => {
                ctx.beginPath();
                ctx.strokeStyle = mark.color // line color
                ctx.fillStyle = mark.color; // line color
                ctx.arc(mark.x, mark.y, 10, 0, 2 * Math.PI);
                ctx.rect(mark.x + 12, mark.y - 29, 1, 22);
                ctx.font = "20px Arial";
                ctx.fillText(mark.type, mark.x + 16, mark.y - 15);
                ctx.stroke();
            })
        },
    },
    async created() {
        this.image = new Image();
        // this.image.src = '@/assets/images/c2_ (1).png'; //   '../assets/images/c2_ (1).png';
    },
    async beforeMount() {
        let config = {
            // example url
            url: this.$root.API_BASE + '/experiments/getImageById/' + this.id + '/1',
            method: 'GET',
            responseType: 'blob'
        }
        this.axios(config)
            .then((response) => {
                let reader = new FileReader();
                reader.readAsDataURL(response.data);
                reader.onload = () => {
                    this.src = reader.result;
                    this.updateImage()
                }
            });
    },
    async mounted() {
        let canvas = document.getElementById("frameCanvas");
        let ctx = canvas.getContext("2d");
        let items = document.getElementsByClassName("menu-item");
        this.menuDisplayed = false;
        let menuBox = window.document.querySelector(".menu");
        document.addEventListener('mousemove', this.onMouseUpdate, false);
        canvas.addEventListener('click', this.onMouseClick, false);
        document.addEventListener('keydown', this.onKeyPress, true);
        this.draw()
        //var img = document.getElementById("frame2");
        //console.log(img)
        //ctx.drawImage(img, 30, 30, 100, 100);

        canvas.addEventListener("contextmenu", this.menuContext, false);
        items.forEach((item) => {
            item.addEventListener("click", this.menuItemClick, false)
        })
        window.addEventListener("click", this.hideMenuDisplayed, true);
    },
}
</script>

<style>
.menu {
    background-color: white;
    width: 150px;
    box-shadow: 3px 3px 5px #888888;
    border-style: solid;
    border-width: 1px;
    border-color: grey;
    border-radius: 2px;
    padding-left: 5px;
    padding-right: 5px;
    padding-top: 3px;
    padding-bottom: 3px;
    position: fixed;
    display: none;
    z-index: 10;
}

.menu-item {
    background-color: white;
    height: 20px;
}

.menu-item:hover {
    background-color: #6CB5FF;
    cursor: pointer;
}

.Experiment-container {
    width: 50%;
    margin: 0 auto;
}

.outsideWrapper {
    margin-top: 50px;
    display: flex;
    align-items: center;
    height: max-content;
}

.insideWrapper {
    height: max-content;
    width: max-content;
}

.Experiment-canvas {
    border: 1px solid #d3d3d3;
}

.prev-button {
    margin-right: 20px;
    float: left;
    height: 50px;
    width: 100px;
}

.next-button {
    margin-left: 20px;
    float: right;
    height: 50px;
    width: 100px;
}
</style>
