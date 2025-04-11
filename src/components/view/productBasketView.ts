import {IView} from "./view";
import {EventEmitter} from "../base/events";
import {createElement, ensureElement} from "../../utils/utils";
import {IProduct} from "../../types";



// отображение продуктов в корзине
export class ProductBasketView implements IView {
    protected _number: HTMLElement;
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _button: HTMLElement;

    constructor(protected _events: EventEmitter) {  // принимаем EventEmitter, который будет использоваться для отправки событий
    }

    // рендерим корзину с продуктами
    render({item, index}: {item: IProduct, index: number}) {
        this._number = createElement('span', {
            className: 'basket__item-index',
            textContent: index.toString()
        })

        this._title = createElement('span', { // название
            className: 'card__title',
            textContent: item.title
        })

        this._price = createElement('span', { // цена
            className: 'card__price',
            textContent: item.price.toString()
        })

        this._button = createElement('button', { // кнопка удаления
            className: 'basket__item-delete',
            ariaLabel: 'удалить',
        })
        this._button.onclick = () => {
            this._events.emit('basket-item:delete', {id: item.id}) //обработчик клика на кнопку удаления
        }

        const li: HTMLLIElement = createElement<HTMLLIElement>('li', { // создание списка элементов
            className: 'basket__item card card_compact',
        })
        li.append(this._number, this._title, this._price, this._button) // добовление элемента в список

        return li;
    }
}