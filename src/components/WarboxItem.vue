<template>
  <div :class="`card-item ${item.type}`">
    <p>
      {{ item.item }}<span class="count-items">({{ item.count }}x)</span>
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  item: {
    item: string;
    type: 'gold' | 'normal' | 'other';
    count: number;
  };
}>();
</script>

<style scoped>
.card-item {
  padding: 1rem;
  border-radius: 8px;
  margin: 0.5rem;
  text-align: center;
  transition: transform 0.3s ease;
}
.card-item:hover {
  transform: translateY(-5px);
}
.card-item.gold {
  background-color: gold;
}
.card-item.normal {
  background-color: silver;
}
.card-item.other {
  background-color: grey;
}
.count-items {
  font-weight: bold;
}
</style>
