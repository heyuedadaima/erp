<template>
  <div class="layout">
    <MyMenu class="menu"/>
    <Content class="content"/>
  </div>
</template>

<script>
import MyMenu from './MyMenu.vue';
import Content from './Content.vue';

export default {
    components:{
        MyMenu,
        Content,
    },
  
};
</script>

<style lang='less' scoped>


.layout{
    //display: flex;
    position: relative;
    .menu{
        position:fixed;
        top: 0;
        bottom: 0;
        width: 200px;
        min-height: 500px;
        background-color: #3498db; 
    }
    .content{
       
        margin-left: 200px;
    }

}
</style>