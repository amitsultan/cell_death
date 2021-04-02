<template>
<div class="container">
  <div class="row">
    <div class="col-12 col-sm-6 col-md-4 col-lg-3">
        <div class="our-team">
        <div class="picture">
            <img class="img-fluid" :src='src'>
        </div>
        <div class="team-content">
            <h3 class="name">{{title}}</h3>
            <h4 class="title">Web Developer</h4>
        </div>
        <ul class="social">
            <li><a class='a_link' :href="details.facebook"><img :src='icons.facebook' class="fa fa-facebook" aria-hidden="true"></a></li>
            <li><img :src="icons.linkedin" class="fa fa-linkedin" aria-hidden="true"></li>
            <li><img :src="icons.google" class="fa fa-google-plus" aria-hidden="true"></li>
        </ul>
        </div>
    </div>
  </div>
</div>
</template>

<script>
import facebook from "./../assets/icons/fb_icon.png";
import linkedin from "./../assets/icons/li_icon.png";
import google from "./../assets/icons/google_icon.png";
export default {
    name: "card2",
    props: {
      title: {
        type: String,
        description: "Card title"
      },
      details: {
        type: Object,
      },
      src: {
        type: String,
        description: "Card image src"
      }
    },
    data: function () {
    return {
      icons:{
        facebook: facebook,
        linkedin: linkedin,
        google: google
      }
    }
  }
}
</script>

<style>
.our-team {
  padding: 30px 0 40px;
  width: 300px ;
  margin-bottom: 30px;
  background-color: white;
  text-align: center;
  overflow: hidden;
  position: relative;
  -moz-box-shadow:    inset 0 0 15px #6CB5FF;
  -webkit-box-shadow: inset 0 0 15px #6CB5FF;
  box-shadow:         inset 0 0 15px #6CB5FF;
}

.our-team .picture {
  display: inline-block;
  height: 130px;
  width: 130px;
  margin-bottom: 50px;
  z-index: 1;
  position: relative;
}

.our-team .picture::before {
  content: "";
  width: 100%;
  height: 0;
  border-radius: 50%;
  background-color: #1369ce;
  position: absolute;
  bottom: 135%;
  right: 0;
  left: 0;
  opacity: 0.9;
  transform: scale(3);
  transition: all 0.3s linear 0s;
}

.our-team:hover .picture::before {
  height: 100%;
}

.our-team .picture::after {
  content: "";
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #1369ce;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
}

.our-team .picture img {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  transform: scale(1);
  transition: all 0.9s ease 0s;
}

.our-team:hover .picture img {
  box-shadow: 0 0 0 14px #f7f5ec;
  transform: scale(0.7);
}

.our-team .title {
  display: block;
  font-size: 15px;
  color: #4e5052;
  text-transform: capitalize;
}

.our-team .social {
  width: 100%;
  padding: 0;
  margin: 0;
  background-color: #1369ce;
  position: absolute;
  bottom: -100px;
  left: 0;
  transition: all 0.5s ease 0s;
}

.our-team:hover .social {
  bottom: 0;
}

.our-team .social li {
  display: inline-block;
  margin: 5px 20px 5px 20px;
}

.our-team .social li a {
  display: block;
  font-size: 17px;
  color: white;
  transition: all 0.3s ease 0s;
  text-decoration: none;
}

.our-team .social li a:hover {
  color: #1369ce;
  background-color: #1369ce;
}
.fa{
  width: 30px;
  height: 30px;
}
.a_link, .a_link:active, .a_link:focus{
  transition: transform .5s;
  background-color: #1369ce;
  color:#1369ce;
  }
.a_link:hover, .a_link:active, .a_link:focus{
  transform: scale(1.3);
  text-decoration:underline;
  background-color: #1369ce;
  color:#1369ce;
}
</style>