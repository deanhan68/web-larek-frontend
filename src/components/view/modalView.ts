import { EventEmitter } from '../base/events';
import { IView } from './view';



//отображение модалки
export class ModalView implements IView {
	private readonly modalContainer: HTMLElement; // модалка
	private events: EventEmitter; 

	//сохраняем переданный объект событий, находим модальное окно на странице и запускаем настройку его поведения
	constructor(events: EventEmitter) {
		this.events = events;

		this.modalContainer = document.getElementById('modal-container');
		this.setup();
	}

	// находим кнопку "закрыть" (крестик) в модалке
	private setup() {
		const closeBtn = this.modalContainer.querySelector(
			'.modal__close'
		) as HTMLButtonElement;

		//закрытие модалки по клику на крестик
		closeBtn.addEventListener('click', () => {
			this.events.emit('modal:close');
		});

		// находим внутренний контейнер, в котором находится основное содержимое модалки
		const modalContent = this.modalContainer.querySelector(
			'.modal__container'
		) as HTMLElement;

		//закрытие по клику вне модального окна
		this.modalContainer.addEventListener('click', (event: MouseEvent) => {
			if (!modalContent.contains(event.target as Node)) {
				this.events.emit('modal:close');
			}
		});
	}
	
	//рендерим модалку
	//обновляем содержимое модалки и открываем/закрываем её 
	render({ content, isOpen }: { content?: HTMLElement; isOpen: boolean }) {
		const contentWrapper = this.modalContainer.querySelector(
			'.modal__content'
		) as HTMLElement;
		contentWrapper.innerHTML = '';
		if (content) contentWrapper.appendChild(content);

		this.modalContainer.classList.toggle('modal_active', isOpen);

		if (isOpen) {
			document.body.classList.add('modal-open')
		} else {
			document.body.classList.remove('modal-open')
		}

		return this.modalContainer;
	}
}
