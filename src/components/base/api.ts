// ответ от сервера в виде
export type ApiListResponse<Type> = {
    total: number,
    items: Type[]
};

// типы HTTP-методов
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

//базовый класс API
export class Api {
    readonly baseUrl: string;
    protected options: RequestInit;

    //передаём базовый URL, задаются стандартные настройки
    constructor(baseUrl: string, options: RequestInit = {}) {
        this.baseUrl = baseUrl;
        this.options = {
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers as object ?? {})
            }
        };
    }
    // обработка ответа от сервера
    protected handleResponse(response: Response): Promise<object> {
        if (response.ok) return response.json();
        else return response.json()
            .then(data => Promise.reject(data.error ?? response.statusText));
    }
    // получение данных с сервера
    get(uri: string) {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method: 'GET'
        }).then(this.handleResponse);
    }
    // отправка данных на сервер
    post(uri: string, data: object, method: ApiPostMethods = 'POST') {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method,
            body: JSON.stringify(data)
        }).then(this.handleResponse);
    }
}
