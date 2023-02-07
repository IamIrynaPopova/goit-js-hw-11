import Notiflix from 'notiflix';
import API from './api';
import reset from './api'

const formEL = document.getElementById('search-form');
const galleryEL = document.querySelector('.gallery');
const buttonLoadMoreEL = document.querySelector('.load-more');

buttonLoadMoreEL.classList.add('hidden');

formEL.addEventListener('submit', onSubmit);
buttonLoadMoreEL.addEventListener('click', onLoadMore);

let inputValue = " ";

async function onSubmit(e) {
  galleryEL.innerHTML = '';
  e.preventDefault();
  const form = e.currentTarget;
  inputValue = form.elements.searchQuery.value;
  try {
    reset.resetPage();
    const images = await API.getImages(inputValue);
     buttonLoadMoreEL.classList.remove('hidden');
    if (images === []) {
      // ??????
      throw new Error('No data');
    }
    return images.reduce((markup, item) => createList(item) + markup, '');
  } catch (error) {
    onError(error);
  } finally {
    form.reset();
  }
};


async function onLoadMore() {
  galleryEL.innerHTML = '';
    try {
    const images = await API.getImages(inputValue);
    if (images.length === 0) {
       throw new Error('No data');
    }
    return images.reduce((markup, item) => createList(item) + markup, '');
  } catch (error) {
    Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  }
};

function createList({ webformatURL, tags, likes, views, comments, downloads }) {
  const list = ` <div class="photo-card">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
    <div class="info">
      <p class="info-item">
        <b>Likes${likes}</b>
      </p>
      <p class="info-item">
        <b>Views${views}</b>
      </p>
      <p class="info-item">
        <b>Comments${comments}</b>
      </p>
      <p class="info-item">
        <b>Downloads${downloads}</b>
      </p>
    </div>
  </div>`;
  return galleryEL.insertAdjacentHTML('beforeend', list);
}

function onError(error) {
  console.error(error);
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
};



