function hideNodes(node){
  if(node[0])
    node.forEach(nd => nd.classList.add("hidden"));
  else
    node.classList.add("hidden");
}
function showNodes(node){
  if(node[0])
    node.forEach(nd => nd.classList.remove("hidden"));
  else
    node.classList.remove("hidden");
}
function searchPage(){
  console.log("search page");
}
async function detailsPage(){
  const id = location.hash.split("=")[1];
  const path = `/${curMediaType}/${id}`;
  const {data} = await API(path);
  console.log(data);
  hideNodes([
    headerNavbar,
    headerSearchbar,
    trendSectionNode
  ]);
  showNodes([
    headerDetail,
  ]);
  
  headerDetailImg.src = `${imageBaseUrlMedium}${data.backdrop_path}`;
  
  const year = new Date(
    curMediaType=="movie"?
    data.release_date:
    data.first_air_date
    ).getFullYear();
  headerDetailTitle.childNodes[0].textContent = (data.title?data.title:data.name);
  headerDetailTitle.childNodes[1].innerHTML = year;
  
}
function categoriesPage(){
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
  }else if(hash.startsWith("#movie=") || hash.startsWith("#tv=")){
    detailsPage();
  }else if(hash.startsWith("#category=")){
    categoriesPage();
  }else{
    curMediaType = (hash=="#tvshow"?"tv":"movie");
    homePage();
  }
}
window.onload = navigation;
window.onhashchange = navigation;