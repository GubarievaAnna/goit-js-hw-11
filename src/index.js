import { GalleryApi } from './js/fetchPictures';
import createMarkupForPictures from './templates/markup_pictures.hbs';

const galleryApi = new GalleryApi();

const formEl = document.querySelector('.search-form');
const containerEl = document.querySelector('.gallery');
const btnLoadMoreEl = document.querySelector('.load-more');

formEl.addEventListener('submit', onFormSubmit);
btnLoadMoreEl.addEventListener('click', onButtonClick);

function onFormSubmit(event) {
  event.preventDefault();
  galleryApi.query = event.currentTarget.elements.searchQuery.value;
  galleryApi.page = 1;

  galleryApi
    .fetchPictures()
    .then(data => {
      if (data.hits.length === 0) {
        throw 'Sorry, there are no images matching your search query. Please try again.';
      }
      containerEl.innerHTML = createMarkupForPictures(data.hits);
      btnLoadMoreEl.classList.remove('is-hidden');
    })
    .catch(console.log);
}

function onButtonClick(event) {
  galleryApi.page += 1;

  galleryApi
    .fetchPictures()
    .then(data => {
      containerEl.insertAdjacentHTML(
        'beforeend',
        createMarkupForPictures(data.hits)
      );
    })
    .catch(console.log);
}
