import 'simplelightbox/dist/simple-lightbox.min.css';
import SimpleLightbox from 'simplelightbox';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import './css/styles.css';
import { fetchImages } from './fetchImages.js ';
import { createGallery } from './createGallery.js';

const refs = {
  form: document.getElementById('search-form'),
  gallery: document.querySelector('.gallery'),
  button: document.querySelector('.load-more'),
};

refs.button.addEventListener('click', loadMoreImgs);
refs.form.addEventListener('submit', handleSubmit);

const gallery = new SimpleLightbox('.gallery a', { captionDelay: 250 });
const HITS_PER_PAGE = 40;

let page = 1;
let totalPages = 0;
let totalHits = '';
let userInput = '';

hideBtnLoad();

async function handleSubmit(event) {
  event.preventDefault();
  hideBtnLoad();
  const { value } = event.target.elements.searchQuery;
  page = 1;
  totalPages = HITS_PER_PAGE;
  userInput = value.trim();
  if (userInput === '') {
    Notify.failure('enter a word to search.');
    return;
  }
  refs.gallery.innerHTML = '';
  try {
    const imegesData = await fetchImages(userInput, page, HITS_PER_PAGE);
    handleData(imegesData);
  } catch (error) {
    Notify.failure(`${error.message}. Please try again.`);
  }
}

function handleData({ data }) {
  showBtnLoad();
  totalHits = data.totalHits;
  if (page === 1 && data.hits.length > 0) {
    Notify.success(`Hooray! We found ${totalHits} images.`);
  }

  if (totalPages >= data.totalHits && data.hits.length > 0) {
    hideBtnLoad();
    Notify.success(
      `We're sorry, but you've reached the end of search results.`
    );
  }

  if (data.hits.length === 0) {
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  createGallery(data);
  gallery.refresh();
}

async function loadMoreImgs() {
  page += 1;
  totalPages += HITS_PER_PAGE;
  try {
    const imageData = await fetchImages(userInput, page, HITS_PER_PAGE);
    handleData(imageData);
  } catch (error) {
    Notify.failure(`${error.message}. Please try again.`);
  }
}

function hideBtnLoad() {
  refs.button.setAttribute('hidden', '');
}

function showBtnLoad() {
  refs.button.removeAttribute('hidden', '');
}
