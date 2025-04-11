import {IView} from "./view";
import {EventEmitter} from "../base/events";
import {createElement, formatSynapseWord} from "../../utils/utils";

//отображение финального окна
export class SuccessView implements IView {

    constructor(protected _events: EventEmitter) { // принимаем EventEmitter, который будет использоваться для отправки событий
    }
    // рендерим финальное окно
    render({price}: {price: number}) {
        const container = createElement<HTMLDivElement>('div', {
            className: 'order-success'
        })

        const title = createElement<HTMLElement>('h2', { // заголовок
            className: 'film__title',
            textContent: 'Заказ оформлен'
        })

        const description = createElement<HTMLParagraphElement>('p', { //описание
            className: 'film__description',
            textContent: `Списано ${formatSynapseWord(price)}`
        })

        const nextBtn = createElement<HTMLButtonElement>('button', { // кнопка перехода
            className: 'button order-success__close',
            textContent: 'За новыми покупками'
        })
        nextBtn.onclick = () => {
            this._events.emit('go-main-page') // обработчик событий перехода на основную страницу
        }

        container.append(title, description, nextBtn) // добовляем все в основной контейнер

        return container
    }
}