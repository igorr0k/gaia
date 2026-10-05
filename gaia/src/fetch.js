const BASE_URL = import.meta.env.VITE_BASE_URL;
const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY;

const fetcher = async (url) => {
  // const URL = `${BASE_URL}${endpoint}&API_KEY=${NASA_API_KEY}`;

  try {
    const response = await fetch(`${url}`);

    if (!response.ok) {
      throw new Error(`HTTP ERROR: ${response.status}: ${response.statusText}`);
    }

    const res = await response.json();
    return res;
  } catch (error) {
    console.log(`an error occured: ${error.message}`);
  }
};

export default fetcher;
