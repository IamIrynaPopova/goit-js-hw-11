import axios from 'axios'; 

const API_KEY = '33396133-a1b2adde6227e288651288158';
const URL = 'https://pixabay.com/api/';
const imageType = 'photo';
const imageOrientation = 'horizontal';
const imageSafeSearch = 'true';
let page = 1;

async function getImages(query) {
  const response = await axios.get(
    ` ${URL}?key=${API_KEY}&q=${query}&image_type=${imageType}&orientation=${imageOrientation}&safesearch=${imageSafeSearch}&page=${page}&per_page=40`
  );
  page += 1;
 return response.data.hits;
};

function resetPage() {
  page = 1;
};

export default { getImages, resetPage };
