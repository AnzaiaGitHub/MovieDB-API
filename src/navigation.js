let lastHash="#";
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
async function searchPage(){
  hideNodes([
    trendSection,
    sectionsContainer,
    movieDetailPage
  ]);
  showNodes([
    headerContainer,
    searchResultsSection
  ]);
  if(searchResults.query.length){
    const data = await getSearchResults(searchResults.query);
    setResults(data);
  }else{
    location.hash="#";
  }
}
function detailsPage(){
  const id = location.hash.split("=")[1];
  renderDetails(id);
  hideNodes([
    headerContainer,
    sectionsContainer,
    trendSection,
    searchResultsSection
  ]);
  showNodes([
    movieDetailPage,
  ]);
}
function categoriesPage(){
  console.log("category page");
}
function homePage(){
  hideNodes([
    movieDetailPage,
    searchResultsSection
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
  curMediaType = (hash.startsWith("#tv")?"tv":"movie");
  if(hash.startsWith("#search=")){
    searchPage();
  }else if(hash.startsWith("#movie=") || hash.startsWith("#tv=")){
    detailsPage();
  }else if(hash.startsWith("#category=")){
    categoriesPage();
  }else{
    homePage();
    clearSearchResults();
  }
}
function backBtn(){
  window.location.hash = lastHash;
}
function hashChange(e){
  const oldURL = new URL(e.oldURL);
  if(!oldURL.hash.includes("=") || oldURL.hash.includes("search")){
    lastHash=oldURL.hash;
  }
  navigation();
}
movieDetailBackBtn.addEventListener("click",backBtn);
window.onload =()=>{
  navigation();
  searchbarForm.addEventListener("submit",searchContent);
};
window.onhashchange = (e)=>{
  hashChange(e);
};