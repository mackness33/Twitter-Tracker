am4core.ready(function() {

    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end
    
    // Create chart instance
    var chart = am4core.create("chartdiv", am4charts.XYChart);
    
    // Add data
    var data = [
      {
        country: "Lithuania",
        research: 5.9
      },
      {
        country: "Czechia",
        research: 3.9
      },
      {
        country: "Ireland",
        research: 27.1
      },
      {
        country: "Hungary",
        research: 36.9
      },
      {
        country: "Poland",
        research: 21.1
      }
    ];
    
    chart.data = data;
    // Create axes
    var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "country";
    categoryAxis.renderer.grid.template.location = 100;
    categoryAxis.renderer.minGridDistance = 10;
    categoryAxis.interpolationDuration = 2000;
    
    var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    
    // Create series
    function createSeries(field, name) {
      var series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueX = "research";
      series.dataFields.categoryY = "country";
      series.columns.template.tooltipText = "[bold]{valueX}[/]";                        //49-50 fanno vedere il numero in grassetto quando si va sopra col mouse
      series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
    
      var hs = series.columns.template.states.create("hover");      //per cambiare colore quando ci si pasa sopra
      hs.properties.fillOpacity = 0.5;
    
      var columnTemplate = series.columns.template;
      columnTemplate.maxX = 0;
      //columnTemplate.draggable = false;
    
      /*columnTemplate.events.on("dragstart", function (ev) {
        var dataItem = ev.target.dataItem;
    
        var axislabelItem = categoryAxis.dataItemsByCategory.getKey(
          dataItem.categoryY
        )._label;
        axislabelItem.isMeasured = false;
        axislabelItem.minX = axislabelItem.pixelX;
        axislabelItem.maxX = axislabelItem.pixelX;
    
        axislabelItem.dragStart(ev.target.interactions.downPointers.getIndex(0));
        axislabelItem.dragStart(ev.pointer);
      });
      columnTemplate.events.on("dragstop", function (ev) {
        var dataItem = ev.target.dataItem;
        var axislabelItem = categoryAxis.dataItemsByCategory.getKey(
          dataItem.categoryY
        )._label;
        axislabelItem.dragStop();
        handleDragStop(ev);
      });*/
    }
    createSeries("research", "Research");
    
    /*function handleDragStop(ev) {
      data = [];
      chart.series.each(function (series) {
        if (series instanceof am4charts.ColumnSeries) {
          series.dataItems.values.sort(compare);
    
          var indexes = {};
          series.dataItems.each(function (seriesItem, index) {
            indexes[seriesItem.categoryY] = index;
          });
    
          categoryAxis.dataItems.values.sort(function (a, b) {
            var ai = indexes[a.category];
            var bi = indexes[b.category];
            if (ai == bi) {
              return 0;
            } else if (ai < bi) {
              return -1;
            } else {
              return 1;
            }
          });
    
          var i = 0;
          categoryAxis.dataItems.each(function (dataItem) {
            dataItem._index = i;
            i++;
          });
    
          categoryAxis.validateDataItems();
          series.validateDataItems();
        }
      });
    }
    
    function compare(a, b) {
      if (a.column.pixelY < b.column.pixelY) {
        return 1;
      }
      if (a.column.pixelY > b.column.pixelY) {
        return -1;
      }
      return 0;
    }*/
    
    }); // end (la parte commentata serve per trascinare le barre, ergo è utile 3 in una scala da 1 a 10)
    am4core.ready()