<template>
    <td class="border border-black px-4 py-3">{{ value }}</td>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    value: [String, Number, Boolean]
  }
});
</script>