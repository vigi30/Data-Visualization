const dims = {diameter:940};
const cent = {x: (dims.diameter/2+50), y : (dims.diameter/2)};
const radius = dims.diameter / 2  -100;
const innerRadius = radius - 140;

// const innerRadius = 120
window.oncontextmenu = (e) => {
  e.preventDefault();

}

var  parent_root =[];

    // data grouping
var cluster = d3.cluster()
    .size([360, innerRadius])
    .separation(function(a, b) { return (a.parent == b.parent ? 1 : 1 ) })
    
    

    //  connected lines
var line = d3.radialLine()
    .curve(d3.curveBundle.beta(1))
    .radius(function(d) { return d.y; })
    .angle(function(d) { return d.x / 180 * Math.PI; });

var svg = d3.select('.canvas')
    .append('svg')
    
    .attr('width',dims.diameter+200)
    .attr('height',dims.diameter-200)
    .attr('class','svg')
    .append('g')
    .attr('transform',`translate(${cent.x-40},${cent.y-80})`);


    


var link = svg.append("g"); // for line variable
var node = svg.append("g");
var graph = svg.append("g"); // for data grouping varaiable
// console.log(node);
// color scale

//const colours=d3.scaleOrdinal(['red','green','blue','yellow','orange','brown','pink','gray','maroon','cyan']);


const colours=d3.scaleOrdinal(['#DB4437','#4285F4','#FF8800','#0F9D58','#B8009F','#FFD500']);

var parentDepth2=[];
var currentFileName;
const t = d3.transition().duration(7000);


const tip = d3.tip()
.attr('class','d3-tip ')
// .attr('width','10em')
.html(d=>{
    
    let content = `<div class='content'>${d.data.info.DisplayName.replace(/_/g, ' ')}</div>`;
    content += `<div class='content'>CC : ${d.data.info.CC}  </div>`
    content += `<div class ='moreInfo content' >Left Click to see more Info</div>`
    
 return content;
});
 
node.call(tip);

var legendGroup =svg.append('g')
.attr('transform',`translate(${innerRadius+300},-370)`)



var legend = d3.legendColor()
.shape('circle')
.scale(colours)
.shapePadding(5)



var paperCollection = new Object;

var files =['sample0.json','dample0.json'];
var index=0;

document.querySelector('.prev').addEventListener('click',(e)=>{
  
  if(index ===0){
    index=index;
  }
  else{
    index=index-1;
  }

  console.log('previndex',index);
  console.log('previndex',files[index]);
  svg.selectAll("*").remove();
  link = svg.append("g"); // for line variable
 node = svg.append("g");
graph = svg.append("g");

legendGroup =svg.append('g').attr('transform',`translate(${innerRadius+300},-385)`)
legend = d3.legendColor()
.shape('circle')
.scale(colours)
.shapePadding(5)

  fileCall(files[index]);
})

document.querySelector('.next').addEventListener('click',(e)=>{
  if(index > files.length-2)
  {
    alert('No More data!! .Please Go Back')
  }
  else
  {
      index =index +1
  }
  svg.selectAll("*").remove();
 
  console.log('nextindex',index);
  console.log('nextindex',files[index]);
 link = svg.append("g"); // for line variable
 node = svg.append("g");
 graph = svg.append("g");

 legendGroup =svg.append('g').attr('transform',`translate(${innerRadius+300},-385)`)
legend = d3.legendColor()
.shape('circle')
.scale(colours)
.shapePadding(5)

 fileCall(files[index]);
})


const fileCall= (fileName)=>{
                      
                      d3.json(fileName).then(( classes) => {
                        currentFileName=fileName

                      var root = packageHierarchy(classes)
                      // .sum(function(d) { return d.size; })
                      .sort((a, b)=> { 
                      
                        if((a.data.name.startsWith('MAG.papers') && b.data.name.startsWith('MAG.papers')) || (a.data.name.startsWith('MAG.authors') && b.data.name.startsWith('MAG.authors'))){
                       
                        return d3.descending(a.data.info.CC, b.data.info.CC);
                        }
                        else if((a.data.name.startsWith('MAG.keywords') && b.data.name.startsWith('MAG.keywords')) || (a.data.name.startsWith('MAG.conferences') && b.data.name.startsWith('MAG.conferences'))){
                          return d3.descending(a.data.info.CC, b.data.info.CC);
                        
                        }

                        else if((a.data.name.startsWith('MAG.affiliations') && b.data.name.startsWith('MAG.affiliations')) || (a.data.name.startsWith('MAG.journals') && b.data.name.startsWith('MAG.journals'))){
                          return d3.descending(a.data.info.CC, b.data.info.CC);
                        
                        }
                        })
                        
                      
                      cluster(root)
                      
                      // console.log(root);
                      // console.log('root leaves :',root.leaves());
                      data = root.leaves();
                      if(parent_root.length<2)
                      {
                      parent_root.push(data);
                      }
                      var paperCC=[];
                      var authorsCC =[];
                      var affiliations =[];
                      var journals = [];
                      var keywords =[];
                      var conferences =[];
                        
                     data.forEach(data=>{
                       if(data.data.name.startsWith('MAG.papers')){
                        paperCC.push(data.data.info.CC);
                      }
                      else if(data.data.name.startsWith('MAG.authors'))  {
                        authorsCC.push(data.data.info.CC)
                      }
                      else if(data.data.name.startsWith('MAG.affiliations'))  {
                        affiliations.push(data.data.info.CC)
                      }
                      else if(data.data.name.startsWith('MAG.conferences'))  {
                        journals.push(data.data.info.CC)
                      }
                      else if(data.data.name.startsWith('MAG.keywords'))  {
                        keywords.push(data.data.info.CC)
                      }
                      else if(data.data.name.startsWith('MAG.journals'))  {
                        conferences.push(data.data.info.CC)
                      }
                                            
                      });
                     
                      // console.log('cc count',paperCC.length+authorsCC.length+affiliations.length+journals.length+keywords.length+conferences.length);
                      
                      
                      // console.log('packageImports :',packageImports(root.leaves()));
                      var  paperScale = d3.scaleLinear()
                                          .domain(d3.extent(paperCC))
                                          .range([4.0,9.0])
                      var  authorsScale = d3.scaleLinear()
                                          .domain(d3.extent(authorsCC))
                                          .range([3.0,9.0])
                                          // .clamp(true)
                      var  affiliationScale = d3.scaleLinear()
                                          .domain(d3.extent(affiliations))
                                          .range([4.0,9.0])
                      var  confScale = d3.scaleLinear()
                                          .domain(d3.extent(conferences))
                                          .range([3.0,5.0])
                      var  keywordScale = d3.scaleLinear()
                                          .domain(d3.extent(keywords))
                                          .range([4.0,9.0])
                      var  journalsScale = d3.scaleLinear()
                                          .domain(d3.extent(journals))
                                          .range([4.0,9.0])     
                                          
                                          
                      parentDepth2=root.data.children[0].children.map(data=> data.name.substring(4));
                      colours.domain(parentDepth2)
                    
                      legendGroup.call(legend);

                      legendGroup.selectAll('circle').attr('r',5);
                      legendGroup.selectAll('text')
                      .attr('fill','black')
                      
                      link.selectAll(".link")
                          .exit().remove()
                   

                      link.selectAll(".link")
                          .data(packageImports(root.leaves()))
                          .enter().append("path")
                          .each(function(d) { d.source = d[0], d.target = d[d.length - 1]; })
                          .attr("class", "link")
                          .attr("d", line)
                          
                          
                          node.selectAll(".node").exit().remove() 

                      node.selectAll(".node")
                          .data(root.leaves())
                          .enter().append("text")
                          .attr("class", "node")
                          .attr("dy", "0.31em")                          
                          .attr('margin','20px')
                          .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + (d.y + 9) + ",0)" + (d.x < 180 ? "" : "rotate(180)"); })
                          .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
                          // .transition(t)
                          .text((d,i)=> { 
                            if(d.data.name.startsWith('MAG.papers')){
                              paperCollection[d.data.name] = `paper ${d.data.info.rank}`;
                              return `paper ${d.data.info.rank}`
                            }
                            return d.data.info.DisplayName.replace(/_/g, ' '); })
                          .attr('fill',d=> findParent(d))
                          .on('mouseover',(d,i,n)=>{                                          
                                          if(d.x >=1 && d.x <=40 )
                                          {   
                                            tip.direction('e')
                                            .offset([-30, 20])
                                            .html(d=>{
    
                                              let content1 = `<div class='content'>${d.data.info.DisplayName.replace(/_/g, ' ')}</div>`;
                                              content1 += `<div class='content'>CC : ${d.data.info.CC}  </div>`
                                              content1 += `<div class ='moreInfo content' >Left Click to see more Info</div>`
                                              content1 += `<div class ='moreInfo content' >Right Click to Select</div>`
                                            return content1;
                                          })

                                          }
                                          else if(d.x >=41 && d.x <=184 )
                                          {   
                                            tip.direction('e')
                                            .offset([1, 60])
                                            .html(d=>{
    
                                              let content1 = `<div class='content'>${d.data.info.DisplayName.replace(/_/g, ' ')}</div>`;
                                              content1 += `<div class='content'>CC : ${d.data.info.CC}  </div>`
                                              content1 += `<div class ='moreInfo content' >Left Click to see more Info</div>`
                                              
                                            return content1;
                                          })
                                        }
                                          else if(d.x >=185 && d.x <=360 )
                                          {   
                                            tip.direction('w')
                                            .offset([2, -20])
                                          }
                                          tip.show(d,n[i]);
                                          handleMouseOver(d,i,n);                                   
                            })
                          .on('mouseout',(d,i,n)=>{
                                        tip.hide();
                                        handleMouseOut(d,i,n);
        
                             })
                             .on('click',(d,i,n)=>{
                              d3.select('.info1')
                              .style('display','block')
                              .text("")
                             
                              handleMouseClick(d,i,n); 

                              })
                              .on('mousedown',(d,i,n)=>{
                                if(event.button===2){
                                 
                                  
                                   handleRightClick(d,i,n);
                                  
                                }
                                
                              });

                    
                      graph.selectAll('.circle')
                          .data(root.leaves())
                          .enter()
                          .append('circle')
                          .style('position','relative')
                          .attr('class','circle')
                          .attr('cx',d=>(d.y*Math.sin(d.x/ 180 * Math.PI)))
                          .attr('cy',d=>(d.y*Math.cos(d.x / 180 * Math.PI)))
                          .attr('r',(data)=>{
                            if(data.data.name.startsWith('MAG.papers'))  {
                              return paperScale(data.data.info.CC)
                            }
                            else if(data.data.name.startsWith('MAG.authors'))  {
                              return authorsScale(data.data.info.CC)
                            }
                            else if(data.data.name.startsWith('MAG.affiliations'))  {
                              return affiliationScale(data.data.info.CC)
                            }
                            else if(data.data.name.startsWith('MAG.conferences'))  {
                              return confScale(data.data.info.CC)
                            }
                            else if(data.data.name.startsWith('MAG.keywords'))  {
                              return keywordScale(data.data.info.CC)
                            }
                            else if(data.data.name.startsWith('MAG.journals'))  {
                              return journalsScale(data.data.info.CC)
                            }
                           
                          
                          })
                          .style("transform",`scaleY(-1)`)
                          .attr('stroke-width',1)
                          .attr('fill',(d)=>findParent(d))
});
};
fileCall(files[index])

function colorNode(name){
  //iterate through all teh dom and get teh DOM which has the data
  var colornode = d3.selectAll(".node").filter((d)=>{
    
    return d3.select(d)._groups[0][0].data.name === name

  });
   colornodeg= colornode._groups[0]

  d3.selectAll(colornodeg).attr("fill", d=>findParent(d))
  .style('font-size','10px')
  .style('font-weight','bold')
  .style('opacity',1);
 
}



function colorCircle(name){
  //iterate through all teh dom and get teh DOM which has the data
  var colorcircle = d3.selectAll(".circle").filter((d)=>{
    
    return d3.select(d)._groups[0][0].data.name === name 

  });

  
   colorcircleg= colorcircle._groups[0]
  

  d3.selectAll(colorcircleg).attr("fill", d=>findParent(d))
  .style('opacity',1);

 
}






function colorLink(src,tgt){
            
          var targetDataColor;
          var targetParentColor;
          var link = d3.selectAll(".link").filter((d)=>{
          var flag=false ;

          if  (d3.select(d)._groups[0][0].source.data.name===src && d3.select(d)._groups[0][0].target.data.name===tgt){
            flag=true;
            targetDataColor= d3.select(d)._groups[0][0].target;
          }

          else if (d3.select(d)._groups[0][0].source.data.name===tgt && d3.select(d)._groups[0][0].target.data.name===src){
            flag=true;
            targetDataColor=d3.select(d)._groups[0][0].source;
          }

          return flag;
          })

          // d3.selectAll('.link').style('opacity',0.1)


          targetParentColor=findParent(targetDataColor)
          var linkd = link._groups[0];
          d3.selectAll(linkd).style("stroke",targetParentColor)
                              .style('stroke-width','1.5px')
                              .style('stroke-opacity',1)
}


 function findParent(data)
 {
            // console.log("data: ",data.depth);
            if(data.depth===2)
            {
              //  console.log('Parent name',data.data)
              return colours(data.data.name);
            }
            else if(data.depth>2){
              return findParent(data.parent);
          }
 }


// Lazily construct the package hierarchy from class names.
function packageHierarchy(classes) {
  var map = {};
  function find(name, data) {
    var node = map[name], i;
    if (!node) {
      node = map[name] = data || {name: name, children: []};
      if (name.length) {
        node.parent = find(name.substring(0, i = name.lastIndexOf(".")));
        node.parent.children.push(node);
        node.key = name.substring(i + 1);
      }
    }
    return node;
  }
  classes.forEach(function(d) {
    find(d.name, d);
  });
  return d3.hierarchy(map[""]);
}
// Return a list of imports for the given array of nodes.
function packageImports(nodes) {
  var map = {},
      imports = [];
  // Compute a map from name to node.
  nodes.forEach(function(d) {
    map[d.data.name] = d;
  });
  // For each import, construct a link from the source to target node.
  nodes.forEach(function(d) {
    if (d.data.imports) d.data.imports.forEach(function(i) {
      imports.push(map[d.data.name].path(map[i]));
    });
  });
  return imports;
}


// Event Handlers



const handleMouseOver = (d,i,n)=>{
  // console.log('hovered data',d);
  d3.selectAll('.node')
  .style('opacity',0)

  d3.selectAll('.circle')
  .style('opacity',0.3)


 
d3.select(n[i]).attr('fill','black')
.style('font-size','10px')
.style('font-weight','bold')
.style('opacity',1)

d3.selectAll('.link').style('stroke-opacity',0)
var name=d.data.name
var node = d3.selectAll(".node").data().filter((d1)=> {
        // console.log('inside nodes:',name);
        return d1.data.imports.includes(name);
})
nodes = node.map(function(node){return node.data.name;}).concat(d.data.imports)
nodeC= node.map(function(node){return node.data.name;}).concat(d.data.imports)
nodeC.push(d.data.name)
nodes.forEach((d1,i,n)=>{
        
        colorLink(d.data.name,d1)
        
}) 


nodeC.forEach((d1)=>{
  colorNode(d1)
  colorCircle(d1)
}) 
}



const handleMouseOut = (d,i,n)=>{
  d3.selectAll('.node')
  .attr('fill',d=> findParent(d))
  .style('font-size','9px')
  .style('font-weight','normal')
  .style('opacity',1)

d3.selectAll('.link')
  .style('stroke','rgb(163, 159, 159)')
  .style('stroke-opacity',0.2)
  .style('fill','none')
  .style('stroke-width','1px')



d3.selectAll('.circle')
  .attr("fill",d=>findParent(d))
  .style('opacity',1);
}

const handleMouseClick =(d,i,n)=>{
      
    importNodes =d.data.imports
    console.log("on click imports",importNodes)

    var paperRank;

                                        
    if(d.data.name.startsWith('MAG.affiliations'))  {
      d3.select('.info1')
      .style('display','block')
      .insert("p")
      .text("Affiliation:"+d.data.info.DisplayName.replace(/_/g, ' '))
      

        importNodes.forEach((d1,i,n)=>{
          var paperImports;
          var commonValues;
          var authorsFetch=[];
          var authorNames="";
        
        fetchedNode=d3.selectAll('.node').data().filter((el)=> {
          // console.log('inside nodes:',name);
              var flag=false;
              if(d3.select(el)._groups[0][0].data.name === d1 && d3.select(el)._groups[0][0].data.name.startsWith('MAG.papers'))
              {
                  flag=true;
              }
              else{
                flag=false;
              }
              // console.log('flag',flag ,el.data)
              return flag;
        })
          if(fetchedNode.length>0){
          
        
            console.log("fetcheNode Papers",fetchedNode[0].data.imports);
            paperImports=fetchedNode[0].data.imports;
            commonValues= importNodes.filter((el)=>{
              return paperImports.indexOf(el)>-1;
            });
            console.log('commonValues',fetchedNode[0].data.info.DisplayName.replace(/_/g, ' '),commonValues);
              commonValues.forEach((e1)=>{

              authorsFetch.push(d3.selectAll('.node').data().filter((el)=> {

                    var flag=false;
                    if(d3.select(el)._groups[0][0].data.name === e1)
                    {
                        flag=true;
                    }
                    else{
                      flag=false;
                    }
                    // console.log('flag',flag ,el.data)
                    return flag;
              }))

            })
            console.log("authors Fetch",authorsFetch);
            authorsFetch.forEach((e,i)=>{
              authorNames=authorNames+e[0].data.info.DisplayName.replace(/_/g, ' ')
              if(i<authorsFetch.length-1)
              {
                authorNames+=" , "
              }
            })
            console.log("authorNames",authorNames);
            paperName=fetchedNode[0].data.info.DisplayName.replace(/_/g, ' ')
            paperRank=fetchedNode[0].data.info.rank
            console.log("paperName",fetchedNode[0].data.info.DisplayName.replace(/_/g, ' '))
                d3.select('.info1')
              .insert("p")
              //.text("Paper:")
              .text("Paper "+paperRank+" : "+paperName)  ;

              d3.select('.info1')
              .insert("p")
              .text("Author Info:"+authorNames)
              
            //console.log("authors Fetch",authorsFetch[0][0].data.info.DisplayName.replace(/_/g, ' '));
          }
          
        })
        }

        
        else if(d.data.name.startsWith('MAG.paper'))  {
          d3.select('.info1')
          .style('display','block')
          .insert("p")
          .text("Paper "+d.data.info.rank+" : "+d.data.info.DisplayName.replace(/_/g, ' '))

          d3.select('.info1')
          .style('display','block')
          .insert("p")
          .text("Year: "+d.data.info.year)

            var fetchedNode=[];
            var authorsNodes=[];
            var keywordsNodes=[];
            var affiliationNodes=[];
            var publicationNodes=[];
            var names="";
            
            importNodes.forEach((d1,i,n)=>{
      
              fetchedNode.push(d3.selectAll('.node').data().filter((el)=> {
                // console.log('inside nodes:',name);
                    var flag=false;
                if(d3.select(el)._groups[0][0].data.name === d1)
                  {
                      flag=true;
                  }
                  else{
                    flag=false;
                  }
                  // console.log('flag',flag ,el.data)
                  return flag;
            }))
            
          })
          console.log("fetchedNode papers",fetchedNode);
          authorsNodes=fetchedNode.filter((el)=>{
            return el[0].data.name.startsWith('MAG.authors');
          })
          authorsNodes.forEach((e,i)=>{
            names=names+e[0].data.info.DisplayName.replace(/_/g, ' ')
            if(i<authorsNodes.length-1)
            {
              names+=" , "
            }
          })
          d3.select('.info1')
          .style('display','block')
          .insert("p")
          .text("Authors: "+names)

          affiliationNodes=fetchedNode.filter((el)=>{
            return el[0].data.name.startsWith('MAG.affiliations');
          })
          names="";
          affiliationNodes.forEach((e,i)=>{
            names=names+e[0].data.info.DisplayName.replace(/_/g, ' ')
            if(i<affiliationNodes.length-1)
            {
              names+=" , "
            }
          })
          d3.select('.info1')
          .style('display','block')
          .insert("p")
          .text("Affiliations: "+names)

          keywordsNodes=fetchedNode.filter((el)=>{
            return el[0].data.name.startsWith('MAG.keywords');
          })
          names="";
          keywordsNodes.forEach((e,i)=>{
            names=names+e[0].data.info.DisplayName.replace(/_/g, ' ')
            if(i<keywordsNodes.length-1)
            {
              names+=" , "
            }
          })
          if (keywordsNodes.length >0){
          d3.select('.info1')
          .style('display','block')
          .insert("p")
          .text("keywords: "+names)
        }
        else{
          d3.select('.info1')
          .style('display','block')
          .insert("p")
          .text("keywords: N/A")
        }
          
          publicationNodes=fetchedNode.filter((el)=>{
            return el[0].data.name.startsWith('MAG.conferences') ||el[0].data.name.startsWith('MAG.journals');
          })
          names="";
          publicationNodes.forEach((e,i)=>{
            names=names+e[0].data.info.DisplayName+" ("+e[0].data.info.fullName.replace(/_/g, ' ')+")"
          })
          d3.select('.info1')
          .style('display','block')
          .insert("p")
          .text("Publication : "+names)
        }
        
    else if(d.data.name.startsWith('MAG.conferences')||d.data.name.startsWith('MAG.journals')||d.data.name.startsWith('MAG.keywords')) 
          {
            if(d.data.name.startsWith('MAG.conferences'))
            {
              d3.select('.info1')
              .style('display','block')
              .insert("p")
              .text("Conference :\n"+d.data.info.DisplayName.replace(/_/g, ' ')+" ("+d.data.info.fullName.replace(/_/g, ' ')+")")

            }
            else if(d.data.name.startsWith('MAG.journals'))
            {
              d3.select('.info1')
              .style('display','block')
              .insert("p")
              .text("Journal :\n"+d.data.info.DisplayName.replace(/_/g, ' ')+" ("+d.data.info.fullName.replace(/_/g, ' ')+")")

            }
            else if (d.data.name.startsWith('MAG.keywords')) 
            {
              d3.select('.info1')
              .style('display','block')
              .insert("p")
              .text("Sub-field of Study(keywords) :\n"+d.data.info.DisplayName.replace(/_/g, ' ')+" ("+d.data.info.fullName.replace(/_/g, ' ')+")")
            }

            var names="";
            var fetchedNode=[];
            
            importNodes.forEach((d1,i,n)=>{
              
              fetchedNode.push(d3.selectAll('.node').data().filter((el)=> {
                // console.log('inside nodes:',name);
                    var flag=false;
                    if(d3.select(el)._groups[0][0].data.name === d1 && d3.select(el)._groups[0][0].data.name.startsWith('MAG.papers'))
                    {
                        flag=true;
                    }
                    else{
                      flag=false;
                    }
                    // console.log('flag',flag ,el.data)
                    return flag;
              }))

            })
            d3.select('.info1')
              .style('display','block')
              .insert("p")
              .text("Papers Info: ")

            fetchedNode.forEach((e,i)=>{
              names="";
              names="Paper "+e[0].data.info.rank+" : "+e[0].data.info.DisplayName.replace(/_/g, ' ')
              d3.select('.info1')
              .style('display','block')
              .insert("p")
              .text(names)
            })
            
          }

        else if(d.data.name.startsWith('MAG.authors'))  {
            var authorName=d.data.info.DisplayName.replace(/_/g, ' ');
            d3.select('.info1')
            .style('display','block')
            .insert("p")
            .text("Author Name:\n"+authorName)
            
            var fetchedNode=[];
            
            importNodes.forEach((d1,i,n)=>{
              
              fetchedNode.push(d3.selectAll('.node').data().filter((el)=> {
                // console.log('inside nodes:',name);
                    var flag=false;
                    if(d3.select(el)._groups[0][0].data.name === d1)
                    {
                        flag=true;
                    }
                    else{
                      flag=false;
                    }
                    // console.log('flag',flag ,el.data)
                    return flag;
              }))

            })
            

            var paperNodes=fetchedNode.filter((el)=>{
              if (el[0].data.name.startsWith('MAG.papers'))
              {
                return true;
              }
              else
              return false;
            })
            
            var AffiliationNode=fetchedNode.filter((el)=>{
              if (el[0].data.name.startsWith('MAG.affiliations'))
              {
                return true;
              }
              else
              return false;
            })
            d3.select('.info1')
              .style('display','block')
              .insert("p")
              .text("Affiliated To: "+AffiliationNode[0][0].data.info.DisplayName.replace(/_/g, ' ')) 

            //console.log("affiliation Nodes:", AffiliationNode[0][0].data.info.DisplayName.replace(/_/g, ' '));
            paperNodes.forEach((e,i)=>{
              d3.select('.info1')
              .style('display','block')
              .insert("p")
              .text("Paper "+e[0].data.info.rank+" : "+e[0].data.info.DisplayName.replace(/_/g, ' '))

              // Fetch the author names present in the paper i.e. Co-Authors of that paper.

          var paperImports= e[0].data.imports;
          fetchedNode=[];
          console.log("Paper Imports",paperImports)
            paperImports.forEach((d1,i,n)=>{

              
              if(d1.startsWith('MAG.authors')==true){

              fetchedNode.push(d3.selectAll('.node').data().filter((el)=> {
                // console.log('inside nodes:',name);
                    var flag=false;
                    if(d3.select(el)._groups[0][0].data.name === d1)
                    {
                        flag=true;
                    }
                    else{
                      flag=false;
                    }
                    // console.log('flag',flag ,el.data)
                    return flag;
              }))

            }                    

          })
              console.log("Authors from papers"+i,fetchedNode);

            d3.select('.info1')
              .style('display','block')
              .insert("p")
              .text("Co- Authors List: \n ")
            
            var names="";
            

            fetchedNode.forEach((e,i)=>{

              if(authorName!==e[0].data.info.DisplayName.replace(/_/g, ' '))
              {
              names=names+e[0].data.info.DisplayName.replace(/_/g, ' ');
              if(i<fetchedNode.length-1)
              {
                  names+=" , "
              }
            }
            }) 
            d3.select('.info1')
              .style('display','block')
              .insert("p")
              .text(names) 
        
              
              })

            } 
          }
          


var paperAddInfo =[];
var paperAddInfo1=[];
var check=[];
var i =1;
const handleRightClick = (data,index,el)=>{
  // console.log(i);
  if(i===1){
    // console.log(i);
   
    d3.select('.paperAdd').insert('p').text('Left Click to See more Info & Right Click to delete').style('font-size','13px').style('font-weight','bold')
    i=i+1;
  }
  if(data.data.name.startsWith('MAG.paper')){

  
  // console.log('data',data);
  paperAddInfo1.push(data)
  
  paperAddInfo1= new Set(paperAddInfo1)
  paperAddInfo1= [...paperAddInfo1]
  // Array.from(new Set(paperAddInfo))
  // console.log('Before Removing',paperAddInfo1); 
  
  var paperAdd = d3.select('.paperAdd').append('g');
 
  paperAdd.selectAll('text')
        .data(paperAddInfo1)
        .enter()
        
        .append('text')
        .attr('class',d=>`text${d.data.info.rank}`)
        .classed('papersave','true')
        .text((d,i)=>{
          // console.log('d',d);
            if(check.includes(d.data.info.rank)){
              
              return ""
              
            }
            else{
              // console.log('true');
              
              check.push(d.data.info.rank)
             /*  window.setInterval(function() {
                var elem = document.querySelector('.paperAdd');
                elem.scrollTop = elem.scrollHeight;
              }, 5000); */
              scrollToBottom('.paperAdd')
              return `paper ${d.data.info.rank}`
            }
         
            
          })

          
          
  
          .on('click',(d,i,n)=>{
            d3.select('.info1')
            .style('display','block')
            .text("")
            showPaperInfo(d,i,n); 
      
      })  

      .on('mousedown',(d,i,n)=>{
        
        if(event.button===2){
          
          paperAdd.remove(`#text${d.data.info.rank}`)

          check=check.filter(el=>{
            let flag=false;
            if(el=== d.data.info.rank){
              flag=false;
            }
            else{
              flag=true;
            }
            // console.log(flag);
            return flag;

          })
         
          paperAddInfo1= paperAddInfo1.filter(el=>{
            // console.log('el',d.data.name);
            let flag=false;
            if(el.data.name === d.data.name){
              flag=false;
            }
            else{
              flag=true;
            }
            // console.log(flag);
            return flag;
          })
          
        //  console.log('after Removing',paperAddInfo1); 
        d3.select('.info1').selectAll("*").remove();
          
      
      }
        
      });
    }
        
        }

function scrollToBottom(className){
          var div = document.querySelector(className);
          div.scrollTop = (div.scrollHeight - div.clientHeight);
          // console.log(div.scrollTop);
          div.scrollTop=div.scrollTop+2;

       }
const showPaperInfo=(d,i,n)=>{

    importNodes =d.data.imports;


    d3.select('.info1')
    .style('display','block')
    .insert("p")
    .text("Paper "+d.data.info.rank+" : "+d.data.info.DisplayName.replace(/_/g, ' '))

    d3.select('.info1')
    .style('display','block')
    .insert("p")
    .text("Year: "+d.data.info.year)

      var fetchedNode=[];
      var authorsNodes=[];
      var keywordsNodes=[];
      var affiliationNodes=[];
      var publicationNodes=[];
      var names="";
      var total =[];
      if(parent_root.length===1){
        total = parent_root[0]
      }
      else{
        parent_root[0].forEach((d,i,n)=>{
          total.push(d)
        })
        parent_root[1].forEach((d,i,n)=>{
          total.push(d)
        })

      }
      
      total = Array.from(new Set(total))
      importNodes.forEach((d1,i,n)=>{

       console.log('parent_root',total)
       console.log('object');
            parent_filter=[];
                   
            total.forEach((el)=> {
              // console.log('inside nodes:',name);
                  //var flag=false;
                  if(el.data.name === d1)
                  {
                    fetchedNode.push(el)
                  }
                 
            })
      
    })
    console.log("fetchedNode papers",fetchedNode);
    authorsNodes=fetchedNode.filter((el)=>{
      console.log("el",el);
      if (el.data.name.startsWith('MAG.authors') && el.data.imports.includes(d.data.name))
      {
        return el.data.name.startsWith('MAG.authors');
      }
      
    })

    authorsNodes = Array.from(new Set(authorsNodes))
    if (authorsNodes.length>0){
    authorsNodes.forEach((e,i)=>{
      names=names+e.data.info.DisplayName.replace(/_/g, ' ')
      if(i<authorsNodes.length-1)
      {
        names+=" , "
      }
    })
    d3.select('.info1')
    .style('display','block')
    .insert("p")
    .text("Authors: "+names)
  }
   

    affiliationNodes=fetchedNode.filter((el)=>{
      return el.data.name.startsWith('MAG.affiliations')&& el.data.imports.includes(d.data.name);
    })

    affiliationNodes = Array.from(new Set(affiliationNodes))
    names="";
    affiliationNodes.forEach((e,i)=>{
      names=names+e.data.info.DisplayName.replace(/_/g, ' ')
      if(i<affiliationNodes.length-1)
      {
        names+=" , "
      }
    })
    d3.select('.info1')
    .style('display','block')
    .insert("p")
    .text("Affiliations: "+names)

    keywordsNodes=fetchedNode.filter((el)=>{
      return el.data.name.startsWith('MAG.keywords') && el.data.imports.includes(d.data.name);
    })
    keywordsNodes = Array.from(new Set(keywordsNodes))
    names="";
    keywordsNodes.forEach((e,i)=>{
      names=names+e.data.info.DisplayName.replace(/_/g, ' ')
      if(i<keywordsNodes.length-1)
      {
        names+=" , "
      }
    })
    if (keywordsNodes.length >0){
      d3.select('.info1')
      .style('display','block')
      .insert("p")
      .text("keywords: "+names)
    }
    else{
      d3.select('.info1')
      .style('display','block')
      .insert("p")
      .text("keywords: N/A")
    }
    
    publicationNodes=fetchedNode.filter((el)=>{
      return (el.data.name.startsWith('MAG.conferences') ||el.data.name.startsWith('MAG.journals')) &&  el.data.imports.includes(d.data.name);
    })
    publicationNodes = Array.from(new Set(publicationNodes))
    console.log(publicationNodes);
    names="";
    publicationNodes.forEach((e,i)=>{
      names=names+e.data.info.DisplayName+" ("+e.data.info.fullName.replace(/_/g, ' ')+")"
    })

   
    d3.select('.info1')
    .style('display','block')
    .insert("p")
    .text("Publication : "+names)

  }

 
