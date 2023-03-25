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

const imageBaseUrlSmall = "https://image.tmdb.org/t/p/w300";
const imageBaseUrlMedium = "https://image.tmdb.org/t/p/w500";
const imageBaseUrlOriginal = "https://image.tmdb.org/t/p/original";

// global vars
let trendingItems = [];
let curTrendingItemIndex = 0;
let categoriesList;
let trendInterval;
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
  const {data} = await API(path);
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
async function getCredits(id){
  const path = `${curMediaType}/${id}/credits`;
  const {data} = await API(path);
  return data;
}
async function getSimilarContent(id){
  const path = `${curMediaType}/${id}/similar`;
  const {data} = await API(path);
  return data.results;
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
  trendSection.removeEventListener("click",()=>openDetails);
  trendSection.addEventListener("click",()=>openDetails(trendingItems[curTrendingItemIndex].id));
  trendImageNode.setAttribute("src",`${imageBaseUrlOriginal}${(item.backdrop_path?item.backdrop_path:item.poster_path)}`);
  const year = new Date(
    curMediaType=="movie"?
    item.release_date:
    item.first_air_date
    ).getFullYear();
  trendTitleNode.childNodes[0].textContent = (item.title?item.title:item.name);
  trendTitleNode.childNodes[1].innerHTML = year;
  
  trendCategoriesContainer.innerHTML ="";
  item.genre_ids.forEach(id => {
    const category = categoriesList.find(cat => cat.id=== id);
    
    const div = document.createElement("div");
    div.classList.add("category");
    div.innerHTML = category.name;
    
    trendCategoriesContainer.append(div);
  });
  
  trendOverviewNode.innerHTML = item.overview;

  trendRateNode.innerHTML = Math.round((item.vote_average + Number.EPSILON)*10)/10;

  trendLanguageNode.innerHTML = item.original_language;
}
async function renderDetails(id){
  const path = `/${curMediaType}/${id}`;
  const {data} = await API(path);

  movieDetailImage.src = imageBaseUrlMedium+(data.backdrop_path||data.poster_path);

  const year = new Date(
    data.release_date||
    data.first_air_date
    ).getFullYear();
  movieDetailTitle.childNodes[0].textContent = (data.title?data.title:data.name);
  movieDetailTitle.childNodes[1].innerHTML = year;
  
  let duration;
  if(curMediaType=="movie"){
    duration = `Movie ${Math.floor(data.runtime/60)}h ${data.runtime%60}`;
  }else{
    duration = `${data.seasons.length} Seasons`;
  }
  movieDetailDuration.innerHTML = duration;

  movieDetailCategoriesContainer.innerHTML ="";
  data.genres.forEach(genre => {
    const div = document.createElement("div");
    div.classList.add("category");
    div.innerHTML = genre.name;
    
    movieDetailCategoriesContainer.append(div);
  });
  movieDetailOverview.innerHTML = data.overview||"No overview available";

  movieDetailRate.innerHTML = Math.round((data.vote_average + Number.EPSILON)*10)/10;

  const credits = await getCredits(id);
  movieDetailCastContainer.innerHTML="";
  credits.cast.forEach(cast=>{
    if(cast.profile_path){
      const article = document.createElement("article");
      article.classList.add("movie-detail-cast-item");
      const img = document.createElement("img");
      img.classList.add("movie-detail-cast--img");
      img.alt = cast.name;
      img.src=imageBaseUrlSmall+cast.profile_path;
      article.append(img);
      movieDetailCastContainer.append(article);
    }
  });
  
  const director = credits.crew.find(crew => crew.known_for_department == "Directing");
  movieDetailDirector.innerHTML = director.name;

  const similarContent = await getSimilarContent(id);
  movieDetailSimilarContainer.innerHTML="";
  similarContent.forEach(content => {
    if(content.poster_path){
      const article = document.createElement("article");
      article.classList.add("movie-detail-similar-item");
      const img = document.createElement("img");
      img.classList.add("movie-detail-similar-img");
      img.alt = content.title||content.name;
      img.src=imageBaseUrlSmall+content.poster_path||content.backdrop_path;
      article.append(img);
      article.addEventListener("click",()=>openDetails(content.id));
      movieDetailSimilarContainer.append(article);
    }
  });
}
function openDetails(id){
  location.hash = `#${curMediaType}=${id}`;
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
      openDetails(item.id)
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
  clearInterval(trendInterval)
  trendInterval = setInterval(nextTrend,8000);
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
  clearInterval(trendInterval);
};