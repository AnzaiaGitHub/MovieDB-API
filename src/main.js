const API = "https://api.themoviedb.org/3";
const apiEndpoints = {
  trending:{
    route:"/trending",
    mediaType:{
      all:"/all",
      movies:"/movie",
      tv_shows:"/tv",
      person:"/person",
    },
    timeWindow:{
      day:"/day",
      week:"/week",
    }
  },
  movies: {
    popular: API+"/movie/popular",
    now_playing: API+"/movie/now_playing",
    top_rated: API+"/movie/top_rated",
    upcoming: API+"/movie/upcoming",
  },
  tvShows:{
    popular: API+"/tv/popular",
    airing_today: API+"/tv/airing_today",
    on_the_air: API+"/tv/on_the_air",
    top_rated: API+"/tv/top_rated",
  }
}
const QP_API_KEY = "?api_key="+API_KEY;
const imageBaseUrlSmall = "https://image.tmdb.org/t/p/w300";
const imageBaseUrlOriginal = "https://image.tmdb.org/t/p/original";
const firstSection = document.getElementById("section1");
const firstSectionContainer = firstSection.getElementsByClassName("section-items-container")[0];
let recommendedData = [];
function renderHomeSection(node, data){
  node.innerHTML = "";
  data.forEach(item => {
    const article = document.createElement("article");
    article.classList.add("section-item");
    const img = document.createElement("img");
    img.setAttribute("src",imageBaseUrlSmall+item.poster_path);
    img.setAttribute("alt",item.title);
    img.classList.add("section-item-img");
    article.appendChild(img);
    node.appendChild(article);
  });
}
async function getFetchData(url){
  try{
    const res = await fetch(url);
    const data = await res.json();
    return data;
  }catch(err){
    console.error(err);
    return err;
  }
}
async function getMoviesPreview(){
  for(const section in apiEndpoints.movies){
    console.log(section);
    console.log(apiEndpoints.movies[section]);
  }
  const popularMoviesUrl = 
    // API+
    // apiEndpoints.movies.route+
    apiEndpoints.movies.popular+
    QP_API_KEY;
  const data = await getFetchData(popularMoviesUrl);
  const movies = data.results;
  console.log(data);
  if(movies)
    renderHomeSection(firstSectionContainer, movies);
}
window.onload = getMoviesPreview();