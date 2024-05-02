interface IWarboxItem {
  item: string;
  type?: 'gold' | 'normal' | 'other';
  probability: number;
}

interface IWarboxConfig {
  items: IWarboxItem[];
}

class Warbox {
  private items: IWarboxItem[];

  constructor(config: IWarboxConfig) {
    this.items = config.items;
  }

  public openWarbox(): IWarboxItem {
    const randomValue = Math.random();
    let cumulativeProbability = 0;
    const sortedItems = this.items.slice().sort(() => Math.random() - 0.5);

    for (const item of sortedItems) {
      cumulativeProbability += item.probability;
      if (randomValue <= cumulativeProbability) {
        return item;
      }
    }

    return sortedItems[sortedItems.length - 1];
  }
}

export { Warbox, type IWarboxItem };
