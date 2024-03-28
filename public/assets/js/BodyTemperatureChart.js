class BodyTemperatureChart {
  /**
   * @param {HTMLElement} ctx
   * @param {BodyTemperatureMonitoring} mesurements
   */
  constructor(
    ctx,
    mesurements,
    title = "Body Temperature Monitoring",
    type = "line",
    animate = true,
    colors = {
      main: "#307fe2",
      blue: "#307fe2",
      red: "#E40046",
      darkGray: "#2D2926",
      lightGray: "#DBE2E9",
    }
  ) {
    this.ctx = ctx;
    this.mesurements = mesurements;
    this.title = title;
    this.type = type;
    this.animate = animate;
    this.colors = colors;

    this.chart = this._setChart();
  }

  get labels() {
    return this.mesurements.timestamps;
  }

  get values() {
    return this.mesurements.temperatureValues;
  }

  get data() {
    return {
      labels: this.labels,
      datasets: [
        {
          label: "Temperature (Cº)",
          data: this.values,
          boderColor: this.colors.main,
          backgroundColor: this.colors.main,
          tension: 0.15,
        },
      ],
    };
  }

  _tooltipFooter(tooltipItems) {
    const bodyTemperatureStatus = (temperature) => {
      if (temperature >= 41.0) {
        return "hyperthermia";
      }

      if (temperature >= 39.6) {
        return "high fever";
      }

      if (temperature >= 37.6) {
        return "fever";
      }

      if (temperature >= 35) {
        return "normal";
      }

      if (temperature < 35) {
        return "hypothermia";
      }

      return "normal";
    };

    return "Status: " + bodyTemperatureStatus(tooltipItems[0].parsed.y);
  }

  get config() {
    return {
      type: this.type,
      data: this.data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: this.title ? true : false,
            text: this.title,
          },
          tooltip: {
            callbacks: {
              footer: this._tooltipFooter,
            },
          },
        },
        animation: this.animation,
        scales: {
          y: {
            ticks: {
              callback: function (value, index, ticks) {
                return (
                  Chart.Ticks.formatters.numeric.apply(this, [
                    value,
                    index,
                    ticks,
                  ]) + ` Cº`
                );
              },
            },
          },
        },
      },
    };
  }

  get animation() {
    if (!this.animate) {
      return {};
    }

    const totalDuration = 1500;
    const delayBetweenPoints = totalDuration / this.mesurements.length;
    const previousY = (ctx) =>
      ctx.index === 0
        ? ctx.chart.scales.y.getPixelForValue(100)
        : ctx.chart
            .getDatasetMeta(ctx.datasetIndex)
            .data[ctx.index - 1].getProps(["y"], true).y;

    return {
      x: {
        type: "number",
        easing: "linear",
        duration: delayBetweenPoints,
        from: NaN, // the point is initially skipped
        delay(ctx) {
          if (ctx.type !== "data" || ctx.xStarted) {
            return 0;
          }
          ctx.xStarted = true;
          return ctx.index * delayBetweenPoints;
        },
      },
      y: {
        type: "number",
        easing: "linear",
        duration: delayBetweenPoints,
        from: previousY,
        delay(ctx) {
          if (ctx.type !== "data" || ctx.yStarted) {
            return 0;
          }
          ctx.yStarted = true;
          return ctx.index * delayBetweenPoints;
        },
      },
    };
  }

  update(mesurements = null) {
    if (mesurements) {
      this.mesurements = mesurements;
    }

    this.chart.destroy();
    this.chart = this._setChart();

    return this;
  }

  _setChart() {
    return new Chart(this.ctx, this.config);
  }
}
