
/**
 * Operations
 */

var g;

// Canvas Variables
var canvas;
var ctx;

var runBfs = function(start, end, speed) {
  var s, e;
  for(var i = 0; i < g.nodes.length; i++) {
    if(g.nodes[i].title.localeCompare(start) === 0) {
      s = i;
    } else if(g.nodes[i].title.localeCompare(end) === 0) {
      e = i;
    }
  }
  bfs(g,g.nodes[s],g.nodes[e],speed);
}

var runDfs = function(start, end, speed) {
  var s, e;
  for(var i = 0; i < g.nodes.length; i++) {
    if(g.nodes[i].title.localeCompare(start) === 0) {
      s = i;
    } else if(g.nodes[i].title.localeCompare(end) === 0) {
      e = i;
    }
  }
  dfs(g,g.nodes[s],g.nodes[e],speed);
}

var runUcs = function(start, end, speed) {
  var s, e;
  for(var i = 0; i < g.nodes.length; i++) {
    if(g.nodes[i].title.localeCompare(start) === 0) {
      s = i;
    } else if(g.nodes[i].title.localeCompare(end) === 0) {
      e = i;
    }
  }
  ucs(g,g.nodes[s],g.nodes[e],speed);
}

var runGbf = function() {
  gbf(g,n1,n5);
}

var runAStar = function(start, end, speed) {
  var s, e;
  for(var i = 0; i < g.nodes.length; i++) {
    if(g.nodes[i].title.localeCompare(start) === 0) {
      s = i;
    } else if(g.nodes[i].title.localeCompare(end) === 0) {
      e = i;
    }
  }
  aStar(g,g.nodes[s],g.nodes[e],speed);
}

// On Load
window.onload = function() {

  // Initializes Canvas Properties
  canvas = document.getElementById('canvas');
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth-280;
  document.getElementsByTagName('body')[0].style.width = window.innerWidth-280;

  ctx = canvas.getContext('2d');

  ctx.fillStyle = '#4CAF50';
  ctx.rect(0, 0, window.innerWidth, window.innerHeight);
  ctx.fill();

  g = new graph([]);

  drawGraph();

  // Initializes Popup
  var e = document.getElementById('window');
  e.style.left = (.15 * window.innerWidth) + 'px';
  e.style.bottom = (-1 * .7 * window.innerHeight) + 'px';
}

/*
 * Graph Functions
 */

 var recieveUpdate = function(newGraph) {
   g = newGraph;
   drawGraph();
 }

/*
 * Drawing Functions
 */
// Draws a Circle
var drawCircle = function(x,y) {
  ctx.fillStyle = "#000000";
  ctx.beginPath();
  ctx.arc(x, y, 20, 0, Math.PI*2, true);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.arc(x, y, 15, 0, Math.PI*2, true);
  ctx.closePath();
  ctx.fill();
}
// Draws a Node
var drawNode = function(node) {
  switch(node.state) {
    case 0:
      ctx.fillStyle = '#E57373';
      break;
    case 1:
      ctx.fillStyle = '#651FFF';
      break;
    case 2:
      ctx.fillStyle = '#F44336';
      break;
    case 3:
      ctx.fillStyle = '#FFC400';
      break;
    default:
  }
  ctx.beginPath();
  ctx.arc(node.x, node.y, 20, 0, Math.PI*2, true);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(node.x, node.y, 15, 0, Math.PI*2, true);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#000000";
  ctx.font = "20px Arial";
  if(node.title === undefined) {
    alert('test');
  }
  ctx.fillText(node.title,node.x-6,node.y+6);
}
// Draws a Line between two points
var drawLine = function(x1,y1,x2,y2,color) {
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(x1,y1);
  ctx.lineTo(x2,y2);
  ctx.lineWidth = 10;
  ctx.stroke();
  ctx.closePath();
}
// Draws the edge between two nodes
var drawEdge = function(node1,node2,color) {
  // Draws the line
  drawLine(node1.x, node1.y, node2.x, node2.y, color);
  // Redraws the nodes above the lineTo
  drawNode(node1);
  drawNode(node2);

  var cost;
  for(var i = 0; i < node1.edges.length; i++) {
    if(node1.edges[i][0] === node2) {
      cost = node1.edges[i][1];
    }
  }

  // Finds the midpoint of the line
  var midpoint = [];
  midpoint.push((node1.x + node2.x)/2);
  midpoint.push((node1.y + node2.y)/2);

  ctx.beginPath();
  ctx.arc(midpoint[0]+20,midpoint[1], 15, 0, Math.PI*2, true);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(midpoint[0]+20,midpoint[1], 14, 0, Math.PI*2, true);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#000000";
  ctx.font = "14px Arial";
  if(cost < 10) {
    ctx.fillText(cost,midpoint[0]+16,midpoint[1]+4);
  } else if(cost < 100) {
    ctx.fillText(cost,midpoint[0]+12,midpoint[1]+4);
  } else {
    ctx.fillText(cost,midpoint[0]+8,midpoint[1]+4);
  }

}
// Draws the entire grpah
var drawGraph = function() {
  ctx.fillStyle = '#4CAF50';
  ctx.rect(0, 0, window.innerWidth, window.innerHeight);
  ctx.fill();
  for(var i = 0; i < g.nodes.length; i++) {
    var current = g.nodes[i];
    for(var j = 0; j < current.edges.length; j++) {
      if(current.edges[j][2] === 0) {
        drawEdge(current,current.edges[j][0],'#000');
      } else {
        drawEdge(current,current.edges[j][0],'#FFC400');
      }
    }
  }


  //Needs to draw value if > 0 --- ???? IDK What this is...
}
/**
 * Facilitating Methods
 */
var resetColor = function() {
  for (var i = 0; i < g.nodes.length; i++) {
    g.nodes[i].state = 0;
    for(var j = 0; j < g.nodes[i].edges.length; j++) {
      g.nodes[i].edges[j][2] = 0;
    }
  }
  drawGraph();
}

var drawActions = function(actions,speed) {
  var a;
  var tNode;

  if(actions.length === 1) {
    a = actions.shift();

    // Changes the color of the path edges
    for(var i = 0; i < a.length-1; i++) {
      for(var j = 0; j < a[i].edges.length; j++) {
        if(a[i] !== undefined && a[i] !== null) {
          if(a[i].edges[j][0].title.localeCompare(a[i+1].title) === 0) {
            // Set this node's edge to highlighted
            a[i].edges[j][2] = 1;
            tNode = a[i].edges[j][0];
            // Highlights the other direction
            for(var n = 0; n < tNode.edges.length; n++) {
              if(tNode.edges[n][0].title.localeCompare(a[i].title) === 0) {
                tNode.edges[n][2] = 1;
              }
            }
            drawEdge(a[i],tNode,'#404');
          }
        }
      }
    }
    drawGraph();
    return;

  } else {
    a = actions.shift();
    a[0].state = a[1];
    a[0].value = a[2];

    drawGraph();
    setTimeout(function() {
      drawActions(actions,speed);
    },speed);
  }
}
