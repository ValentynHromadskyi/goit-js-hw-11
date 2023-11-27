import axios from 'axios';
const BASE_URL = 'https://pixabay.com/api';
const KEY = '40910926-d6d484ee6da0ac96c6e2937dc';
const OTHER_OPTIONS = 'image_type=photo&orientation=horizontal&safesearch=true';

export async function fetchImages(userInput, page, hits) {
  const response = await axios.get(
    `${BASE_URL}/?key=${KEY}&q=${userInput}&${OTHER_OPTIONS}&per_page=${hits}&page=${page}`
  );
  return response;
}
