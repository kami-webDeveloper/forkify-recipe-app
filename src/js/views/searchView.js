class SearchView {
  _parentEl = document.querySelector(".search");
  _btnSearch = document.querySelector(".search__btn");
  _searchField = this._parentEl.querySelector(".search__field");

  getQuery() {
    const searchQuery = this._searchField.value;
    this._clearInput();
    return searchQuery;
  }

  addHandlerSearch(handler) {
    this._parentEl.addEventListener("submit", (e) => {
      e.preventDefault();
      handler();
    });
    this._btnSearch.addEventListener("click", (e) => {
      e.preventDefault();
      handler();
    });
  }

  _clearInput() {
    this._searchField.value = "";
  }
}

export default new SearchView();
