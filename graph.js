<style>


</style>

<script src="http://d3js.org/d3.v2.js"></script>
<script type="text/javascript">var networkOutputBinding = new Shiny.OutputBinding();
  $.extend(networkOutputBinding, {
    find: function(scope) {
      return $(scope).find('.shiny-network-output');
    },
    renderValue: function(el, data) {
        var margin = {top: 50, right: 20, bottom: 50, left: 20},
            width =  800, // - margin.right - margin.left,
            height = 600; // - margin.top - margin.bottom;      

        //remove the old graph
          var svg = d3.select(el).select("svg");

          svg.remove();
          
          $(el).html("");
          
          //append a new one
          svg = d3.select(el).append("svg")
                .attr("width", width + margin.right + margin.left)
                .attr("height", height + margin.top + margin.bottom);

        
        var perfdata = new Array();

        var parse = d3.time.format("%m/%d/%Y").parse, format = d3.time.format("%Y")      
        
        for (var inc=0;inc<data.Date.length;inc++)  { 
                //here is where my javascript ineptness shows best
                //i need to figure out the proper way to loop through each of the symbols (columns from the r data.frame)
                //within the object data rather than manually coding this
                perfdata[inc]  = { date: parse(data.Date[inc]) , perf : parseFloat(data.SP500[inc]), symbol : "SP500" };
                perfdata[inc + data.Date.length] = { date: parse(data.Date[inc]) , perf : parseFloat(data.BarAgg[inc]), symbol : "BarAgg" };
            }

            // Nest stock values by symbol.
            symbols = d3.nest()
              .key(function(d) { return d.symbol; })
              .entries(perfdata);        
    
            var x = d3.time.scale()
                .range([0, width - 60]);
            
            var y = d3.scale.linear()
                .range([height - 20, 0]);
            
            var duration = 1500,
                delay = 500;
            
            var color = d3.scale.category10();
            
           //svg
            //    .attr("id","svgchart")
            //    .attr("width", width + margin.right + margin.left)
            //    .attr("height", height + margin.top + margin.bottom)
            //    .append("g")
            //        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
                
                // do the minimum and maximum dates
                x.domain([
                    parse(data.Date[0]),
                    parse(data.Date[data.Date.length-1])
                ]);
                
                var g = svg.selectAll("g")
                    .data(symbols)
                    .enter().append("g")
                        .attr("class", "symbol");  
                                
            groupedBar();
            
            function groupedBar() {
                  x = d3.scale.ordinal()
                      .domain(symbols[0].values.map(function(d) { return d.date; }))
                      .rangeBands([0, width - 60], .1);
                
                  var x1 = d3.scale.ordinal()
                      .domain(symbols.map(function(d) { return d.key; }))
                      .rangeBands([0, x.rangeBand()]);
    
                var y0 = Math.max(Math.abs(d3.min(symbols.map(function(d) { return d3.min(d.values.map(function(d) { return d.perf; })); }))), d3.max(symbols.map(function(d) { return d3.max(d.values.map(function(d) { return d.perf; })); })));                
                y
                    .domain([-y0, y0])
                    //.domain([d3.min(symbols.map(function(d) { return d3.min(d.values.map(function(d) { return d.perf; })); })), d3.max(symbols.map(function(d) { return d3.max(d.values.map(function(d) { return d.perf; })); }))])
                    .range([height, 0])
                    .nice();
                
                var yAxis = d3.svg.axis().scale(y).orient("left");                            

                svg.selectAll(".labels")
                    .data(symbols[0].values.map(function(d) { return d.date; }))
                    .enter().append("text")
                        .attr("class", "labels")
                        .attr("text-anchor", "middle")
                        .attr("x", function(d,i) { return x(i) + x.rangeBand() / 2 ; })
                        .attr("y", height / 2 + 15)
                        .text(function(d) {return format(d) })
                        .style("fill-opacity", 1);

                
                  var g = svg.selectAll(".symbol");
                
                  var t = g.transition()
                      .duration(duration);
                      
                    //got working with lots of help but this section particularly dedicated to http://stackoverflow.com/questions/10127402/bar-chart-with-negative-values
                  g.each(function(p, j) {
                    d3.select(this).selectAll("rect")
                        .data(function(d) { return d.values; })
                      .enter().append("rect")
                        .attr("x", function(d) { return x(d.date) + x1(p.key); })
                        .attr("y", function(d, i) { return y(Math.max(0, d.perf)); })                        
                        //.attr("y", function(d) { return y(d.perf); })
                        .attr("width", x1.rangeBand())
                        .attr("height", function(d, i) { return Math.abs(y(d.perf) - y(0)); })                        
                        //.attr("height", function(d) { return height - y(d.perf); })
                        .style("fill", color(p.key))
                        .style("fill-opacity", 1e-6)                    
                        //very grateful to http://blog.nextgenetics.net/demo/entry0032/ for help here on mouseover highlighting
                        //another nice example http://bl.ocks.org/2164562
                        .on('mouseover', function(d, i) {
                             d3.select(this).style('fill','gray');
                             statusText
                                .text(p.key + " " + d.perf)
                                .attr('fill',color(p.key))
                                .attr("text-anchor", d.perf < 0 ? "begin" : "begin")
                                .attr("x", x(d.date) + x1(p.key) + x.rangeBand() / 2 )
                                .attr("y", y(d.perf))
                                .attr("transform", d.perf < 0 ? "rotate(90 " + (x(d.date) + x1(p.key) + x.rangeBand() / 4 ) + "," +   y(d.perf) + ")" : "rotate(-90 " + (x(d.date) + x1(p.key) + x.rangeBand() / 4 ) + "," +   y(d.perf) + ")"); 
                          })
                          .on('mouseout', function(d,i) {
                             statusText
                                .text('');
                             d3.select(this).style('fill',color(p.key));
                          })
                          .transition()
                                .duration(duration)
                                .style("fill-opacity", 1);

                    
                  var statusText = svg.append('svg:text');
                      
                  });            
                        
                
                    svg.append("g")
                        .attr("class", "y axis")
                        .call(yAxis);
                    //    .attr("y1", 0)
                    //    .attr("y2", height);
                
            };
    }
  });
  Shiny.outputBindings.register(networkOutputBinding, 'timelyportfolio.networkbinding');
  
  </script>
