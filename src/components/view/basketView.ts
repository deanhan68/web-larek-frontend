import {IView} from "./view";
import {IProduct} from "../../types";
import {EventEmitter} from "../base/events";
import {createElement, formatSynapseWord} from "../../utils/utils";



// отображение корзины
export class BasketView implements IView {
    constructor(protected _events: EventEmitter) {
    }

    // рендерим корзину
    render({items, itemsView}: {items: IProduct[], itemsView: HTMLElement[]}) {
        const container = createElement<HTMLDivElement>('div', {
            className: 'basket'
        })

        // заголовок
        const title = createElement<HTMLElement>('h2', {
            className: 'modal__title',
            textContent: 'Корзина'
        })

        // содержимое корзины
        const basketList = createElement<HTMLUListElement>('ul', {
            className: 'basket__list',
        })

        // модалка
        const modalAction = createElement<HTMLDivElement>('div', {
            className: 'modal__actions'
        })

        // кнопка 
        const button = createElement<HTMLButtonElement>('button', {
            className: 'button',
        })
        button.onclick = () => {
            this._events.emit('order:open')
        }

        // если не пуста
        if (itemsView.length) {
            basketList.replaceChildren(...itemsView);
            button.disabled = false;
            button.textContent = 'Оформить'
        } else { // если пуста
            const p = createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            })
            basketList.append(p)
            button.disabled = true;
            button.textContent = 'Товар не выбран'
        }

        //  подсчет общей цены
        const totalPrice = items.reduce((sum, item) => sum + item.price, 0)

        // форматируем цену
        const price = createElement<HTMLSpanElement>('span', {
            className: 'basket__price',
            textContent: formatSynapseWord(totalPrice)
        })

        modalAction.replaceChildren(button, price);

        container.append(title, basketList, modalAction)

        return container
    }
}