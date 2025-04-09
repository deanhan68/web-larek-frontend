import { IBasketModel } from '../../types';
import { EventEmitter } from '../base/events';


// Класс модели корзины, реализует интерфейс IBasketModel
export class BasketModel implements IBasketModel {
	items: Map<string, number> = new Map();
	_events: EventEmitter | null = null;

	constructor(events: EventEmitter) {
		this._events = events;
	}


    //Добовление товара в корзину
	add(id: string) {
		if (!this.items.has(id)) this.items.set(id, 0);
		this.updateBasketCounter()
		this.items.set(id, this.items.get(id) + 1);
		this._events.emit('basket:add');
	}



    // Удаления товара из корзины
	remove(id: string) {
		if (!this.items.has(id)) return; // пропускаем если нет
		if (this.items.get(id) > 0) {
			this.items.set(id, this.items.get(id) - 1);
			if (this.items.get(id) === 0) this.items.delete(id);
		}

        // Обновляем счётчик корзины на странице
		this.updateBasketCounter()
		this._events.emit('basket:remove');
	}


    // Очищение корзины
	clear() {
		this.items.clear();
		this.updateBasketCounter();
		this._events.emit('basket:clear');
	}

    // Приватный метод для обновления счётчика корзины на веб-странице
	private updateBasketCounter() {
		const basketCounter = document.querySelector('.header__basket-counter');
		if (basketCounter) {
			basketCounter.innerHTML = this.items.size.toString();
		}
	}
}
