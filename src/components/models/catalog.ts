import { ICatalogModel, IProduct } from '../../types';
import { EventEmitter } from '../base/events';



// Класс модели каталога товаров, реализует интерфейс ICatalogModel
export class CatalogModel implements ICatalogModel {
	items: IProduct[] | null = null;
	_events: EventEmitter | null = null;

	constructor(events: EventEmitter) {
		this._events = events;
	}

    
    // Метод для установки списка товаров в каталог
	setItems(items: IProduct[]): void {
		this.items = items;
		this._events.emit('catalog-model:set-items', items);
	}

    // Получаем товар по его id
	getProduct(id: string): IProduct | undefined {
		if (!this.items) return;
		return this.items.find((item) => item.id === id);
	}
}
