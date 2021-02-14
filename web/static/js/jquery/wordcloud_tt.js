//wordcloud
function word_cloud(hashtags) {

    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    var chart = am4core.create("word_cloud", am4plugins_wordCloud.WordCloud);
    var series = chart.series.push(new am4plugins_wordCloud.WordCloudSeries());

    series.accuracy = 4;
    series.step = 15;
    series.rotationThreshold = 0.7;
    series.maxCount = 200;
    series.minWordLength = 2;
    series.labels.template.tooltipText = "{word}: {value}";
    series.fontFamily = "Courier New";
    series.maxFontSize = am4core.percent(30);
    series.labels.template.fill = am4core.color("rgb(0, 174, 255)");
    series.text = hashtags;
};