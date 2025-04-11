import { IView } from './view';
import { EventEmitter } from '../base/events';
import { IContacts } from '../../types';
import { createElement } from '../../utils/utils';



//отображаем контактные данные
export class ContactsView implements IView {
	protected _contactsValues: IContacts;  // здесь будут хранится данные на основе интерфейса IContacts

	constructor(protected _events: EventEmitter) { //принимаем EventEmitator чтобы потом отправлять форму
		this._contactsValues = {
			email: '',
			phone: '',
		};
	}

	// рендерим контактные данные
	render() {
		const container = createElement<HTMLFormElement>('form', { // форма
			className: 'form',
		});

		const order = createElement<HTMLDivElement>('div', { // обертка для всех полей ввода
			className: 'order',
		});

		const firstOrderField = createElement<HTMLLabelElement>('label', { // первый элемент поля - эмеил
			className: 'order__field',
		});

		const firstOrderSpan = createElement<HTMLSpanElement>('span', { // надпись поясняющая - Email
			className: 'form__label modal__title',
			textContent: 'Email',
		});

		const firstOrderInput = createElement<HTMLInputElement>('input', { // само поле ввода
			className: 'form__input',
			type: 'text',
			placeholder: 'Введите Email',
		});
		firstOrderInput.oninput = (event) => { 
			const target = event.target as HTMLInputElement;
			this._contactsValues.email = target.value.trim(); // сохраняем значение которое ввел пользователь
			toggleNextButton(); // проверяем можно ли уже отправить форму
		};

		firstOrderField.append(firstOrderSpan, firstOrderInput); // добовление надписи и ввода пользователя в обертку для строки

		const secondOrderField = createElement<HTMLLabelElement>('label', { // второй элемент поля - номер
			className: 'order__field',
		});

		const secondOrderSpan = createElement<HTMLSpanElement>('span', { // надпись поясняющая - Телефон
			className: 'form__label modal__title',
			textContent: 'Телефон',
		});

		const secondOrderInput = createElement<HTMLInputElement>('input', { // поле ввода телефона
			className: 'form__input',
			type: 'text',
			placeholder: '+7 (9',
		});

		secondOrderInput.oninput = (event) => {
			const target = event.target as HTMLInputElement;
			this._contactsValues.phone = target.value.trim(); // сохраняем значение которое ввел пользователь
			toggleNextButton(); // проверяем можно ли уже отправить форму
		};

		secondOrderField.append(secondOrderSpan, secondOrderInput); // добовление надписи и ввода пользователя в обертку для строки (номер)
		order.append(firstOrderField, secondOrderField); //добавляем оба поля в order, то есть в основной контейнер формы.

		const modalActions = createElement<HTMLDivElement>('div', { // контейнер для кнопки внизу формы
			className: 'modal__actions',
		});

		const nextBtn = createElement<HTMLButtonElement>('button', { // кнопка - оплатить / заполните поля
			className: 'button',
		});
		nextBtn.onclick = () => {
			this._events.emit('success:open'); // отправляем успешное событие когда пользователь нажимает кнопку
			console.log(this._contactsValues);
		};

		const toggleNextButton = () => { // проверка на заполненость полей
			const isFormValid: boolean =
				!!this._contactsValues.email && !!this._contactsValues.phone;
			nextBtn.disabled = !isFormValid;
			nextBtn.textContent = isFormValid
				? 'Оплатить'
				: 'Сначала заполните все поля';
		};
		//изначально кнопка отключена
		toggleNextButton();

		// добавляем кнопку в форму. Всё собираем в container.
		modalActions.append(nextBtn);
		container.append(order, modalActions);

		return container;
	}
}
