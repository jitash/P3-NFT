<template>
    <el-container>
        <el-header>Metamask</el-header>
        <el-main>
            <el-row justify="start">
                <el-col :span="24">
                    <el-button v-on:click="onClickConnect">connect</el-button>
                </el-col>
                <el-col :span="12">connect result: {{ connectResult }}</el-col>
            </el-row>
        </el-main>
    </el-container>
    <el-divider> choose file</el-divider>
    <el-button class="top" @click="uploadFun">选择文件</el-button>
    <input type="file" ref="inputer" multiple id="upload" style="display:none;" @change="uploadFun1($event)"/>
    <div v-if="chooseShow">文件：{{ fileName }}</div>
    <div v-if="chooseShow">位置：{{ receiveMsg }}</div>

    <el-divider> NFT metaData</el-divider>
    <el-form
            :label-position="right"
            label-width="100px"
            :model="formLabelAlign"
            style="max-width: 580px">
        <el-form-item label="name">
            <el-input v-model="metaData.name"
                      placeholder="Name of the item. Max 200 characters."/>
        </el-form-item>
        <el-form-item label="description">
            <el-input v-model="metaData.description"
                      placeholder="A human-readable description of the item. Markdown is supported. Max 500 characters."/>
        </el-form-item>
        <el-form-item label="image">
            <el-input v-model="metaData.image"
                      placeholder="This is the URL to the image of the item. Can be just about any type of image. A 350 x 350 image is recommended."/>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onUpload">upload</el-button>
        </el-form-item>


        <div>metaDataUrl: {{ metaDataUrl }}</div>
    </el-form>


</template>
<script lang="ts" setup>
    import {onMounted, reactive, ref} from 'vue'
    import {Upload, Web3Storage} from "web3.storage";
    import axios from "axios";

    let connectResult = ref('');
    const onClickConnect = async () => {
        try {
            const newAccounts = await ethereum.request({
                method: 'eth_requestAccounts',
            });
            connectResult.value = newAccounts[0];
            console.log('newAccounts', JSON.stringify(newAccounts));
            handleNewAccounts(newAccounts);
        } catch (error) {
            console.error(error);
        }
    };


    const WEB3_STORAGE_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEI2OTZEQ2Y1ODEwQzAxREEzM2Y3N0QzNkExMzQ1NDU5NjQwRjAzOTUiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NDc0MTcxMDY4MzMsIm5hbWUiOiJqaXRhc2gifQ.pcVRPx2OHkespLrJu7ha6kZ5k92b5Minza8NoNGaxgE';
    const client = new Web3Storage({token: WEB3_STORAGE_TOKEN});

    const metaData = reactive({
        name: '',//Name of the item. Max 200 characters.
        description: '',//A human-readable description of the item. Markdown is supported. Max 500 characters.
        image: '',//This is the URL to the image of the item. Can be just about any type of image. A 350 x 350 image is recommended.
    })
    const metaDataUrl = ref('')

    const onUpload = async () => {
        const fileInput = document.querySelector('input[type="file"]')
        console.log(fileInput.files)
        const imageCid = await client.put(fileInput.files)
        console.log('stored files with cid:', imageCid)
        metaData.image = 'ipfs://' + imageCid + '/' + fileName.value

        const str = JSON.stringify(metaData);
        console.log(str)
        const file = new File([str], 'metadata.json', {type: 'application/json'});
        const metaDataCid = await client.put([file])
        console.log('stored metadata with cid:', metaDataCid)
        metaDataUrl.value = 'ipfs://' + metaDataCid + '/metadata.json'
        console.log('url', metaDataUrl)

    }
    const uploadFun = () => {
        console.log(document.getElementById("upload"))
        document.getElementById("upload").click()
    }
    const receiveMsg = ref('')
    const fileName = ref('')
    const chooseShow = ref(false)
    const uploadFun1 = (event) => {
        fileName.value = document.getElementById("upload").files[0].name
        receiveMsg.value = document.getElementById("upload").value
        chooseShow.value = true
    }

</script>
