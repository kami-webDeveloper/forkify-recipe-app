import { API_URL } from "./config.js";
import { getJson, sendJson } from "./helpers.js";
import { RESULT_PER_PAGE } from "./config.js";
import { DEV_KEY } from "./config.js";

export const state = {
  recipe: {},
  search: {
    query: "",
    results: [],
    resultPerPage: RESULT_PER_PAGE,
    currResultPage: 1,
  },
  bookmarks: [],
};

const createRecipeObj = function (data) {
  const { recipe } = data.data;

  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJson(`${API_URL}${id}?key=${DEV_KEY}`);

    state.recipe = createRecipeObj(data);

    if (state.bookmarks.some((rec) => rec.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const data = await getJson(`${API_URL}?search=${query}&key=${DEV_KEY}`);

    const { recipes } = data.data;

    const searchRecipes = recipes.map((rec) => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });

    state.search.results = searchRecipes;
    state.search.currResultPage = 1;
  } catch (err) {
    throw err;
  }
};

export const getResultsPage = function (page = state.search.currResultPage) {
  state.search.currResultPage = page;

  const start = (page - 1) * state.search.resultPerPage;
  const end = page * state.search.resultPerPage;

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServing) {
  state.recipe.ingredients.forEach((ing) => {
    const oldQuantity = ing.quantity;
    const oldServing = state.recipe.servings;
    const newQuantity = (oldQuantity * newServing) / oldServing;

    ing.quantity = newQuantity;
  });

  state.recipe.servings = newServing;
};

const saveToLocal = function () {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

export const bookmarkRecipe = function (recipe) {
  state.bookmarks.push(recipe);

  if (state.recipe.id === recipe.id) state.recipe.bookmarked = true;

  saveToLocal();
};

export const removeBookmark = function (recipe) {
  const bookmarkLocation = state.bookmarks.findIndex(
    (bookmark) => bookmark.id === recipe.id
  );

  state.bookmarks.splice(bookmarkLocation, bookmarkLocation + 1);

  state.recipe.bookmarked = false;

  saveToLocal();
};

const loadLocalStorage = function () {
  const savedBookmarks = localStorage.getItem("bookmarks");

  if (savedBookmarks) state.bookmarks = JSON.parse(savedBookmarks);
};

loadLocalStorage();

export const uploadRecipe = async function (newRecipe) {
  try {
    const arrIngs = Object.entries(newRecipe)
      .filter((entry) => entry[0].startsWith("ingredient") && entry[1] !== "")
      .map((ing) => {
        const ings = ing[1].replaceAll(" ", "").split(",");

        if (ings.length !== 3)
          throw new Error(
            "Wrong ingredient format! Use (quantity,unit,description) format :)"
          );

        const [quantity, unit, description] = ings;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients: arrIngs,
    };

    const data = await sendJson(`${API_URL}?key=${DEV_KEY}`, recipe);

    state.recipe = createRecipeObj(data);
    bookmarkRecipe(state.recipe);
  } catch (err) {
    throw err;
  }
};
