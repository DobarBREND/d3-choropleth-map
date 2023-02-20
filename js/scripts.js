let urlEducationData = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
let urlCountyData = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";

let dataCounty
let dataEducation

let canvas = d3.select("#canvas");
let tooltip = d3.select("#tooltip")

let createMap = () => {

    canvas.selectAll("path")
            .data(dataCounty)
            .enter()
            .append("path")
            .attr("d", d3.geoPath())
            .attr("class", "county")
            .attr("fill",  (countyDataGeojson) => {
                let gjId = countyDataGeojson["id"]
                let gjCounty = dataEducation.find((i) => {
                    return i["fips"] === gjId //fips code should be equal to geojson id of county
                })
                let gjPercentage = gjCounty["bachelorsOrHigher"]
                if(gjPercentage < 3) {
                    return "Black"
                } else if(gjPercentage <= 12) {
                    return "Red"
                } else if(gjPercentage <= 21) {
                    return "DarkOrange"
                } else if(gjPercentage <= 30) {
                    return "Yellow"
                } else if(gjPercentage <= 39) {
                    return "GreenYellow"
                } else if(gjPercentage <= 48) {
                    return "LightGreen"  
                } else if(gjPercentage <= 57) {
                    return "LimeGreen"
                } else if(gjPercentage <= 68) {
                    return "SeaGreen"
                } else {
                    return "Magenta"
                }
            })
            .attr("data-fips", (countyDataGeojson) => {
                return countyDataGeojson["id"]
            })
            .attr("data-education", (countyDataGeojson) => {
                let gjId = countyDataGeojson["id"]
                let gjCounty = dataEducation.find((i) => {
                    return i["fips"] === gjId 
                })
                let gjPercentage = gjCounty["bachelorsOrHigher"]
                 return gjPercentage
            })
            .on("mouseover", (event, countyDataGeojson) => {
                tooltip.transition()
                        .style("visibility", "visible")
                        .style("top", (event.pageY)+"px")
                        .style("left",(event.pageX)+"px")

                let gjId = countyDataGeojson["id"]
                let gjCounty = dataEducation.find((i) => {
                    return i["fips"] === gjId 
                })
                
                    
                tooltip.text(gjCounty["fips"] + " - " + gjCounty["area_name"] + ", " + gjCounty["state"] + " - " + gjCounty["bachelorsOrHigher"] + "%")
                        .attr("fill", "SeaGreen")        
                        
                

                tooltip.attr("data-education", gjCounty["bachelorsOrHigher"])

            })
            .on("mouseout", (event, countyDataGeojson) => {
                tooltip.transition()
                        .style("visibility", "hidden")
            })
            .append("title")
            .text((d, i) => {
                return "The county FIPS code is " + dataCounty[i].id
            })      
                    
};

d3.json(urlCountyData).then( 
    (data, error) => {
        if(error) {
            console.log(log)
        } else {
            dataCounty = topojson.feature(data, data.objects.counties).features

            console.log(dataCounty)

            d3.json(urlEducationData).then(
                (data, error) => {
                    if(error) {
                        console.log(error)
                    } else {
                        dataEducation = data
                        console.log(dataEducation)
                        createMap()
                    }
                }
            )
        }
    }
)