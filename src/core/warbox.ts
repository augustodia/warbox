type WarboxConfig = {
  items: WarboxItem[];
};

type WarboxItem = {
  item: string;
  type?: 'gold' | 'normal'| 'other'
  probability: number;
}

class Warbox {
  private items: WarboxItem[];

  constructor(config: WarboxConfig) {
    this.items = config.items;
  }

  public openWarbox(): WarboxItem {
    // Gera um número aleatório entre 0 e 1
    const randomValue = Math.random();

    // Inicializa as probabilidades acumuladas
    let cumulativeProbability = 0;

    // Embaralha a lista de itens
    const sortedItems = this.items.slice().sort(() => Math.random() - 0.5);
    const items = sortedItems;

    // Itera sobre as opções da configuração
    for (const item of items) {
      cumulativeProbability += item.probability;

      // Se o número aleatório estiver dentro da probabilidade acumulada
      if (randomValue <= cumulativeProbability) {
        // Retorna o item
        return item;
      }
    }

    return items[items.length - 1];
  }
}

export { Warbox, type WarboxItem };