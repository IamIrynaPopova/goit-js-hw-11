import Notiflix from 'notiflix';
import API from './api';
import reset from './api';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formEL = document.getElementById('search-form');
const galleryEL = document.querySelector('.gallery');
const buttonLoadMoreEL = document.querySelector('.load-more');
buttonLoadMoreEL.classList.add('hidden');

formEL.addEventListener('submit', onSubmit);
buttonLoadMoreEL.addEventListener('click', onLoadMore);

let inputValue = ' ';

async function onSubmit(e) {
  buttonLoadMoreEL.classList.add('hidden');
  galleryEL.innerHTML = '';
  e.preventDefault();
  const form = e.currentTarget;
  inputValue = form.elements.searchQuery.value;
  try {
    reset.resetPage();
    const data = await API.getImages(inputValue);
    const images = await data.hits;
    if (images.length === 0) {
           throw new Error();
    }
      const markup = await images.reduce(
      (markup, item) => createList(item) + markup,
      ' '
    );
    Notiflix.Notify.info(`Hooray! We found ${data.total} images.`);
    updateNewList(markup);
  } catch (error) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } finally {
    form.reset();
  }
}

async function onLoadMore() {
  try {
    const data = await API.getImages(inputValue);
    const images = await data.hits;
    if (images.length === 0) {
      throw new Error();
    }
    const markup = images.reduce(
      (markup, item) => createList(item) + markup,
      ' '
    );
    updateNewList(markup);
  } catch (error) {
    buttonLoadMoreEL.classList.add('hidden');
    Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  }
}

function createList({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `<div class="photo-card">
    <a class="gallery__item"  href=${largeImageURL}>
    <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" width="300"/></a>
    <div class="info">
      <p class="info-item">
        <b>Likes ${likes}</b>
      </p>
      <p class="info-item">
        <b>Views ${views}</b>
      </p>
      <p class="info-item">
        <b>Comments ${comments}</b>
      </p>
      <p class="info-item">
        <b>Downloads ${downloads}</b>
      </p>
    </div>
  </div>`;
}

function updateNewList(markup) {
  galleryEL.insertAdjacentHTML('beforeend', markup);
  new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  }).refresh();
  buttonLoadMoreEL.classList.remove('hidden');
}
