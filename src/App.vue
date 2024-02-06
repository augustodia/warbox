<script setup lang="ts">
import { debounce } from "./utils/debounce";
import { Warbox, type WarboxItem } from "./core/warbox";

import WarboxIllustration from "./assets/warbox.svg";
import Caixa from "./assets/caixa_w.svg";
import { ComponentPublicInstance, onMounted, ref } from "vue";

const boxesRef = ref<
  Array<(ComponentPublicInstance & { timeoutFn?: number }) | null>
>([]);
const warboxRef = ref<HTMLElement | null>(null);

const actualBox = ref(0);
const qtdClickedBuy = ref(0);
const boxBuyed = ref(0);
const modalItemsOpen = ref(false);
const totalItems = ref<WarboxItem[]>([]);
const pricesBox = ref<Record<number, number>>({
  1: 60,
  2: 59,
  3: 58,
  4: 57,
  5: 56,
});
const countCash = ref(0);

const myWarbox = ref<Warbox>(
  new Warbox({
    items: [],
  })
);

const itemsOfWarbox = ref<Array<WarboxItem>>([]);

const resetWarbox = () => {
  totalItems.value = [];
  actualBox.value = 0;
  qtdClickedBuy.value = 0;
  boxBuyed.value = 0;
  countCash.value = 0;
};

onMounted(() => {
  myWarbox.value = new Warbox({
    items: [
      { item: "Arma aleatoria 1", probability: 0.159 },
      { item: "Arma aleatoria 2", probability: 0.165 },
      { item: "Arma aleatoria 3", probability: 0.165 },
      { item: "Arma aleatoria 4", probability: 0.165 },
      { item: "Arma aleatoria 5", probability: 0.165 },
      { item: "Arma tempo", probability: 0.15 },
      { item: "Contrabandista", probability: 0.02 },
      { item: "Arma Normal", type: "normal", probability: 0.01 },
      { item: "Arma Dourada", type: "gold", probability: 0.001 },
    ],
  });
});

const buyBox = () => {
  try {
    warboxRef.value?.classList.add("animate");
    const stopCondition = qtdClickedBuy.value + boxBuyed.value;
    let indexForTimeout = 1;

    for (let i = boxBuyed.value; i < stopCondition; i++) {
      const item = myWarbox.value.openWarbox();
      itemsOfWarbox.value.push(item);

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

let debouncedBuyBox = debounce(buyBox, 1000);

const onBuyBox = async () => {
  if (actualBox.value >= 5) {
    return;
  }

  actualBox.value++;
  qtdClickedBuy.value++;
  await debouncedBuyBox();
};

const closeItemsModal = () => {
  totalItems.value = [...totalItems.value, ...itemsOfWarbox.value];

  itemsOfWarbox.value = [];
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
  if (itemsOfWarbox.value.length === 0) return;

  modalItemsOpen.value = true;
};

const groupTotalItemsWithCount = (items: WarboxItem[]) => {
  const groupedItems = items.reduce((acc, item) => {
    if (acc[item.item]) {
      acc[item.item].count++;
    } else {
      acc[item.item] = { ...item, count: 1 };
    }

    return acc;
  }, {} as Record<string, WarboxItem & { count: number }>);

  return Object.values(groupedItems);
};

const buyUntilGold = () => {
  const item = myWarbox.value.openWarbox();
  someCash(pricesBox.value[actualBox.value]!);
  itemsOfWarbox.value.push(item);
};

const onUntil = (type: Array<WarboxItem["type"]>) => {
  totalItems.value = [];
  countCash.value = 0;

  while (itemsOfWarbox.value.every((item) => !type.includes(item.type))) {
    if (actualBox.value >= 5) {
      actualBox.value = 0;
    }

    actualBox.value++;

    buyUntilGold();
  }

  closeItemsModal();
};

const someCash = (price: number) => {
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

      <p class="btn-title btn-until-gold-title">Até pegar a Gold</p>
      <button class="btn-warbox until-gold" @click="onUntil(['gold'])"></button>

      <p class="btn-title btn-until-normal-title">Até pegar a Normal ou Gold</p>
      <button
        class="btn-warbox until-normal"
        @click="onUntil(['gold', 'normal'])"
      ></button>

      <p class="btn-title btn-buy-title">Comprar</p>
      <button class="btn-warbox buy" @click="onBuyBox"></button>

      <p class="btn-title btn-open-title">Abrir</p>
      <button class="btn-warbox open" @click="openItemsModal"></button>
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
        v-for="item in itemsOfWarbox"
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
main {
  height: 100vh;
  width: 100%;
}

.btn-reset {
  right: 40px;
  top: 527px;
  position: absolute;
  border: none;
  outline: none;
  background-color: #9b2323;
  margin: 18px;
  font-size: 10px;
}

.cash {
  font-weight: 200;
  color: red;
}

.info-page {
  position: fixed;

  color: red;
  width: max-content;
}

.box {
  opacity: 0;
  position: absolute;
  bottom: 400px;
  left: 157px;
}

.box.animate {
  opacity: 1;
}

.box.stop {
  animation: none;
}

.box-1.animate {
  animation: box-animation-1 0.5s ease-in-out forwards;
}
.box-2.animate {
  animation: box-animation-2 0.4s ease-in-out forwards;
}
.box-3.animate {
  animation: box-animation-3 0.3s ease-in-out forwards;
}
.box-4.animate {
  animation: box-animation-4 0.2s ease-in-out forwards;
}
.box-5.animate {
  animation: box-animation-5 0.1s ease-in-out forwards;
}

@keyframes box-animation-1 {
  0% {
    bottom: 400px;
  }
  100% {
    bottom: 242px;
  }
}

@keyframes box-animation-2 {
  0% {
    bottom: 400px;
  }
  100% {
    bottom: 281px;
  }
}

@keyframes box-animation-3 {
  0% {
    bottom: 400px;
  }
  100% {
    bottom: 320px;
  }
}

@keyframes box-animation-4 {
  0% {
    bottom: 400px;
  }
  100% {
    bottom: 359px;
  }
}

@keyframes box-animation-5 {
  0% {
    bottom: 402px;
  }
  100% {
    bottom: 398px;
  }
}

#warbox {
  position: relative;
  color: #2d1e11;
}

#warbox.animate {
  animation: warbox-shake 0.2s ease-in-out infinite;
}

@keyframes warbox-shake {
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(1deg);
  }
  50% {
    transform: rotate(-1deg);
  }
  75% {
    transform: rotate(1deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

.title-price-cash {
  font-size: 12px;
  width: max-content;
  position: absolute;
  font-weight: 700;
}

.price-cash {
  position: absolute;
  color: #ff8634;
}

.title-price-cash-5 {
  bottom: 399px;
  right: 225px;
}
.price-cash-5 {
  bottom: 369px;
  right: 286px;
}

.title-price-cash-4 {
  bottom: 364px;
  right: 56px;
}
.price-cash-4 {
  bottom: 334px;
  right: 96px;
}

.title-price-cash-3 {
  bottom: 333px;
  right: 225px;
}
.price-cash-3 {
  bottom: 303px;
  right: 286px;
}

.title-price-cash-2 {
  bottom: 298px;
  right: 56px;
}
.price-cash-2 {
  bottom: 268px;
  right: 96px;
}

.title-price-cash-1 {
  bottom: 265px;
  right: 225px;
}
.price-cash-1 {
  bottom: 235px;
  right: 286px;
}

.price-current-cash {
  bottom: 111px;
  right: 275px;
}

.btn-title {
  position: absolute;
  font-size: 14px;
  font-weight: 700;
}

.btn-until-gold-title {
  bottom: 210px;
  left: 48px;
  color: #d18905;
  font-size: 10px;
}

.btn-until-normal-title {
  bottom: 211px;
  left: 183px;
  font-size: 10px;
  color: #0b789b;
  width: max-content;
}

.btn-buy-title {
  bottom: 87px;
  left: 60px;
}

.btn-open-title {
  bottom: 87px;
  left: 255px;
}

.btn-warbox {
  position: absolute;
  width: 84px;
  height: 52px;
  border: none;
  outline: none;
}

.until-gold {
  background-color: #d18905;
  bottom: 178px;
  left: 48px;
  height: 40px;
  border: none;
  outline: none;
}

.until-normal {
  background-color: #0a4355;
  bottom: 178px;
  left: 230px;
  height: 40px;
  border: none;
  outline: none;
}

.buy {
  right: 242px;
  top: 612px;
  background-color: #b8330e;
  box-shadow: 2px 10px 18px 0px rgba(128, 38, 13, 0.74);
  -webkit-box-shadow: 2px 10px 18px 0px rgba(128, 38, 13, 0.74);
  -moz-box-shadow: 2px 10px 18px 0px rgba(128, 38, 13, 0.74);
}

.open {
  right: 58px;
  top: 611px;
  background-color: #8f2508;
  box-shadow: 2px 10px 18px 0px rgb(99, 25, 5);
  -webkit-box-shadow: 2px 10px 18px 0px rgb(99, 25, 5);
  -moz-box-shadow: 2px 10px 18px 0px rgb(99, 25, 5);
}

.buy:active {
  box-shadow: 2px 10px 18px 0px rgba(128, 38, 13, 0.74) inset;
  -webkit-box-shadow: 2px 10px 18px 0px rgba(128, 38, 13, 0.74) inset;
  -moz-box-shadow: 2px 10px 18px 0px rgba(128, 38, 13, 0.74) inset;
}

.open:active {
  box-shadow: 2px 10px 18px 0px rgb(99, 25, 5) inset;
  -webkit-box-shadow: 2px 10px 18px 0px rgb(99, 25, 5) inset;
  -moz-box-shadow: 2px 10px 18px 0px rgb(99, 25, 5) inset;
}

#items-modal {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  z-index: 100;
}

.card-item {
  width: 400px;
  margin-top: 1px;
  background: rgb(0, 0, 0);
  background: radial-gradient(
    circle,
    rgba(0, 0, 0, 1) 0%,
    rgba(0, 0, 0, 1) 35%,
    rgba(61, 61, 61, 0.46262254901960786) 100%
  );
}

.card-item.gold {
  background: rgb(230, 203, 22);
  background: radial-gradient(
    circle,
    rgba(230, 203, 22, 1) 0%,
    rgba(205, 187, 23, 0.7595413165266106) 35%,
    rgba(154, 138, 5, 0) 100%
  );
}

.card-item.normal {
  background: rgb(5, 73, 94);
  background: radial-gradient(
    circle,
    rgba(5, 73, 94, 1) 0%,
    rgba(5, 73, 94, 0.8883928571428571) 35%,
    rgba(0, 0, 0, 0) 100%
  );
}

.btn-close-modal-items {
  border: none;
  outline: none;
  width: 400px;
  margin-top: 12px;
  background-color: #b8330e;
}

#list-items {
  position: absolute;
  top: 50px;
  right: 50px;
}
.count-items {
  display: inline;
  margin-left: 12px;
  font-size: 13px;

  color: #ff8634;
}
</style>
