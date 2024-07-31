import View from "./parentView";
import previewView from "./previewView";

class ResultsView extends View {
  _parentEl = document.querySelector(".results");
  _errMessage = `No results found. Search another one!`;
  _message = "";

  _generateMarkup() {
    return this._data
      .map((result) => previewView.render(result, false))
      .join("");
  }
}

export default new ResultsView();
