import View from "./parentView";
import icons from "url:../../img/icons.svg";

class PaginationView extends View {
  _parentEl = document.querySelector(".pagination");
  _curPage;

  _generateMarkupBtn(type, currentPage) {
    const goToPage = type === "next" ? currentPage + 1 : currentPage - 1;

    return `<button data-goto="${goToPage}" class="btn--inline pagination__btn--${
      type === "next" ? "next" : "prev"
    }">
          <span>Page ${goToPage}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button>`;
  }

  _generateMarkup() {
    const curPage = this._data.currResultPage;

    const pagesCount = Math.ceil(
      this._data.results.length / this._data.resultPerPage
    );

    if (curPage === 1 && pagesCount > 1)
      return this._generateMarkupBtn("next", curPage);

    if (curPage === pagesCount && curPage > 1)
      return this._generateMarkupBtn("prev", curPage);

    if (curPage < pagesCount)
      return `${this._generateMarkupBtn(
        "prev",
        curPage
      )}${this._generateMarkupBtn("next", curPage)}`;

    return ``;
  }

  addHandlerPagination(handler) {
    this._parentEl.addEventListener("click", (e) => {
      e.preventDefault();

      const button = e.target.closest(".btn--inline");

      if (!button) return;

      const goTo = Number(button.dataset.goto);

      handler(goTo);
    });
  }
}

export default new PaginationView();
