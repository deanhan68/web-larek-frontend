import {IView} from "./view";
import {EventEmitter} from "../base/events";
import {createElement} from "../../utils/utils";
import {IOrder} from "../../types";



// отображение заказа
export class OrderView implements IView {
    protected _orderValues: IOrder; // здесь будут хранится данные на оснрове интерфейса IOrder
    constructor(protected _events: EventEmitter) { //принимаем EventEmitator чтобы потом отправлять форму
        this._orderValues = {
            payment: '',
            address: ''
        };
    }
    // рендерим заказ
    render() {
        const container = createElement<HTMLFormElement>('form', { // форма
            className: 'form'
        })

        const order = createElement<HTMLDivElement>('div', { // обертка для всех полей ввода
            className: 'order'
        })

        const orderField = createElement<HTMLDivElement>('div', { // поле ввода
            className: 'order__field'
        })

        const orderTitle = createElement<HTMLElement>('h2', { // надпись поясняющая - Способ оплаты
            className: 'modal__title',
            textContent: 'Способ оплаты'
        })

        const orderButtons = createElement<HTMLDivElement>('div', { // кнопки
            className: 'order__buttons'
        })

        const cardButton = createElement<HTMLButtonElement>('button', { // кнопка выбора способа - онлайн
            className: 'button button_alt',
            type: 'button',
            textContent: 'Онлайн'
        })
        cardButton.onclick = () => {
            cardButton.classList.add('button_alt-active') // кнокпка становаится активной
            cashButton.classList.remove('button_alt-active') // кнопка становаится не активной - при получениее
            this._orderValues.payment = 'card'; // делаем онлайн - основным спопобом оплаты
            toggleNextButton(); // проверка - можно ли нажать далеее
        }

        const cashButton = createElement<HTMLButtonElement>('button', { // кнопка выбора способа - при получении (кеш)
            className: 'button button_alt',
            type: 'button',
            textContent: 'При получении'
        })
        cashButton.onclick = () => {
            cashButton.classList.add('button_alt-active') // кнокпка становаится активной
            cardButton.classList.remove('button_alt-active') // кнопка становаится не активной - онлайн
            this._orderValues.payment = 'cash'; // делаем при получении - основным способом оплаты
            toggleNextButton();
        }

        orderButtons.append(cardButton, cashButton) // добовляем кнокпи  в основной контейнер - кнопок
        orderField.append(orderTitle, orderButtons) // добовляем заголовок и кнопки в основную форму

        const secondOrderField = createElement<HTMLLabelElement>('label', { // второе поле ввода
            className: 'order__field'
        })

        const orderSpan = createElement<HTMLSpanElement>('span', { // пояснение - адрес доставки
            className: 'form__label modal__title',
            textContent: 'Адрес доставки'
        })

        const inputOrder = createElement<HTMLInputElement>('input', { // поле ввода - введите адрес
            className: 'form__input',
            type: 'text',
            placeholder: 'Введите адрес'
        })

        inputOrder.oninput = (event) => {
            const target = event.target as HTMLInputElement;
            this._orderValues.address = target.value.trim(); //сохраняем значение
            toggleNextButton(); 
        }

        secondOrderField.append(orderSpan, inputOrder) // добовляеи надпись и поле для ввода адреса в контейнер secondOrderField
        order.append(orderField, secondOrderField) // добавляем оба поля — способ оплаты и адрес доставки в основной контейнер

        const modalActions = createElement<HTMLDivElement>('div', { // кнопка действия (далее)
            className: 'modal__actions'
        })

        const nextBtn = createElement<HTMLButtonElement>('button', { // пояснение
            className: 'button',
            textContent: 'Далее'
        })
        nextBtn.onclick = () => { // отправляем успешное событие когда пользователь нажимает кнопку
            this._events.emit("contacts:open")
            cardButton.classList.remove('button_alt-active')
            cashButton.classList.remove('button_alt-active')
            console.log(this._orderValues)
        }

        const toggleNextButton = () => { //проверка на заполненость обязатльных полей
            const isFormValid: boolean = this._orderValues.payment && this._orderValues.address.length > 0;
            nextBtn.disabled = !isFormValid;
            nextBtn.textContent = isFormValid ? 'Далее' : 'Сначала заполните все поля';
        };

        //изначально кнопка отключена
        toggleNextButton();

        // добовление кнокпи далее в кнопки действия
        modalActions.append(nextBtn) 


        // добовлям все в форму
        container.append(order, modalActions)
        return container
    }
}