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
  const [movieNav,tvNav] = document.querySelectorAll(".navbar-item");
  if(curMediaType=="movie"){
    movieNav.classList.add("active");
    tvNav.classList.remove("active");
  }else{
    tvNav.classList.add("active");
    movieNav.classList.remove("active");
  }
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
  }else{
    curMediaType = (hash=="#tvshow"?"tv":"movie");
    homePage();
  }
}
window.onload = navigation;
window.onhashchange = navigation;