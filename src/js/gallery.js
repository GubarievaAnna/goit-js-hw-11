import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/';

export class GalleryApi {
  #API_KEY = '28571023-8e49c7f94aea826d37a546ac4';

  constuctor() {
    this.page = 1;
    this.query = null;
  }

  fetchPictures() {
    axios.defaults.params = {
      key: this.#API_KEY,
      q: this.query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
      page: this.page,
    };

    return axios.get(`api/`).then(response => response.data);
  }
}
