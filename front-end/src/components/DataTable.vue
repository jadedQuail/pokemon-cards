<template>
    <div>
        <p>Count: {{ count }}</p>
        <button @click="increment">Increment</button>
        <button @click="fetchData">Fetch Data</button>
    </div>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';
export default {
    props: {
        initialCount: {
            type: Number,
            default: 0,
        }
    },
    setup(props) {
        const count = ref(props.initialCount);

        function increment() {
            count.value++;
        }

        const fetchData = async () => {
            console.log("Called!");
            const response = await axios.post('http://localhost:11112/test');
            console.log(response.data);
        }

        return {
            count,
            increment,
            fetchData,
        }
    }
}
</script>