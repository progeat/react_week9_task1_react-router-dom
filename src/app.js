import {
	Routes,
	Route,
	NavLink,
	Outlet,
	useParams,
	useMatch,
	useNavigate,
} from 'react-router-dom';
import { useState, useEffect } from 'react';
import styles from './app.module.css';

// const fetchProductList = () => [
// 	{ id: 1, name: 'Телевизор' },
// 	{ id: 2, name: 'Смартфон' },
// 	{ id: 3, name: 'Планшет' },
// ];

// const fetchProduct = (id) =>
// 	({
// 		1: { id: 1, name: 'Телевизор', price: 29900, amount: 15 },
// 		2: { id: 2, name: 'Смартфон', price: 13900, amount: 48 },
// 		3: { id: 3, name: 'Планшет', price: 18400, amount: 23 },
// 	})[id];

const database = {
	productList: [
		{ id: 1, name: 'Телевизор' },
		{ id: 2, name: 'Смартфон' },
		{ id: 3, name: 'Планшет' },
	],
	products: {
		1: { id: 1, name: 'Телевизор', price: 29900, amount: 15 },
		2: { id: 2, name: 'Смартфон', price: 13900, amount: 48 },
		3: { id: 3, name: 'Планшет', price: 18400, amount: 23 },
	},
};

const fetchProductList = () => database.productList;

const fetchProduct = (id) =>
	new Promise((resolve) => {
		setTimeout(() => {
			resolve(database.products[id]);
		}, 2500);
	});

const LOADING_TIMEOUT = 5000;

const MainPage = () => <div>Контент главной страницы</div>;
const Catalog = () => (
	<div>
		<h3>Каталог товаров</h3>
		<ul>
			{fetchProductList().map(({ id, name }) => (
				<li key={id}>
					<NavLink to={`product/${id}`}>{name}</NavLink>
				</li>
			))}
		</ul>
		<Outlet />
	</div>
);
const ProductNotFound = () => <div>Такого товара не существует</div>;
const ProductLoadError = () => (
	<div>Ошибка загрузки товара, попробуйте ещё раз позднее</div>
);
// const Product = () => {
// 	const params = useParams();
// 	const urlMatchData = useMatch('/catalog/:type/:id');

// 	console.log(urlMatchData);

// 	const product = fetchProduct(params.id);

// 	if (!product) return <ProductNotFound />;

// 	const { name, price, amount } = product;

// 	return (
// 		<div>
// 			<h3>Товар - {name}</h3>
// 			<div>Цена: {price} руб</div>
// 			<div>На складе: {amount}</div>
// 		</div>
// 	);
// };
const Product = () => {
	const [product, setProduct] = useState(null);
	const params = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		let isLoadingTimeout = false;
		let isProductLoaded = false;

		setTimeout(() => {
			isLoadingTimeout = true;

			if (!isProductLoaded) {
				navigate('/product-load-error');
			}
		}, LOADING_TIMEOUT);

		fetchProduct(params.id).then((loadedProduct) => {
			isProductLoaded = true;

			if (!isLoadingTimeout) {
				if (!loadedProduct) {
					navigate('/product-not-exist');
					return;
				}

				setProduct(loadedProduct);
			}
		});
	}, [params.id, navigate]);

	if (!product) {
		return null;
	}

	const { name, price, amount } = product;

	return (
		<div>
			<h3>Товар - {name}</h3>
			<div>Цена: {price} руб.</div>
			<div>На складе: {amount} шт.</div>
		</div>
	);
};

const Contacts = () => <div>Контент контактов</div>;
const NotFound = () => <div>Такой страницы не существует</div>;

const ExtendedLink = ({ to, children }) => (
	<NavLink to={to}>
		{({ isActive }) =>
			isActive ? (
				<>
					<span>{children}</span>
					<span>*</span>
				</>
			) : (
				children
			)
		}
	</NavLink>
);

export const App = () => {
	return (
		<div className={styles.app}>
			<div>
				<h3>Меню</h3>
				<ul>
					<li>
						<ExtendedLink to="/">Главная</ExtendedLink>
					</li>
					<li>
						<ExtendedLink to="/catalog">Каталог</ExtendedLink>
					</li>
					<li>
						<ExtendedLink to="/contacts">Контакты</ExtendedLink>
					</li>
				</ul>
			</div>
			<Routes>
				<Route path="/" element={<MainPage />} />
				<Route path="/catalog" element={<Catalog />}>
					<Route path="product/:id" element={<Product />} />
					<Route path="service/:id" element={<Product />} />
				</Route>
				<Route path="/contacts" element={<Contacts />} />
				<Route path="/product-load-error" element={<ProductLoadError />} />
				<Route path="/product-not-exist" element={<ProductNotFound />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</div>
	);
};
