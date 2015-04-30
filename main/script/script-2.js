var margin = {t:50,l:50,b:50,r:50},
    width = $('.canvas').width()-margin.l-margin.r,
    height = $('.canvas').height()-margin.t-margin.b;

var svg = d3.select('.canvas')
    .append('svg')
    .attr('width',width+margin.l+margin.r)
    .attr('height',height+margin.t+margin.b)
    .append('g')
    .attr('transform',"translate("+margin.l+","+margin.t+")");

/*setting base*/
var year0 = 1990, year1 = 2012;

var scaleData = d3.scale.linear().range([0,100]);

var worldByCountry = d3.map();

/* begin to load data */
console.log("Start loading data");
queue()
    .defer(d3.csv,"data/eg.elc.pro.kh.csv",production)
    .await(dataLoaded);

/*load rows*/
function production(d){
    for (var i=year0;i<=year1;i++) {
        return {
            countryCode: +d.CountryCode,
            countryName: d.CountryName,
            year: i,
            value: +d[i]
        };
    }
    console.log(d);
    var countryID = d['CountryCode'],
        countries = d['CountryName'];
    worldByCountry.set(countryID,countries);
}

function dataLoaded(err,production){

    var nest = d3.nest()
        .rollup(function(leaves){
            var dataSeries = d3.map();

            leaves.forEach(function(leaf){
                dataSeries.set(leaf.year, leaf.value);
            });

            return dataSeries;
        })
        .key(function(d){ return d.countryName; });

    var countryData = nest.entries(production);

    console.log(countryData);

    draw(countryData);
}

function draw() {

}
