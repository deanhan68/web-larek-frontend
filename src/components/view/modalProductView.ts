import { IProduct } from '../../types';
import { CDN_URL } from '../../utils/constants';
import { createElement, formatSynapseWord } from '../../utils/utils';
import { EventEmitter } from '../base/events';
import { IView } from './view';


// отображение модального окна продукта
export class ModalProductView implements IView {
	constructor(protected _events: EventEmitter) {} // для отправки событий

	// рендерим модальное окно продукта
	render({ item, isInBasket }: { item: IProduct; isInBasket: boolean }) {
		const button = createElement('button', { // создание кнопки
			className: 'button',
			textContent: isInBasket ? 'Уже в корзине' : 'В корзину',
		}) as HTMLButtonElement;
		if (isInBasket || item.price === null) { // отключение кнопки если товар в корзине
			button.disabled = true;
		}
		button.onclick = () =>
			this._events.emit('product-modal-view: add', { id: item.id });  //обработчик клика на кнопку доболвения

		const price = createElement('span', { // элемент цены
			className: 'card__price',
			textContent: formatSynapseWord(item.price),
		});

		const row = createElement('div', { className: 'card__row' }, [ // строка с кнопкой и ценой
			button,
			price,
		]);
		const section = createElement('span', { // категория товара
			className: 'card__category card__category_soft',
			textContent: item.category,
		});
		const name = createElement('h2', { //название
			className: 'card__title',
			textContent: item.title,
		});
		const description = createElement('p', { //описание
			className: 'card__text',
			textContent: item.description,
		});

		const column = createElement('div', { className: 'card__column' }, [ // элемент колонки с инфорцацией о товаре
			section,
			name,
			description,
			row,
		]);
		const image = createElement('img', { // изображение
			className: 'card__image',
		}) as HTMLImageElement;
		image.src = `${CDN_URL}${item.image}`;

		const card = createElement('div', { className: 'card card_full' }, [ // карточка товара с картинкой и информацией о нем
			image,
			column,
		]);

		return card;
	}
}
