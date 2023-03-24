const API = axios.create({
  baseURL:"https://api.themoviedb.org/3",
  headers:{
    'Content-Type':'application/json;charset=utf-8',
  },
  params: {
    'api_key':API_KEY,
  }
});
const apiEndpoints = {
  trending:{
    route:"/trending",
    mediaType:{
      all:"/all",
      movie:"/movie",
      tv:"/tv",
      person:"/person",
    },
    timeWindow:{
      day:"/day",
      week:"/week",
    }
  },
  movies: {
    popular: "/movie/popular",
    now_playing: "/movie/now_playing",
    top_rated: "/movie/top_rated",
    upcoming: "/movie/upcoming",
  },
  tvShows:{
    popular: "/tv/popular",
    airing_today: "/tv/airing_today",
    on_the_air: "/tv/on_the_air",
    top_rated: "/tv/top_rated",
  }
}
const $ = (id)=>{
  return document.querySelector(`#${id}`);
};
const imageBaseUrlSmall = "https://image.tmdb.org/t/p/w300";
const imageBaseUrlMedium = "https://image.tmdb.org/t/p/w500";
const imageBaseUrlOriginal = "https://image.tmdb.org/t/p/original";
// html nodes
const sectionsContainer = $("sections-container");
// global vars
let trendingItems = [];
let curTrendingItemIndex = 0;
let categoriesList;
let curMediaType = "movie";//movie or tv
// functions
async function setCategories(){
  try{
    const res = await API(`/genre/${curMediaType}/list`);
    const data = await res.data;
    if(data){
      categoriesList = data.genres;
    }
  }catch(err){
    console.error(err);
  }
}
async function getTrending(mediaType,timeWindow){
  const path = 
  apiEndpoints.trending.route+
  apiEndpoints.trending.mediaType[mediaType]+
  apiEndpoints.trending.timeWindow[timeWindow];
  const res = await API(path);
  const data = await res.data;
  console.log("getTrending");
  console.log(data.results);
  return data.results;
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

function nextTrend(){
  if(curTrendingItemIndex == trendingItems.length-1)
    curTrendingItemIndex=0;
  else
    curTrendingItemIndex++;
  renderTrending();
}
function renderTrending(){
  const item = trendingItems[curTrendingItemIndex];

  const imageNode = $("recommended-img-container").getElementsByTagName("img")[0];
  imageNode.setAttribute("src",`${imageBaseUrlMedium}${(item.backdrop_path?item.backdrop_path:item.poster_path)}`);
  const year = new Date(
    curMediaType=="movie"?
    item.release_date:
    item.first_air_date
    ).getFullYear();
  const titleNode = $("recommended-movie-title");
  titleNode.childNodes[0].textContent = (item.title?item.title:item.name);
  titleNode.childNodes[1].innerHTML = year;

  const categoriesContainer = $("recommended-categories-container");
  categoriesContainer.innerHTML ="";
  item.genre_ids.forEach(id => {
    const category = categoriesList.find(cat => cat.id=== id);
    
    const div = document.createElement("div");
    div.classList.add("category");
    div.innerHTML = category.name;
    
    categoriesContainer.append(div);
  });

  const overviewNode = $("recommended-movie-description");
  overviewNode.innerHTML = item.overview;
  
  const rateNode = $("recommended-movie-rate");
  rateNode.innerHTML = Math.round((item.vote_average + Number.EPSILON)*10)/10;

  const languageNode = $("recommended-movie-language");
  languageNode.innerHTML = item.original_language;
}

async function openDetails(mediaType,id){
  const path = `/${mediaType}/${id}`;
  const {data} = await API(path);
  console.log(data);
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
    img.setAttribute("src",imageBaseUrlSmall+(item.poster_path?item.poster_path:item.backdrop_path));
    img.setAttribute("alt",item.title);
    img.classList.add("section-item-img");
    article.appendChild(img);
    article.addEventListener("click",()=>{
      openDetails(curMediaType,item.id)
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
  await setCategories();
  const trendingLong = "week"; //week-day
  trendingItems = await getTrending(curMediaType,trendingLong);
  curTrendingItemIndex=0;
  renderTrending();
  window.setInterval(()=>nextTrend(),8000);
  sectionsContainer.innerHTML="";
  const contentToRender = curMediaType=="movie"?apiEndpoints.movies:apiEndpoints.tvShows
  for(const section in contentToRender){
    const path = contentToRender[section];
    const res = await API(path);
    const data = res.data;
    const results = data.results;
    if(results){
      renderHomeSection(section,results);
    }
  }
}

window.onclose = ()=>{
  clearInterval(()=>nextTrend(),8000);
};