function hideNodes(node){
  if(node==null)
    return;
  if(node[0])
    node.forEach(nd => nd.classList.add("hidden"));
  else
    node.classList.add("hidden");
}
function showNodes(node){
  if(node==null)
    return;
  if(node[0])
    node.forEach(nd => nd.classList.remove("hidden"));
  else
    node.classList.remove("hidden");
}
function searchPage(){
  console.log("search page");
}
function detailsPage(){
  const id = location.hash.split("=")[1];
  renderDetails(id);
  hideNodes([
    headerContainer,
    sectionsContainer,
    trendSection
  ]);
  showNodes([
    movieDetailPage,
  ]);
}
function categoriesPage(){
  console.log("category page");
}
function homePage(){
  if(location.hash.startsWith("#tv"))
    curMediaType="tv";
  else
    curMediaType="movie";
  hideNodes([
    movieDetailPage,
  ]);
  showNodes([
    headerContainer,
    sectionsContainer,
    trendSection
  ]);
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