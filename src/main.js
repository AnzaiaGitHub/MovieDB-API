const API = "https://api.themoviedb.org/3";
const apiEndpoints = {
  trending:{
    route:"/trending",
    mediaType:{
      all:"/all",
      movies:"/movie",
      tvShows:"/tv",
      person:"/person",
    },
    timeWindow:{
      day:"/day",
      week:"/week",
    }
  },
  movies: {
    route: "/movie",
    popular: "/popular",
    nowPlaying: "/now_playing",
    topRated: "/top_rated",
    upcoming: "/upcoming",
  },
  tvShows:{
    route: "/tv",
    popular: "/popular",
    airingToday: "/airing_today",
    onTheAir: "/on_the_air",
    topRated: "/top_rated",
  }
}
const imageBaseUrlSmall = "https://image.tmdb.org/t/p/w300";
const imageBaseUrlOriginal = "https://image.tmdb.org/t/p/original";
const firstSection = document.getElementById("section1");
const firstSectionContainer = firstSection.getElementsByClassName("section-items-container")[0];
async function getPopularMoviesPreview(){
  try{
    const popularMoviesUrl = 
      API+
      apiEndpoints.movies.route+
      apiEndpoints.movies.popular+
      `?api_key=${API_KEY}`;
    const res = await fetch(popularMoviesUrl);
    const data = await res.json();
    const movies = data.results;
    console.log(popularMoviesUrl);
    console.log(movies);
    firstSectionContainer.innerHTML="";
    movies.forEach(movie => {
      const article = document.createElement("article");
      article.classList.add("section-item");
      const img = document.createElement("img");
      img.setAttribute("src",imageBaseUrlSmall+movie.poster_path);
      img.setAttribute("alt",movie.title);
      img.classList.add("section-item-img");
      article.appendChild(img);
      firstSectionContainer.appendChild(article);
    });
  }catch(err){
    console.error(err);
  }
}
window.onload = getPopularMoviesPreview();