<template >
    <h1>
       draw character 
    </h1>
    <h1>{{data}}</h1>
    
</template>
<script>
export default {
    props: {
        data: {
            type: Object,
            required: true,
        }
    }
}
</script>
<style lang="scss" scoped>
    
</style>