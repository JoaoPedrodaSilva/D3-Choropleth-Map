let countyData
let educationalData
let colorScale
const canvas = d3.select('#canvas')
const colors = ['#a1d0c1', '#8ac5b1', '#72b9a2', '#5bad92', '#43a283', '#2c9673', '#158b64', '#127d5a', '#106f50', '#0e6146', '#0c533c']
const tooltip = document.querySelector('#tooltip')

const generateCanvas = () => {
  const w = 950
  const h = 700
  canvas.attr('width', w)
        .attr('height', h)     
}

const generateColorScale = () => {
  colorScale = d3.scaleLinear()
                 .domain([d3.min(educationalData, d => d.bachelorsOrHigher),
                          d3.max(educationalData, d => d.bachelorsOrHigher)])
                 .range([0, colors.length])
}

const generatePathes = () => {
  canvas.selectAll('path')
        .data(countyData)
        .enter()
        .append('path')
        .attr('class', 'county')
        .attr('d', d3.geoPath())  
        .attr('fill', countyObject => {
          // The following filter returns an array containing only the educational object that matches the county object          
          const matchEducationalObject = educationalData.filter(educationalObject => educationalObject.fips === countyObject.id)
          return colors[Math.floor((colorScale(matchEducationalObject[0].bachelorsOrHigher)))]
        })
        .attr('data-fips', countyObject => {
          // The following filter returns an array containing only the educational object that matches the county object 
          const matchEducationalObject = educationalData.filter(educationalObject => educationalObject.fips === countyObject.id)
          return matchEducationalObject[0].fips
        })
        .attr('data-education', countyObject => {
          // The following filter returns an array containing only the educational object that matches the county object 
          const matchEducationalObject = educationalData.filter(educationalObject => educationalObject.fips === countyObject.id)
          return matchEducationalObject[0].bachelorsOrHigher
        })
        .on('mouseover', (e, countyObject) => {
          // The following filter returns an array containing only the educational object that matches the county object 
          const matchEducationalObject = educationalData.filter(educationalObject => educationalObject.fips === countyObject.id)
          tooltip.classList.add('visible')
          tooltip.setAttribute('data-education', matchEducationalObject[0].bachelorsOrHigher)
          tooltip.innerHTML = (`${matchEducationalObject[0].area_name},
                                ${matchEducationalObject[0].state}: 
                                ${matchEducationalObject[0].bachelorsOrHigher}%`)
          tooltip.style.left = e.pageX + 10 + 'px'
          tooltip.style.top = e.pageY - 28 + 'px'
        })
        .on('mouseout', () => tooltip.classList.remove('visible'))
}

const generateLegend = () => {
  const legendWidth = 200
  const legendHeight = 85
  const legendPadding = 30
  const legendRectWidth = legendWidth / colors.length
  
  const legendXScale = d3.scaleLinear()
                         .domain([d3.min(educationalData, d => d.bachelorsOrHigher / 100),
                                  d3.max(educationalData, d => d.bachelorsOrHigher / 100)])
                         .range([0, legendWidth])
  
  const legendXAxis = d3.axisBottom(legendXScale)
                        .tickFormat(d3.format('.0%'))
                      d3.select('#legend')
                        .append('g')
                        .attr('transform', 'translate(0,' + (legendHeight - legendPadding) + ')')
                        .call(legendXAxis)
  
  d3.select('#legend')
    .attr('width', legendWidth)
    .attr('height', legendHeight)
    .selectAll('rect')
    .data(colors)
    .enter()
    .append('rect')
    .attr('width', legendRectWidth)
    .attr('height', legendHeight - 2 * legendPadding)
    .attr('x', (_, i) => i * legendRectWidth)
    .attr('y', legendPadding)
    .attr('fill', c => c)
}

d3.json('https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json').then(
  (data, error) => {
    if (error) {console.log(error)}
    else {
      countyData = topojson.feature(data, data.objects.counties).features
      
      d3.json('https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json').then(
        (data, error) => {
          if (error) {console.log(error)}
          else {educationalData = data}
          generateCanvas()
          generateColorScale()
          generatePathes()
          generateLegend()          
})}})

