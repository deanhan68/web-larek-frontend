import { IView } from './view';


// отображение каталога

export class CatalogView implements IView {
	protected container: HTMLElement; // элемент со списком товаров

	// находим элементы с классом .gallary () 
	constructor() {
		this.container = document.querySelector('.gallery') as HTMLElement;
	}
	// рендерим каталок
	render({ products }: { products: HTMLButtonElement[] }) {
		this.container.replaceChildren(...products);

		return this.container;
	}
}
