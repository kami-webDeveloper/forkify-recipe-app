import icons from "url:../../img/icons.svg";

export default class View {
  _data;

  render(data, render = true) {
    if (!data || data.length === 0) return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentEl.insertAdjacentHTML("afterbegin", markup);
  }

  updateMarkup(data) {
    this._data = data;

    const newMarkup = this._generateMarkup();
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const arrNewEl = Array.from(newDOM.querySelectorAll("*"));
    const arrCurEl = Array.from(this._parentEl.querySelectorAll("*"));

    arrNewEl.forEach((el, i) => {
      const curEl = arrCurEl[i];

      if (!el.isEqualNode(curEl) && el.firstChild?.nodeValue.trim() !== "")
        curEl.textContent && (curEl.textContent = el.textContent);

      if (!el.isEqualNode(curEl))
        Array.from(el.attributes).forEach((att) =>
          curEl.setAttribute(att.name, att.value)
        );
    });
  }

  _clear() {
    this._parentEl.innerHTML = "";
  }

  renderSpinner() {
    const markup = `
  <div class="spinner">
    <svg>
        <use href="${icons}#icon-loader"></use>
    </svg>
  </div>
  `;

    this._clear();
    this._parentEl.insertAdjacentHTML("afterbegin", markup);
  }

  renderError(message = this._errMessage) {
    const markup = `
    <div class="error">
      <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
      </div>
          <p>${message}</p>
    </div>`;

    this._clear();
    this._parentEl.insertAdjacentHTML("afterbegin", markup);
  }

  renderMessage(message = this._message) {
    const markup = `
    <div class="message">
      <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>
          ${message}
        </p>
      </div>`;

    this._clear();
    this._parentEl.insertAdjacentHTML("afterbegin", markup);
  }
}
