<template>
    <div class="checkbox-page">
        <div class="checkbox-box">
            <div v-if = " title && title.length > 0" class="checkbox-page-title"> {{title}} </div>
            <div class="checkbox-list  flex-row align-items-center" >
                <Checkbox v-for = "( item , index ) in checkboxList" :key = "index" :label = "item.label" 
                    :value = "item.val" :disabled = "item.disabled" @update = "update($event , index) "/>
            </div>
            <div class="checkbox-footer">
                <div>
                    <button @click="save">保存</button>
                    <button @click="changeSelect(true)">全选</button>
                    <button @click="changeSelect('')">反选</button>
                    <button @click="changeSelect(false)">清空</button>
                    
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Checkbox from './Checkbox'
export default {
    props :{
        list :{
            type : Array
        },
        selectList:{
            type : Array
        },
        disabelType :{
            type : String,
            default :'label'
        },
        title : {
            type : String,
        }
    },
    data (){
        return{
            checkboxList:[]
        }
    },
    components:{
        Checkbox
    },
    mounted(){
        let listCopy = this.list.slice(0)
        for( let i = 0 ; i < listCopy.length ; i ++ ){
            this.getValue(listCopy[i]);
        }
        this.checkboxList = listCopy;
    },
    methods: {
        getValue(item){
            if(this.disabelType == 'label' ){
                if( this.selectList.indexOf(item.label) == -1 ){
                    item.val = false;
                }else{
                    item.val = true;
                }
            }
            else if(this.disabelType == 'key' ){
                if( this.selectList.indexOf(item.key) == -1 ){
                    item.val = false;
                }
                item.val = true;
            }
            if( item.val && typeof item.val == 'boolean' ){
                return true;
            }else{
                return false;
            }
        },
        update(val , index){
             let listCopy = this.checkboxList.slice(0);
            listCopy[index].val = val;
            this.checkboxList = listCopy;
        },
        // 改变选择   如果 参数是Boolean，就是全选和全部选 ， 如果
        changeSelect(type){
            console.log(type);
            let listCopy = this.checkboxList.slice(0);
            for( let i = 0 ; i < listCopy.length ; i ++ ){
                let val = type ;
                if( typeof type != 'boolean') val = !listCopy[i].val;
                listCopy[i].val = val;
                console.log('changeSelect' , i , val)
            }
            this.checkboxList = listCopy;
        },
        // 保存
        save( ){
            let arr = [];
            for( let i = 0 ; i < this.checkboxList.length ; i ++ ){
                if(  this.checkboxList[i].val ) arr.push(this.checkboxList[i]);
            }
            this.$emit('save-checkboc' ,arr)
        },
    },
    
}
</script>
<style >
    .checkbox-page .checkbox-box{
        width : 35vw; 
        margin: 0 auto;
        min-width : 460px;
    }
    .checkbox-page .checkbox-page-title{
        font-weight: bold;
        font-size: 2.5vw;
        line-height: 4vw;
        text-align: left;
    }
    .checkbox-page .checkbox-list {
         flex-wrap:wrap;
         margin: 2vw 0;
    }
    .checkbox-page .checkbox-list .v-checkbox{
        margin-right: 0.3vw;
    }
    .checkbox-page .checkbox-footer>div button  {
        background: none;
        border: 1px solid #000;
        border-radius : 0.3vw;
        padding: 0.3vw 1.5vw;
        margin: 0 0.3vw;

    }
    .checkbox-page .checkbox-footer>div button:first-child{

        border: 1px solid #57a3f3;
        background: #fff;
        color: #57a3f3;
    }
    .checkbox-page .checkbox-footer>div button:hover {
        color: #57a3f3;
        border-color: #57a3f3;
    }
    .checkbox-page .checkbox-footer>div button:first-child:hover{
        color: #fff;
        background: #57a3f3;

    }
</style>
