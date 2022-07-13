import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/';

export class GalleryApi {
  #API_KEY = '28571023-8e49c7f94aea826d37a546ac4';

  constructor(perPage) {
    this.page = 1;
    this.query = null;
    this.perPage = perPage;
  }

  async fetchPictures() {
    axios.defaults.params = {
      key: this.#API_KEY,
      q: this.query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: this.perPage,
      page: this.page,
    };

    const response = await axios.get(`api/`);
    const data = await response.data;
    return data;
  }
}
