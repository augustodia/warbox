<script setup lang="ts">
import { ref, onMounted } from "vue";
import WarboxService from "./services/WarboxService";
import { WarboxItem } from "./core/warbox";
import WarboxIllustration from "./assets/warbox.svg";
import Caixa from "./assets/caixa_w.svg";

const warboxService = new WarboxService();

const boxesRef = ref([]);
const warboxRef = ref(null);

const actualBox = ref(0);
const qtdClickedBuy = ref(0);
const boxBuyed = ref(0);
const modalItemsOpen = ref(false);
const totalItems = ref([]);
const pricesBox = ref({
  1: 60,
  2: 59,
  3: 58,
  4: 57,
  5: 56,
});
const countCash = ref(0);

const resetWarbox = () => {
  totalItems.value = [];
  actualBox.value = 0;
  qtdClickedBuy.value = 0;
  boxBuyed.value = 0;
  countCash.value = 0;
};

const buyBox = async () => {
  try {
    warboxRef.value?.classList.add("animate");
    const stopCondition = qtdClickedBuy.value + boxBuyed.value;
    let indexForTimeout = 1;

    for (let i = boxBuyed.value; i < stopCondition; i++) {
      const item = await warboxService.openWarbox();
      totalItems.value.push(item);

      const timeout = indexForTimeout * 500;
      indexForTimeout++;

      if (!boxesRef.value[i]) return;

      boxesRef.value[i]!.timeoutFn = setTimeout(() => {
        warboxRef.value?.classList.remove("animate");

        boxesRef.value[i]?.$el.classList.remove("stop");
        boxesRef.value[i]?.$el.classList.add("animate");
      }, timeout);

      boxBuyed.value++;
      someCash(pricesBox.value[boxBuyed.value]!);
    }

    qtdClickedBuy.value = 0;
  } catch (error) {}
};

const onBuyBox = async () => {
  if (actualBox.value >= 5) {
    return;
  }

  actualBox.value++;
  qtdClickedBuy.value++;
  await buyBox();
};

const closeItemsModal = () => {
  modalItemsOpen.value = false;

  boxesRef.value.forEach((box) => {
    clearTimeout(box?.timeoutFn);

    box?.$el.classList.remove("animate");
    box?.$el.classList.add("stop");
  });

  actualBox.value = 0;
  qtdClickedBuy.value = 0;
  boxBuyed.value = 0;
};

const openItemsModal = () => {
  if (totalItems.value.length === 0) return;

  modalItemsOpen.value = true;
};

const groupTotalItemsWithCount = (items) => {
  const groupedItems = items.reduce((acc, item) => {
    if (acc[item.item]) {
      acc[item.item].count++;
    } else {
      acc[item.item] = { ...item, count: 1 };
    }

    return acc;
  }, {});

  return Object.values(groupedItems);
};

const someCash = (price) => {
  countCash.value += price;
};
</script>

<template>
  <main>
    <section id="warbox" ref="warboxRef">
      <h3 class="info-page">
        This is a simulator, not real or official Warface
      </h3>

      <button class="btn-reset" @click="resetWarbox">Resetar</button>

      <Caixa
        v-if="actualBox > 0"
        v-for="index in 5"
        :key="index"
        :class="`box box-${index}`"
        ref="boxesRef"
      />
      <WarboxIllustration />
      <template
        v-for="([_, price], index) in Object.entries(pricesBox)"
        :key="index"
      >
        <p :class="`title-price-cash title-price-cash-${index + 1}`">
          {{ index + 1 }}. PREÇO DA CAIXA
        </p>
        <p :class="`price-cash price-cash-${index + 1}`">{{ price }}</p>
      </template>

      <p class="price-cash price-current-cash">50</p>

      <button class="btn-warbox buy" @click="onBuyBox">Comprar</button>

      <p class="btn-title btn-open-title">Abrir</p>
      <button class="btn-warbox open" @click="openItemsModal">Abrir</button>
    </section>

    <section id="list-items">
      <h2>{{ countCash }} <span class="cash">K</span></h2>
      <div
        v-for="item in groupTotalItemsWithCount(totalItems)"
        :key="item.item"
        class="card-item"
        :class="{ gold: item.type === 'gold', normal: item.type === 'normal' }"
      >
        <p>
          {{ item.item }}<span class="count-items">({{ item.count }}x)</span>
        </p>
      </div>
    </section>

    <section v-if="modalItemsOpen" id="items-modal">
      <div
        v-for="item in totalItems"
        :key="item.item"
        class="card-item"
        :class="{ gold: item.type === 'gold', normal: item.type === 'normal' }"
      >
        <p>{{ item.item }}</p>
      </div>

      <button class="btn-close-modal-items" @click="closeItemsModal">
        Fechar
      </button>
    </section>
  </main>
</template>

<style scoped>
/* Styles remain unchanged */
</style>
