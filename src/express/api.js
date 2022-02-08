'use strict';

const axios = require(`axios`);

const {API_TIMEOUT, HttpMethod} = require(`../constants`);

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout
    });
  }

  async _load(url, options) {
    const response = await this._http.request({url, ...options});

    return response.data;
  }

  getArticles(params = {}) {
    return this._load(`/articles`, {params});
  }

  getArticle(id, {comments}) {
    return this._load(`/articles/${id}`, {params: {comments}});
  }

  search(query) {
    return this._load(`/search`, {params: {query}});
  }

  getCategories(count) {
    return this._load(`/categories`, {params: {count}});
  }

  createCategory(data) {
    return this._load(`/categories`, {
      method: HttpMethod.POST,
      data
    });
  }

  updateCategory(id, data) {
    return this._load(`/categories/${id}`, {
      method: HttpMethod.PUT,
      data
    });
  }

  deleteCategory(id) {
    return this._load(`/categories/${id}`, {
      method: HttpMethod.DELETE
    });
  }

  createArticle(data) {
    return this._load(`/articles`, {
      method: HttpMethod.POST,
      data
    });
  }

  updateArticle(id, data) {
    return this._load(`/articles/${id}`, {
      method: HttpMethod.PUT,
      data
    });
  }

  createComment(id, data) {
    return this._load(`/articles/${id}/comments`, {
      method: HttpMethod.POST,
      data
    });
  }

  createUser(data) {
    return this._load(`/user`, {
      method: HttpMethod.POST,
      data
    });
  }

  auth(email, password) {
    return this._load(`/user/auth`, {
      method: HttpMethod.POST,
      data: {email, password}
    });
  }
}

const port = process.env.API_PORT || 3000;
const defaultUrl = `http://localhost:${port}/api/`;
const defaultAPI = new API(defaultUrl, API_TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};
