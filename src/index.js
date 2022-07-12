import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import { GalleryApi } from './js/gallery';
import createMarkupForPictures from './templates/markup_pictures.hbs';

const galleryApi = new GalleryApi();

const formEl = document.querySelector('.search-form');
const containerEl = document.querySelector('.gallery');
const btnLoadMoreEl = document.querySelector('.load-more');

const OPTIONS = { timeout: 900 };
const galleryLightbox = new SimpleLightbox('.gallery__item', {
  captionsData: 'alt',
  overlayOpacity: 0.8,
  showCounter: false,
  widthRatio: 0.6,
});

formEl.addEventListener('submit', onFormSubmit);
btnLoadMoreEl.addEventListener('click', onBtnLoadMoreClick);

function onFormSubmit(event) {
  event.preventDefault();
  galleryApi.query = event.currentTarget.elements.searchQuery.value;
  galleryApi.page = 1;

  galleryApi
    .fetchPictures()
    .then(data => {
      if (data.hits.length === 0) {
        containerEl.innerHTML = '';
        disableBtnLoadMore(true);
        throw 'Sorry, there are no images matching your search query. Please try again.';
      }

      createAlertInfo(`Hooray! We found ${data.totalHits} images.`);
      fillMarkUpAfterSubmit(data.hits);
      disableBtnLoadMore(false);
    })
    .catch(createAlertFailure);
}

function onBtnLoadMoreClick() {
  galleryApi.page += 1;

  galleryApi
    .fetchPictures()
    .then(data => {
      fillMarkUpAfterLoadMore(data.hits);

      const totalPages = Math.ceil(data.totalHits / 40);
      if (totalPages === galleryApi.page) {
        disableBtnLoadMore(true);
        throw `We're sorry, but you've reached the end of search results.`;
      }
    })
    .catch(createAlertFailure);
}

function disableBtnLoadMore(status) {
  if (status) {
    btnLoadMoreEl.classList.add('is-hidden');
    return;
  }
  btnLoadMoreEl.classList.remove('is-hidden');
}

function fillMarkUpAfterSubmit(data) {
  containerEl.innerHTML = createMarkupForPictures(data);
  galleryLightbox.refresh();
}

function fillMarkUpAfterLoadMore(data) {
  containerEl.insertAdjacentHTML('beforeend', createMarkupForPictures(data));
  galleryLightbox.refresh();
}

function createAlertInfo(message) {
  return Notiflix.Notify.info(message, OPTIONS);
}
function createAlertFailure(message) {
  return Notiflix.Notify.failure(message, OPTIONS);
}
