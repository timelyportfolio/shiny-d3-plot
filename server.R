#thanks to https://www.trestletechnology.net/2012/12/reconstruct-gene-networks/
#for doing what I have been wondering how to do and had no clue how to accomplish
#hopefully whoever reads this will attribute all the good code to him
#and all the bad code/changes to me


#enter any requires/library here
#once I get more advanced, I will very likely add
#require(quantmod)
#require(PerformanceAnalytics)

shinyServer(function(input, output) {

  #just as in the reference example, I'll start by loading a csv file
  #the hope in the future is to add Axys data or retrieve through getSymbols lots of data
  data <- reactive(function(){
        
    if (input$dataSource == FALSE){      
      path <- input$url
      
      #translate relative paths to server-friendly paths
      if (substr(input$url, 0, 2) == "./"){
        path <- paste("./www/", substring(input$url, 3), sep="")
      }      
    } else{      
      df <- input$file
      path <- df$datapath  
    }
            
    data <- read.csv(path, row.names=1)
    
    data.df <- cbind(rownames(data), data)
    colnames(data.df)[1] <- "Date"
    
    data.df
  })
  
  output$perfbarplot <- reactive(function() { data() })  #when data changes, update the bar plot

})
