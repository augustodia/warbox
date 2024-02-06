

function createWarbox(config) {
  // Retorna a função openWarbox
  return function openWarbox() {
    // Gera um número aleatório entre 0 e 1
    const randomValue = Math.random();

    // Inicializa as probabilidades acumuladas
    let cumulativeProbability = 0;

    // Embaralha a lista de itens
    const items = Object.keys(config).sort(() => Math.random() - 0.5);

    // Itera sobre as opções da configuração
    for (const item of items) {
      cumulativeProbability += config[item];

      // Se o número aleatório estiver dentro da probabilidade acumulada
      if (randomValue <= cumulativeProbability) {
        // Retorna o item
        return item;
      }
    }
  };
}

// Cria uma Warbox com uma configuração específica
const myWarbox = createWarbox({
  "Arma aleatoria 1": 0.159,
  "Arma aleatoria 2": 0.165,
  "Arma aleatoria 3": 0.165,
  "Arma aleatoria 4": 0.165,
  "Arma aleatoria 5": 0.165,
  "Arma tempo": 0.15,
  "Contrabandista": 0.2492,
  "Arma Normal": 0.01,
  "Arma Dourada": 0.001,
});

const qtdCashForRound = {
  1: 60,
  2: 59,
  3: 58,
  4: 57,
  5: 56,
};

let isGold = false;
let qtdRounds = 0;
let cash = 0;

// Simula a abertura da Warbox
for (let round = 1; !isGold; round = (round % 5) + 1) {
  qtdRounds++;
  cash += qtdCashForRound[round];

  const item = myWarbox();

  console.log(item);

  if (item.includes("Normal")) {
    console.log(`***Você abriu a Warbox ${qtdRounds} vezes e gastou ${cash} de cash para pegar a normal.***`);
  }

  if (item.includes("Dourada")) {
    isGold = true;
  }
}

console.log(`Você abriu a Warbox ${qtdRounds} vezes e gastou ${cash} de cash.`);
