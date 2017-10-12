<template>
	<transition name="router-fade" mode="out-in" >
		<div class="modal" v-if="pastle" >
            <p v-if="typeof message !== 'string' && typeof message !== 'undefined'" v-for="msg in message">{{ msg }}</p> 
            <p v-if="typeof message === 'string'">{{ message }}</p>
        </div>
	</transition>
</template>
<script>
    export default {
        props: ['pastle', 'message'],
        data() {
            return {

            }
        }
    }
</script>
<style lang="less">
    .modal {
        font-size: 15px;
        position: fixed;
        top: 45%;
        width: 50%;
        text-align: center;
        background: rgba(0, 0, 0, 0.53);
        padding: 5px;
        left: 25%;
        display: block;
        height: 45px;
        line-height: 5px;
        border-radius: 5px;
        p {
            word-break: break-all;
            color: #fff!important;
            line-height: 20px;
        }
    }
</style>