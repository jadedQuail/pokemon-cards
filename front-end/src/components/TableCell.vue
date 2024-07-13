<template>
    <td>{{ value }}</td>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    value: [String, Number, Boolean]
  }
});
</script>