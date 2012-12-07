#thanks to https://www.trestletechnology.net/2012/12/reconstruct-gene-networks/
#for doing what I have been wondering how to do and had no clue how to accomplish
#hopefully whoever reads this will attribute all the good code to him
#and all the bad code/changes to me

reactiveBar <- function (outputId) 
{
  HTML(paste("<div id=\"", outputId, "\" class=\"shiny-network-output\"><svg /></div>", sep=""))
}



shinyUI(pageWithSidebar(    
  headerPanel(HTML("Performance Comparison with shiny and d3.js thanks to  <a href = \"https://www.trestletechnology.net/2012/12/reconstruct-gene-networks\">Trestle Technology</a>")),
  
  sidebarPanel(
    #selectInput(inputId = "dataSource",
    #            label = "Source of the performance data:",
    #            choices = c("Local", "Remote"),
    #            selected = "Remote"),
    
    checkboxInput(inputId= "dataSource", label="Use a file stored on my local machine.", value=FALSE),
    
    conditionalPanel(
      condition = "input.dataSource == false",
      textInput(inputId="url", label="File URL:", value="./testperf.csv"),
      helpText(HTML("<div style=\"text-indent: 25px\">Download the sample dataset <a href=\"testperf.csv\">here</a></div>"))
    ),
    
    conditionalPanel(
      condition = "input.dataSource == true",            
      fileInput(inputId = "file", label="Performance to plot:"),
      helpText(HTML("<div style=\"color: red; font-weight: bold\">Warning:</div> Local file uploads in 
                    Shiny are <strong>very</strong> experimental. I have had success using this
                    feature from the latest version of Firefox but, at the time of writing, it
                    does not seem to be working from Chrome or IE.
                    <p>If you have trouble using this feature but want to analyze your own 
                    dataset, you can upload the file to a public URL using a tool like 
                    <a href=\"http://dropbox.com\">Dropbox</a> or one of the many free upload
                    sites."))
    ),
      
    HTML("<hr />"),
    helpText(HTML("All source available on <a href = \"https://github.com/timelyportfolio/d3-shiny-plot\">Github</a>"))
  ),
  
  
  mainPanel(    
    includeHTML("graph.js"),
    reactiveBar(outputId = "perfbarplot")    
  )
  
  

))
