function searchPage(){
  console.log("search page");
}
function movieDetailsPage(){
  console.log("movieDetails page");
}
function categoryPage(){
  console.log("category page");
}
function homePage(){
  console.log("home page "+curMediaType);
  getMoviesPreview();
}
function navigation (){
  const hash = location.hash;
  if(hash.startsWith("#search=")){
    searchPage();
  }else if(hash.startsWith("#movie=")){
    movieDetailsPage();
  }else if(hash.startsWith("#category=")){
    categoryPage();
  }else if(hash.startsWith("#tvshow")){
    curMediaType="tv"
    homePage();
  }else{
    curMediaType="movie"
    homePage();
  }
}
window.onload = navigation;
window.onhashchange = navigation;