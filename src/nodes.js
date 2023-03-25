const $ = (id)=>{
  return document.querySelector(`#${id}`);
};
const sectionsContainer = $("sections-container");
const headerNavbar = $("header-navbar");
const headerSearchbar = $("header-searchbar");
const headerDetail = $("header-movie-detail");
const headerDetailCourtine = $("header-movie-detail-courtine");
const headerDetailImg = $("header-movie-detail--img");
const headerDetailYear = $("header-movie-detail--year");
const headerDetailTitle = $("header-movie-detail--title");
const trendSectionNode = $("recommended-section");
const trendContainerNode = $("recommended-container");
const trendImageNode = $("recommended-img-container").getElementsByTagName("img")[0];
const trendCategoriesContainer = $("recommended-categories-container");
const trendOverviewNode = $("recommended-movie-description");
const trendRateNode = $("recommended-movie-rate");
const trendLanguageNode = $("recommended-movie-language");
const trendTitleNode = $("recommended-movie-title");