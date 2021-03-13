<template>
<div class='Experiment-container'>
    <br>
    <div class='progress-bar' style="margin-left: 120px;">
        <b-progress v-if='src && details' :max="details.num_pictures"  variant="success" striped :animated="true">
        <b-progress-bar v-if='details' :value="current-1" :label="current-1+'/'+details.num_pictures"></b-progress-bar>
        </b-progress>
    </div>
    <!-- <b-progress v-if='src' :value="current" :max="60"  variant="success" :label="current" striped :animated="true" ></b-progress> -->
    <div class='outsideWrapper'>
        <!-- <b-button class='prev-button' v-on:click='onPrev'>
            Prev
        </b-button> -->
        <input :disabled="!can_skip" type="image" class='navigation-button prev-button' v-on:click='onPrev' :src="prev"/>
        <div class='insideWrapper'>
            <canvas id="imageCanvas" class="Experiment-canvas" :height="height" :width="width"></canvas>
            <canvas id="frameCanvas" class="Experiment-canvas" :height="height" :width="width"></canvas>
        </div>
        <input :disabled="!can_skip" type="image" class='navigation-button next-button' v-on:click='onNext' :src="next"/>
        <!-- <b-button class='next-button' v-on:click='onNext' :src='next'>
            Next
        </b-button> -->
    </div>
    <!-- <img id="frame" style='width: 600px; height: 600px;' v-bind:src="src"> -->
    <!-- <img id="frame2" src="..\assets\image.png">-->
    <div class="menu">
        <div class="menu-item">New</div>
        <hr>
        <div class="menu-item" v-on:click="menuType=1">Type 1</div>
        <div class="menu-item" v-on:click="menuType=2">Type 2</div>
        <div class="menu-item" v-on:click="menuType=3">Type 3</div>
        <div class="menu-item" v-on:click="menuType='-'">Unclassified</div>
        <hr>
        <div class="menu-item">Remove</div>
    </div>
    <div class="container shadow-lg p-3 mb-5 bg-white rounded table_div">
        <div class="table_top">
            <h4 class="table_header">Cell marks</h4>
            <b-button class="csv_download_btn" v-on:click='csvDownload'>Download csv</b-button>
        </div>
        <TableView
        :key="marks.length"
        v-if='marks != []'
        :headers="table_headers"
        :rows="marks"   
        :sort="{
        field: 'first_name',
        order: 'asc'
        }"
        :pagination="{
        itemsPerPage: 10,
        align: 'center',
        visualStyle: 'select'
        }"
        css-style="my-css-style"
    >
        <template v-slot:items="{ row }">
            <td>{{ row.id }}</td>  
            <td>{{ row.x }}</td>              
            <td>{{ row.y }}</td>
            <td>{{ row.frame }}</td>            
        </template>
            <template v-slot:no-data>
        <span>No data</span>
        </template>
    </TableView>
    </div>
</div>
</template>

<script>
import TableView from '../components/TableView'
export default {
    name: "Experiment",
    components:{
        TableView
    },
    data: () => ({
        counter: 1,
        pointProximity: 12,
        no_image: require('@/assets/no_image_found.png'),
        table_headers: [
            {label:"ID", field:"id", sortable:true, type:"String"},
            {label:"X cord", field:"X", sortable:true, type:"Number"},
            {label:"Y cord", field:"Y", sortable:true, type:"Number"},
            {label:"Frame", field:"frame", sortable:true, type:"Number"},
        ],
        marks: [],
        type: 1,
        mark: {
            x: 0,
            y: 0
        },
        marks_history: {}
        ,
        pause_mark: {
            x: 0,
            y: 0
        },
        can_skip: true,
        image: null,
        color: "white",
        prev: null,
        src: null,
        next: null,
        height: 600,
        width: 600,
        current: null,
        menuDisplayed: false,
        menuType: 1,
        details: null
    }),
    props: {
        id: String
    },
    computed: {
        lcurrent(){
            return this.current-1
        }
        
    },
    methods: {hideMenuDisplayed(e) {
            if (this.menuDisplayed == true) {
                window.document.querySelector(".menu").style.display = "none";
            }
            this.menuDisplayed = false;
        },
        async normalizeMarks(){
            return new Promise((resolve, reject) =>{
                try{
                    this.marks.forEach(mark => {
                        mark.x =  mark.x / (this.width / this.details.width);
                        mark.y =  mark.y / (this.height / this.details.height);
                    })
                    resolve('done')
                }catch(error){
                    reject(error)
                }
                });
            },
        async saveCurrentFrameData(number){
            number = number-1
            this.can_skip = false
            this.normalizeMarks().then(()=>{
            this.axios.post(this.$root.API_BASE + 'experiments/updateCsvDataById/'+this.id+'/'+number, {rows: this.marks})
            .then((response) => {
            this.can_skip = true
            }).catch((error)=>{
                this.can_skip = true
                this.$root.toast(
                    "Failed",
                    "Failed to send marks data to server!",
                    "danger"
                );
            });
            }).catch((error)=>{
                this.can_skip = true
                this.$root.toast(
                    "Failed",
                    "Failed to send marks data to server!",
                    "danger"
                );
            })
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
        async menuItemClick(e) {
            if (this.menuDisplayed) return;
            if(e.target.innerHTML == "Remove"){
                this.menuDisplayed = false;
                let x = this.pause_mark.x
                let y = this.pause_mark.y
                let tmp = []
                this.marks.forEach(element => {
                let a = x - element.x 
                let b = y - element.y
                if(Math.sqrt(a*a + b*b) >= this.pointProximity){
                    tmp.push(element)
                }else{
                }
                this.marks = tmp
                this.draw()
            });
            }else{
                this.menuDisplayed = false;
                let newMark = {
                    frame:this.current - 1,
                    x: this.pause_mark.x,
                    y: this.pause_mark.y,
                    type: this.menuType,
                    color: this.typeColor(this.menuType)
                }
                    this.menuType = 1
                await this.checkMarkProximity(newMark)
                this.draw()
            }
        },updateImage: async function(){
            try{
                let canvas = document.getElementById('imageCanvas'),
                context = canvas.getContext('2d');
                let base_image = new Image();
                base_image.src = this.src;
                let height = this.height
                let width = this.width
                base_image.onload = function(){
                    context.drawImage(base_image, 0, 0, width, height);
                }
                base_image.onerror = function(e) {
                    return Error(e)
                }
            }catch(error){                
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
        async csvDownload(){
            let config = {
                url: this.$root.API_BASE + 'experiments/experimentCSV/'+this.id,
                method: 'GET',
                responseType: 'blob'
            }
            // fetching Image
            this.axios(config)
            .then((response) => {
                console.log("got it")
                var fileURL = window.URL.createObjectURL(new Blob([response.data]));
                var fileLink = document.createElement('a');
                fileLink.href = fileURL;
                fileLink.setAttribute('download', this.id+'.csv');
                document.body.appendChild(fileLink);
                fileLink.click();
            }).catch((error)=>{
                console.log(error)  
            });
        },
        async checkMarkProximity(mark){
            let tmp = []
            let is_replaced = false
            this.marks.forEach(element => {
                let a = mark.x - element.x 
                let b = mark.y - element.y
                if(Math.sqrt(a*a + b*b) >= this.pointProximity){
                    tmp.push(element)
                }else{
                    if(is_replaced == false){
                        element.type = mark.type
                        element.color = this.typeColor(element.type)
                        console.log(element.type)
                        is_replaced = true
                        tmp.push(element)
                    }
                    if(element.id){
                        mark.id = element.id
                    }
                }
            });
            if(!mark.id){
                mark.id = this.counter++
            if(this.current in this.marks_history){
                this.marks_history[this.current] = {"marks":this.marks,
                                                    "accumulated_len": this.counter}
            }
            }
            if(!is_replaced)
                tmp.push(mark)
            this.marks = tmp
        },
        async onMouseClick(e) {
            if (this.menuDisplayed == true) return;
            let canvas = document.getElementById("frameCanvas");
            let x = e.offsetX;
            let y = e.offsetY;
            this.mark.x = x;
            this.mark.y = y;
            const mark = {
                x: x,
                y: y,
                frame:this.current-1,
                type: this.type,
                color: this.typeColor(this.type)
            }
            await this.checkMarkProximity(mark)
            this.menuDisplayed = true;
            this.draw()
        },
        drawPoint(x, y){
            const mark = {
                id: this.counter++,
                x: x,
                y: y,
                frame: this.current-1,
                type: this.type,
                color: this.typeColor(this.type)
            }
            this.marks.push(mark)
            this.menuDisplayed = true;
            this.draw()
        }
        ,
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
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.marks.forEach((mark) => {
                ctx.beginPath();
                ctx.strokeStyle = mark.color // line color
                ctx.fillStyle = mark.color; // line color
                ctx.arc(mark.x, mark.y, 6, 0, 2 * Math.PI);
                // ctx.rect(mark.x + 12, mark.y - 29, 1, 22);
                // ctx.font = "20px Arial";
                // ctx.fillText(mark.type, mark.x + 16, mark.y - 15);
                ctx.stroke();
            })
        },
        fetchImage: function(number){
            number = number-1 //start images from 0 and not 1 for trackmate processing
            return new Promise((resolve, reject)=>{
                let config = {
                    url: this.$root.API_BASE + 'experiments/getImageById/'+this.id+'/'+number,
                    method: 'GET',
                    responseType: 'blob'
                }
                // fetching Image
                this.axios(config)
                .then((response) => {
                    let reader = new FileReader();
                    reader.readAsDataURL(response.data); 
                    reader.onload = () => {
                        resolve(reader.result)
                    }
                    reader.onerror = (err) => {
                        reject(err)
                    }
                });
            })
        },
        normalizeCords(point){
            let norm_point = {
                x: point.x * (this.width / this.details.width),
                y: point.y * (this.height / this.details.height)
            }
            return norm_point
        },fetchImageData: function(number){
            number = number-1 //start images from 0 and not 1 for trackmate processing
            this.axios(this.$root.API_BASE + 'experiments/getCsvDataById/'+this.id+'/'+number)
            .then((results) => {
                let tmp_id = 1
                if(this.current > 1){
                    tmp_id = this.marks_history[this.current - 1]["accumulated_len"]
                }
                results.data.forEach(element => {
                    const mark = {
                        id: tmp_id,
                        x: element.x * (this.width / this.details.width),
                        y: element.y * (this.height / this.details.height),
                        frame: element.frame,
                        type: element.type,
                        color: this.typeColor(element.type)
                    }
                    tmp_id += 1
                    this.marks.push(mark)
                });
                this.marks_history[this.current] = {"marks":this.marks,
                                                    "accumulated_len": tmp_id}
                this.counter = tmp_id
            this.draw()
            }).catch((error) => {
                console.log(error)
                this.marks = []       
            })
        },onPrev(){
            if(!this.can_skip || this.current == 1){
                return;
            }
            else{
                this.saveCurrentFrameData(this.current)
                if(this.current > 1 ){
                    this.current--
                    this.fetchImage(this.current).then((result)=>{
                        this.marks = []
                        this.counter = 2
                        this.next = this.src
                        this.src = this.prev
                        this.prev = result
                        this.updateImage()
                        this.draw()
                        this.fetchImageData(this.current)
                        if(this.current == 1){
                        this.prev = this.no_image
                        }
                    }).catch((error)=>{
                        this.$root.toast(
                            "Image loading Failed",
                            "Failed to fetch image from server",
                            "danger"
                        );
                    })
                }else{
                    this.$root.toast(
                        "Reached timelapse start!",
                        "No more pictures to load!",
                        "danger"
                    );
                }
            }
        },
        onNext(){
            if(!this.can_skip || this.current == this.details.num_pictures){
                return;
            }
            else{
                this.saveCurrentFrameData(this.current)
                // load next picture
                if(this.current < this.details.num_pictures){
                    this.current++
                    this.fetchImage(this.current).then((result)=>{
                        this.marks = []
                        this.counter = 2
                        this.prev = this.src
                        this.src = this.next
                        this.next = result
                        this.updateImage()
                        this.draw()
                        this.fetchImageData(this.current)
                        if(this.current == this.details.num_pictures){
                            this.next = this.no_image
                        }
                    }).catch((error)=>{
                        this.$root.toast(
                            "Image loading Failed",
                            "Failed to fetch image from server",
                            "danger"
                        );
                    })
                } else {
                    this.$root.toast(
                        "Reached max!",
                        "No more pictures to load!",
                        "danger"
                    );
                }
            }
        }
    },
    async created() {
        this.image = new Image();
        let config = {
            url: this.$root.API_BASE + "experiments/getDetails/"+this.id,
            method: 'GET'
        }
        await this.axios(config).then((response) =>{
            if(response.status && response.status === 200){
                this.details = response.data
            }else{
                this.$root.toast(
                    "Error occurred",
                    "Couldn't fatch experiment details",
                    "danger"
                );
            }
        })
        // this.image.src = '@/assets/images/c2_ (1).png'; //   '../assets/images/c2_ (1).png';
    },
    async beforeMount(){
        this.current = 1
        this.prev = this.no_image
        this.fetchImage(this.current).then((result)=>{
            this.src = result
            this.updateImage()
            this.fetchImageData(this.current)
        }).catch((error)=>{
            this.$root.toast(
                "Image loading Failed",
                "Failed to fetch image from server",
                "danger"
            );
        })
        this.fetchImage(this.current + 1).then((result)=>{
            this.next = result
        }).catch((error)=>{
            this.$root.toast(
                "Image loading Failed",
                "Failed to fetch image from server",
                "danger"
            );
        })
        // this.src = result;
        // this.updateImage()
    },
    async mounted() {
        let canvas = document.getElementById("frameCanvas");
        let ctx = canvas.getContext("2d");
        let items = document.getElementsByClassName("menu-item");
        this.menuDisplayed = false;
        let menuBox = window.document.querySelector(".menu");
        document.addEventListener('mousemove', this.onMouseUpdate, false);
        canvas.addEventListener('click', this.onMouseClick, false);
        // document.addEventListener('keydown', this.onKeyPress, true);
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
    opacity: 0.85;
    width: 160px;
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
    opacity: 1;
    height: max-content;
    font-size: 16px;
}
hr{
    margin-top: 3px;
    margin-bottom: 3px;
}

.menu-item:hover {
    opacity: 1;
    background-color: #6CB5FF;
    cursor: pointer;
}
.Experiment-container{
    width: 50%;
    margin: 0 auto;
}
.Experiment-canvas{
    border:1px solid #d3d3d3;
}
.navigation-button{
    height: 300px;
    width: 300px;
    transition: 1s;
}
.navigation-button:hover{
  transform: scale(2);
}
.prev-button{
    margin-right:20px;
    float: left;
}
.next-button{
    margin-left:20px;
    float: right;
}
.progress-bar{
    background-color: white;
    /* color: white; */
    /* font-size: 1.25rem; */
    width: 600px;
}
.outsideWrapper{
    margin-top:50px;
    display: flex;
    align-items: center;
    height: max-content;
}
.insideWrapper{
    height: max-content;
    width: max-content;
    position: relative;
}
#frameCanvas{
    position: absolute;
    left: 0;
    top: 0;
}
#imageCanvas{
    /* position: absolute; */
}
.table_header{
    float: left;
}
.csv_download_btn, .csv_download_btn:hover, .csv_download_btn:focus, .csv_download_btn:active{
    float: right;
    background-color: #6CB5FF;
}
.table_top{
    margin-bottom:2.5em;
}
</style>
