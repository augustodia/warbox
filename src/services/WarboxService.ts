import { Warbox, type WarboxItem } from "../core/warbox";

class WarboxService {
  private warbox: Warbox;

  constructor() {
    this.warbox = new Warbox({
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
  }

  async openWarbox(): Promise<WarboxItem> {
    // Simulate asynchronous processing
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.warbox.openWarbox());
      }, 100); // Simulate delay
    });
  }
}

export default WarboxService;
