import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import "core-js/stable";
import "regenerator-runtime/runtime.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";
import addRecipeView from "./views/addRecipeView.js";
import { MODAL_CLOSE_SEC } from "./config.js";

if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    recipeView.renderSpinner();
    resultsView.updateMarkup(model.getResultsPage());
    await model.loadRecipe(id);
    bookmarksView.updateMarkup(model.state.bookmarks);
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearch = async function () {
  try {
    resultsView.renderSpinner();

    const searchQuery = searchView.getQuery();

    if (!searchQuery) return;

    paginationView._clear();

    await model.loadSearchResults(searchQuery);

    resultsView._clear();

    if (!model.state.search.results.length) throw err;

    resultsView.render(model.getResultsPage());
    paginationView.render(model.state.search);
  } catch (err) {
    resultsView.renderError();
  }
};

const controlPagination = function (page) {
  resultsView.render(model.getResultsPage(page));
  paginationView.render(model.state.search);
};

const controlServings = function (numServing) {
  model.updateServings(numServing);
  recipeView.updateMarkup(model.state.recipe);
};

const controlAddBookmark = function () {
  const recipe = model.state.recipe;

  recipe.bookmarked
    ? model.removeBookmark(recipe)
    : model.bookmarkRecipe(model.state.recipe);

  recipeView.updateMarkup(model.state.recipe);
  bookmarksView.render(model.state.bookmarks);
};

const controlLocalStorage = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (recipe) {
  try {
    addRecipeView.renderSpinner();

    await model.uploadRecipe(recipe);

    recipeView.render(model.state.recipe);

    addRecipeView.renderMessage();

    bookmarksView.render(model.state.bookmarks);

    window.history.pushState(null, "", `#${model.state.recipe.id}`);

    setTimeout(addRecipeView._toggleModal, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err);
  }
};

const newFeature = function () {
  console.log("This is new Feature");
};

const init = function () {
  searchView.addHandlerSearch(controlSearch);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerServing(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  paginationView.addHandlerPagination(controlPagination);
  bookmarksView.addHandlerStorage(controlLocalStorage);
  addRecipeView._addHandlerUpload(controlAddRecipe);
  newFeature();
};

init();
