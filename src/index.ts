import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { BasketModel } from './components/models/basket';
import { CatalogModel } from './components/models/catalog';
import { ModalView } from './components/view/modalView';
import { CatalogView } from './components/view/catalogView';
import { ProductView } from './components/view/productView';
import './scss/styles.scss';
import { IProduct, IProductResponse } from './types';
import { API_URL } from './utils/constants';
import { BasketView } from './components/view/basketView';
import { OrderView } from './components/view/orderView';
import { ContactsView } from './components/view/contactsView';

const api: Api = new Api(API_URL);
const events: EventEmitter = new EventEmitter();

//Создание моделей
const basketModel: BasketModel = new BasketModel(events);
const catalogModel: CatalogModel = new CatalogModel(events);

//Создание экземпляров вью
const catalogView: CatalogView = new CatalogView();
const modalView: ModalView = new ModalView(events);
const basketView: BasketView = new BasketView(events);

//забираем все с сервера
api
	.get('/product/')
	.then((res: IProductResponse) => {
		catalogModel.setItems(res.items);
		console.log(res.items);
	})
	.catch((err) => {
		console.error(err);
	});

//рендерим каталог
function renderCatalog(products: IProduct[]): void {
	const productsView = products.map((product: IProduct) =>
		new ProductView(events).render(product)
	);

	catalogView.render({ products: productsView });
}

//изменяем элементы каталога
events.on('catalog-model:set-items', (products: IProduct[]): void => {
	renderCatalog(products);
});

//закрытие модалки
events.on('modal:close', () => {
	modalView.render({ isOpen: false });
});



//добавление товара в корзину
events.on('product-modal-view: add', ({ id }: { id: string }): void => {
	basketModel.add(id);
	modalView.render({
		isOpen: false,
	});
});

//открытие корзины
const basketButton = document.querySelector(
	'.header__basket'
) as HTMLButtonElement;
basketButton.onclick = () => {
	events.emit('basket:open');
};

function basketRender() {
	const products: IProduct[] = Array.from(basketModel.items)
		.map(([id, quantity]) => {
			const product = catalogModel.getProduct(id);
			if (product.price === null) {
				product.price = 0;
			}
			return product ? { ...product } : null;
		})
		.filter((product: IProduct): product is IProduct => product !== null);

	

	


events.on('basket:open', basketRender);

//удаление из корзины
events.on('basket-item:delete', ({ id }: { id: string }) => {
	basketModel.remove(id);
	setTimeout(() => {
		basketRender();
	}, 1);
});

//открытие orderView
const orderView = new OrderView(events);

events.on('order:open', () => {
	modalView.render({ isOpen: false });

	//чтобы модалка открылась по новой
	setTimeout(() => {
		modalView.render({
			isOpen: true,
			content: orderView.render(),
		});
	});
});

//открытие contacts
const contactsView = new ContactsView(events);

events.on('contacts:open', () => {
	modalView.render({ isOpen: false });

	setTimeout(() => {
		modalView.render({
			isOpen: true,
			content: contactsView.render(),
		});
	}, 1);
});

}
