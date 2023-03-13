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
const sectionsContainer = document.getElementById("sections-container");

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

function getSectionName(str){
  str = str.split("_");
  str = str.map(word =>{
    word = word.split("");
    word[0] = word[0].toUpperCase();
    word = word.join("");
    return word;
  });
  str = str.join(" ");
  return str;
}

async function openDetails(mediaType,id){
  const url = API+`/${mediaType}/${id}${QP_API_KEY}`;
  const movie = await getFetchData(url);
  console.log(movie);
}

function renderHomeSection(section, data){
  const sectionNode = document.createElement("section");
  sectionNode.setAttribute("id",section+"-section");
  
  const name = getSectionName(section);
  const h2 = document.createElement("h2");
  h2.classList.add("section-title");
  h2.innerHTML = name;

  const itemsContainer = document.createElement("div");
  itemsContainer.classList.add("section-items-container");

  data.forEach(item => {
    const article = document.createElement("article");
    article.classList.add("section-item");
    const img = document.createElement("img");
    img.setAttribute("src",imageBaseUrlSmall+item.poster_path);
    img.setAttribute("alt",item.title);
    img.classList.add("section-item-img");
    article.appendChild(img);
    article.addEventListener("click",()=>{
      openDetails("movie",item.id)
    });
    itemsContainer.appendChild(article);
  });

  sectionNode.append(
    h2,
    itemsContainer
  );
  sectionsContainer.append(sectionNode);
}

async function getMoviesPreview(){
  sectionsContainer.innerHTML="";
  for(const section in apiEndpoints.movies){
    const url = apiEndpoints.movies[section]+QP_API_KEY;
    const data = await getFetchData(url);
    const movies = data.results;
    if(movies){
      renderHomeSection(section,movies);
      console.log(movies);
    }
  }
}
window.onload = getMoviesPreview();