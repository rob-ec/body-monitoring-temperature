class BTMTable {
  /**
   * @param {HTMLElement} element
   * @param {BodyTemperatureMonitoring} mesurements
   */
  constructor(element, mesurements, caption = "Body Temperature Monitoring") {
    this.element = element;
    this.mesurements = mesurements;
    this.caption = caption;

    this.clearElement();
    this.insertTable();
  }

  clearElement() {
    this.element.textContent = "";
    return this;
  }

  insertTable() {
    this.element.appendChild(this._table());
    return this;
  }

  update(mesurements = null) {
    if (mesurements) {
      this.mesurements = mesurements;
    }

    this.clearElement().insertTable();
  }

  _caption() {
    const caption = document.createElement("caption");
    caption.textContent = this.caption;

    return caption;
  }

  _thead() {
    const thead = document.createElement("thead");

    thead.appendChild(
      this._row(["Date & Time", "Temperature", "Magnitude", "Status"], "th")
    );

    return thead;
  }

  _row(columns, type = "td") {
    const tr = document.createElement(`tr`);

    columns.forEach((column) => {
      const columnElement = document.createElement(type);
      columnElement.textContent = column;
      tr.appendChild(columnElement);
    });

    return tr;
  }

  _tbody() {
    const tbody = document.createElement("tbody");
    this.mesurements.mesurements.forEach((mesurement) => {
      tbody.appendChild(
        this._row([
          mesurement.formatTimestamp(),
          mesurement.value,
          mesurement.magnitude,
          mesurement.status,
        ])
      );
    });
    return tbody;
  }

  _table() {
    const table = document.createElement("table");
    table.appendChild(this._caption());
    table.appendChild(this._thead());
    table.appendChild(this._tbody());

    return table;
  }
}
