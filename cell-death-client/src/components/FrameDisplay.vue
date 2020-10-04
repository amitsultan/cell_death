<template>
<div>
    <div class="menu">
        <div class="menu-item" v-on:click="test()">New</div>
        <hr>
        <div class="menu-item">Type 1</div>
        <div class="menu-item">Type 2</div>
        <div class="menu-item">Type 3</div>
        <div class="menu-item" v-on:click="newMark()">Unclassified</div>
        <hr>
        <div class="menu-item" v-on:click="test()">Remove</div>
    </div>
    {{this.mark.x}} {{this.mark.y}}
    <br>
    <img id="frame" v-bind:show="src?true:false" style="border:1px solid #d3d3d3; right: 51px; position: fixed; width: 600px; height: 600px;" src='../assets/images/c2_ (1).png'>{{src?src:'@/assets/images/c2_ (1).png'}}
    <canvas id="frameCanvas" width="600" height="600" style="border:1px solid #d3d3d3; right: 50px; position:fixed"></canvas>
    <!--  <img id="frame" v-bind:src="src">
    <img id="frame2" src="..\assets\image.png">-->
</div>
</template>

<script>
export default {
    name: "FrameDisplay",
    data: () => ({
        counter: 2,
        mark: {
            x: 0,
            y: 0
        },
        image: null,
        color: "white",
    }),
    props: {
        src: String,
        marks: Array,
        type: Number
    },
    methods: {
        onKeyPress(e) {
            let flag = false;
            if (e.keyCode == 192) {
                this.type = "-";
                flag = true;
            } else if (e.keyCode == 49) {
                this.type = 1;
                flag = true;
            } else if (e.keyCode == 50) {
                this.type = 2;
                flag = true;
            } else if (e.keyCode == 51) {
                this.type = 3;
                flag = true;
            }
            if (flag) {
                const mark = {
                    number: this.counter++,
                    x: this.mark.x - document.getElementById("frameCanvas").offsetLeft,
                    y: this.mark.y - document.getElementById("frameCanvas").offsetTop,
                    type: this.type,
                    color: this.typeColor(this.type)
                }
                this.marks.push(mark)
                this.draw()
            }

        },
        onMouseUpdate(e) {
            this.mark.x = e.pageX;
            this.mark.y = e.pageY;
        },
        onMouseClick(e) {
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
        this.image.src = '@/assets/images/c2_ (1).png'; //   '../assets/images/c2_ (1).png';
    },
    async mounted() {
        let canvas = document.getElementById("frameCanvas");
        let ctx = canvas.getContext("2d");
        let items = document.getElementsByClassName("menu-item");
        let menuDisplayed = false;
        let menuBox = null;

        document.addEventListener('mousemove', this.onMouseUpdate, false);
        canvas.addEventListener('click', this.onMouseClick, false);
        document.addEventListener('keydown', this.onKeyPress, true);
        this.draw()
        //var img = document.getElementById("frame2");
        //console.log(img)
        //ctx.drawImage(img, 30, 30, 100, 100);

        canvas.addEventListener("contextmenu", function () {
            let left = arguments[0].clientX;
            let top = arguments[0].clientY;

            menuBox = window.document.querySelector(".menu");
            menuBox.style.left = left + "px";
            menuBox.style.top = top + "px";
            menuBox.style.display = "block";

            arguments[0].preventDefault();

            menuDisplayed = true;
        }, false);
        items.forEach((item) => {
            item.addEventListener("click", function () {
                let left = arguments[0].clientX;
                let top = arguments[0].clientY;
                let newMark = {
                    number: this.counter++,
                    x: left,
                    y: top,
                    type: this.type,
                    color: this.typeColor(this.type)
                }
                this.marks.push(newMark)
            }, true)
        })
        window.addEventListener("click", function () {
            if (menuDisplayed == true) {
                menuBox.style.display = "none";
            }
        }, true);
    },
}
</script>

<style>
.menu {
    background-color: "white";
    opacity: 1;
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
}

.menu-item {
    background-color: "white";
    opacity: 1;
    height: 20px;
}

.menu-item:hover {
    opacity: 1;
    background-color: #6CB5FF;
    cursor: pointer;
}
</style>
