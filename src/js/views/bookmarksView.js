import View from "./parentView";
import previewView from "./previewView";

class BookmarksView extends View {
  _parentEl = document.querySelector(".bookmarks__list");
  _errMessage = `No bookmarks yet. Find a recipe and bookmark it ;)`;
  _message = "";

  _generateMarkup() {
    const id = window.location.hash.slice(1);

    return this._data
      .map(
        (result) => `<li class="preview">
                    <a class="preview__link ${
                      result.id === id ? "preview__link--active" : ""
                    }" href="#${result.id}">
                      <figure class="preview__fig">
                        <img src="${result.image}" alt="${result.title}" />
                      </figure>
                      <div class="preview__data">
                        <h4 class="preview__title">
                          ${result.title}
                        </h4>
                        <p class="preview__publisher">${result.publisher}</p>
                      </div>
                    </a>
                  </li>`
      )
      .join("");
  }

  addHandlerStorage(handler) {
    window.addEventListener("load", handler);
  }

  _generateMarkup() {
    return this._data.map((bookmark) =>
      previewView.render(bookmark, false)
    ).join("");
  }
}

export default new BookmarksView();
