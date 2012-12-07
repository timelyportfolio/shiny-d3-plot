shiny-d3-plot
=============

experiments with d3 and r integration with shiny

Using the fine example offered by https://github.com/trestletech and http://www.trestletechnology.net/2012/12/reconstruct-gene-networks/, build a d3 bar plot of annual performance data for the S&P 500 and the Barclays US Aggregate Bond Index.  Start with a local .csv file similar to the original example but eventually add on the ability to use live data from the web or from Axys.

I do not have the ability to host on http://glimmer.rstudio.com for a web example.  Until I get that, you can download the files, and then in R:

  require(shiny)

  runApp("C:\\path-to-download-location\\shiny-d3-plot")

Unfortunately, my javascript and d3 abilities are weak, so hopefully those knowledgeable in those areas can build something way better than this simple example.