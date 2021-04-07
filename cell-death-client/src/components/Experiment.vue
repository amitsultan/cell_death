<template>
<div class='Experiment-container shadow-lg p-3 mb-5 bg-white rounded'>
    <div class='title_container' align="center"><h3 class='experiment_title'>{{this.id}}</h3></div>
    <br>
    <div class='progress-bar'>
        <b-progress v-if='src && details' :max="details.num_pictures"  variant="info" striped :animated="true">
            <b-progress-bar v-if='details' :value="current + 1">
                <b-progress-value>{{(current + 1)+'/'+(details.num_pictures)}}</b-progress-value>    
            </b-progress-bar>
        </b-progress>
    </div>
    <div class='outsideWrapper'>
        <input :disabled="!can_skip" type="image" class='navigation-button prev-button' v-on:click='onPrev' :src="prev"/>
        <div class='insideWrapper'>
            <canvas id="imageCanvas" class="Experiment-canvas" :height="height" :width="width"></canvas>
            <canvas id="frameCanvas" class="Experiment-canvas" :height="height" :width="width"></canvas>
        </div>
        <input :disabled="!can_skip" type="image" class='navigation-button next-button' v-on:click='onNext' :src="next"/>
    </div>
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
            <b-button class="csv_download_btn" style="margin-left:10px" v-on:click="clear">Clear Frame</b-button>
            <b-button class="csv_download_btn" v-on:click='csvDownload'>Download All Spots CSV</b-button>
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
            <td>{{ row.x.toFixed(2) }}</td>              
            <td>{{ row.y.toFixed(2) }}</td>
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
        counter:0,
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
        details: null,
        changed: false
    }),
    props: {
        id: String
    },
    methods: {hideMenuDisplayed(e) {
            if (this.menuDisplayed == true) {
                window.document.querySelector(".menu").style.display = "none";
            }
            this.menuDisplayed = false;
        },
        clear(){
            if(confirm("Are you sure you want to clear the markings?")){
                this.marks=[]
                if(this.current > 0){
                    this.marks_history[this.current]["accumulated_len"] = this.marks_history[this.current - 1]["accumulated_len"]
                }else{
                    this.marks_history[this.current]["accumulated_len"] = 1
                }
                this.marks_history[this.current]["marks"] = this.marks
                this.draw()
                this.changed=true;
            }
        },
        async normalizeMarks(){
            return new Promise((resolve, reject) =>{
                try{
                    let tmp_array = []
                    this.marks.forEach(mark => {
                        let tmp = {
                            x:  mark.x / (this.width / this.details.width),
                            y:  mark.y / (this.height / this.details.height),
                            frame: mark.frame,
                            type: mark.type,
                            id: mark.id
                        }
                        tmp_array.push(tmp)
                    })
                    resolve(tmp_array)
                }catch(error){
                    reject(error)
                }
                });
            },
        async saveCurrentFrameData(number){
            number = number>0?number:0
            this.can_skip = false
            this.normalizeMarks().then((results)=>{
            this.axios.post(this.$root.API_BASE + 'experiments/updateCsvDataById/'+this.id+'/'+number, {rows: results})
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
                console.log(error)
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
            });
                this.marks = tmp
                this.draw()
            }else{
                this.menuDisplayed = false;
                let newMark = {
                    frame:this.current,
                    x: this.pause_mark.x,
                    y: this.pause_mark.y,
                    type: this.menuType,
                    color: this.typeColor(this.menuType)
                }
                    this.menuType = 1
                await this.checkMarkProximity(newMark)
                this.draw()
            }
            await this.saveCurrentFrameData(this.current)

        },
        updateImage: async function(){
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
                frame:this.current,
                type: this.type,
                color: this.typeColor(this.type)
            }
            await this.checkMarkProximity(mark)
            this.menuDisplayed = true;
            this.changed = true;
            await this.saveCurrentFrameData(this.current)
            this.draw()
        },
        drawPoint(x, y){
            const mark = {
                id: this.counter++,
                x: x,
                y: y,
                frame: this.current,
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
                ctx.strokeStyle = mark.color;
                ctx.fillStyle = mark.color;
                ctx.arc(mark.x, mark.y, 6, 0, 2 * Math.PI);
                ctx.stroke();
            })
        },
        fetchImage: function(number){
            number = number>0?number:0
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

        },
        fetchImageData: function(number){
            number = number>0?number:0
            this.axios(this.$root.API_BASE + 'experiments/getCsvDataById/'+this.id+'/'+number)
            .then((results) => {
                let tmp_id = 1
                if(number > 0){
                    if(this.marks_history[number]){
                        tmp_id = this.marks_history[number]["accumulated_len"]
                    }
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
        },
        onPrev(){
            if(!this.can_skip || this.current == 0){
                return;
            }
            else{
                this.can_skip = false;
                if(this.changed){
                    this.saveCurrentFrameData(this.current)
                    this.changed = false;
                }
                if(this.current > 0 ){
                    this.current--
                    this.fetchImage(this.current-1).then((result)=>{
                        this.marks = []
                        this.counter = 2
                        let src = this.src
                        let prev = this.prev
                        this.next = src
                        this.src = prev
                        this.prev = result
                        this.updateImage()
                        this.fetchImageData(this.current)
                        this.draw()
                        if(this.current == 0){
                        this.prev = this.no_image
                        }
                    this.can_skip = true;
                    }).catch((error)=>{
                        this.$root.toast(
                            "Image loading Failed",
                            "Failed to fetch image from server",
                            "danger"
                        );
                        this.can_skip = true;
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
            if(!this.can_skip || this.current == this.details.num_pictures-1){
                return;
            }
            else{
                this.can_skip = false;
                if(this.changed){
                    this.saveCurrentFrameData(this.current)
                    this.changed = false;
                }
                // load next picture
                if(this.current < this.details.num_pictures-1){
                    this.current++
                    if(this.current == this.details.num_pictures-1){
                        this.prev = this.src
                        this.src = this.next
                        this.next = this.no_image
                        this.fetchImageData(this.current)
                        this.updateImage()
                        this.draw()
                        this.can_skip = true;
                    }
                    else{
                    this.fetchImage(this.current+1).then((result)=>{
                        this.marks = []
                        this.counter = 2
                        let next = this.next
                        let src = this.src
                        this.prev = src
                        this.src = next
                        this.next = result
                        this.updateImage()
                        this.fetchImageData(this.current)
                        if(this.current == this.details.num_pictures -1){
                            this.next = this.no_image
                        }
                        this.draw()
                    this.can_skip = true;
                    }).catch((error)=>{
                        this.$root.toast(
                            "Image loading Failed",
                            "Failed to fetch image from server",
                            "danger"
                        );
                        this.can_skip = true;
                    })
                } }else {
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
        this.changed = false;
        this.can_skip = true;
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
        }).catch((err)=>{console.log(err)})
    },
    async beforeMount(){
        this.current = 0
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
        this.fetchImage(this.current+1).then((result)=>{
            this.next = result
        }).catch((error)=>{
            this.$root.toast(
                "Image loading Failed",
                "Failed to fetch image from server",
                "danger"
            );
        })
    },
    async mounted() {
        let canvas = document.getElementById("frameCanvas");
        let ctx = canvas.getContext("2d");
        let items = document.getElementsByClassName("menu-item");
        this.menuDisplayed = false;
        let menuBox = window.document.querySelector(".menu");
        document.addEventListener('mousemove', this.onMouseUpdate, false);
        canvas.addEventListener('click', this.onMouseClick, false);
        this.draw()

        canvas.addEventListener("contextmenu", this.menuContext, false);
        items.forEach((item) => {
            item.addEventListener("click", this.menuItemClick, false)
        })
        window.addEventListener("click", this.hideMenuDisplayed, true);
    },
}
</script>

<style>
    @import './../scss/experiment.scss';
</style>
