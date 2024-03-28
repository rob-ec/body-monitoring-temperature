class Temperature {
  /**
   *
   * @param {Number} value
   * @param {string} magnitude :"celsius", "kelvin", "fahrenheit"
   */
  constructor(value, magnitude = "celsius") {
    this.value = value;
    this.magnitude = magnitude;
  }

  toString() {
    if (this.celsius) {
      return `${this.value} Cº`;
    }

    return `${this.value}`;
  }

  get celsius() {
    if (this.magnitude === "celsius") {
      return this.value;
    }
  }
}

class BodyTemperature extends Temperature {
  get status() {
    if (this.celsius >= 41.0) {
      return "hyperthermia";
    }

    if (this.celsius >= 39.6) {
      return "high fever";
    }

    if (this.celsius >= 37.6) {
      return "fever";
    }

    if (this.celsius >= 35) {
      return "normal";
    }

    if (this.celsius < 35) {
      return "hypothermia";
    }

    return "normal";
  }
}

class TemperatureMesurement {
  /**
   *
   * @param {Temperature} temperature
   * @param {Date} timestamp
   * @param {Object} equipament
   */
  constructor(temperature, timestamp = null, equipament = null) {
    this.temperature = temperature;
    this.timestamp = timestamp ?? new Date();
    this.equipament = equipament;
  }

  get value() {
    return this.temperature.value;
  }

  get magnitude() {
    return this.temperature.magnitude;
  }

  formatTimestamp() {
    const day = String(this.timestamp.getDate()).padStart(2, "0");
    const month = String(this.timestamp.getMonth() + 1).padStart(2, "0");
    const year = this.timestamp.getFullYear();
    const hour = String(this.timestamp.getHours()).padStart(2, "0");
    const minute = String(this.timestamp.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} ${hour}:${minute}`;
  }
}

class BodyTemperatureMesurement extends TemperatureMesurement {
  get status() {
    return this.temperature.status;
  }
}

class BodyTemperatureMonitoring {
  /**
   *
   * @param {Array<BodyTemperatureMesurement>} mesurements
   */
  constructor(mesurements = []) {
    this.mesurements = mesurements;
  }

  /**
   *
   * @param {TemperatureMesurement} temperatureMesurement
   */
  addMeasurement(temperatureMesurement) {
    this.mesurements.push(temperatureMesurement);
    return this;
  }

  get length() {
    return this.mesurements.length;
  }

  get timestamps() {
    return this.mesurements.map((mesurement) => mesurement.formatTimestamp());
  }

  get temperatureValues() {
    return this.mesurements.map((mesurement) => mesurement.value);
  }

  get mean() {
    if (this.mesurements.length === 0) {
      return 0;
    }

    const sum = this.mesurements.reduce(
      (accumulator, mesurement) => accumulator + mesurement.value,
      0
    );

    return sum / this.mesurements.length;
  }
}

class BTMDataLoader {
  constructor(content) {
    this._content = content.trim();
    this._data = this.parse(this._content);
  }

  _hidratate() {
    return this._data.map((row) => {
      return new BodyTemperatureMesurement(
        new BodyTemperature(row.temperature, row.magnitude),
        new Date(row.timestamp)
      );
    });
  }

  load() {
    const mesurements = this._hidratate();
    return new BodyTemperatureMonitoring(mesurements);
  }

  data() {
    return this._data;
  }

  parse(content = null) {
    const csvContent = content ?? this._content;
    return d3.csvParse(csvContent);
  }
}
