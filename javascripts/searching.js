/**
 * Graph Object
**/
function graph(nodes) {
  this.nodes = nodes;

  this.getNode = function(index) {
    return this.nodes[index];
  }
  this.addNode = function(node) {
    this.nodes.push(node);
  }
}
/**
 * Node Object
**/
function node(title, edges, x, y) {
  this.title = title;
  if(edges === null) {
    this.edges = new Array();
  } else {
    this.edges = edges; // 2D array: [0] = title [1] = cost
  }
  this.x = x;
  this.y = y;
  this.state = 0; // 0-unseen, 1-frontier, 2-expanded, 3-current
  this.value = 0;

  // Adds an edge to the node
  this.addEdge = function(node, cost) {
    var tEdge = [node, cost, 0];
    this.edges.push(tEdge);
  };
  // Returns the cost to travel to another node if it is adjacent
  this.getCost = function(destNode) {
    for(var i = 0; i < this.edges.length; i++) {
      if(this.edges[i][0].title.localeCompare(destNode.title) === 0) {
        return this.edges[i][1];
      }
    }
    return null;
  };
}

var distance = function(start, end) {
  var n1 = new node('A',null,75,75);
  var n2 = new node('B',null,175,175);
  var n3 = new node('C',null,300,75);
  var n4 = new node('D',null,450,175);
  var n5 = new node('E',null,450,75);
  var n6 = new node('F',null,370,250);

  n1.addEdge(n2,10);
  n1.addEdge(n3,115);

  n2.addEdge(n1,10);
  n2.addEdge(n3,5);

  n3.addEdge(n1,115);
  n3.addEdge(n2,5);
  n3.addEdge(n4,10);
  n3.addEdge(n5,15);
  n3.addEdge(n6,25);

  n4.addEdge(n3,10);
  n4.addEdge(n6,5);

  n5.addEdge(n3,15);

  n6.addEdge(n4,5);
  n6.addEdge(n3,25);

  var nodes = [n1, n2, n3, n4, n5, n6];

  var node1, node2;
  for(var i = 0; i < nodes.length; i++) {
    if(nodes[i].title.localeCompare(start) === 0) {
      node1 = nodes[i];
    } else if(nodes[i].title.localeCompare(end) === 0) {
      node2 = nodes[i];
    }
  }
  if(node1 !== null && node2 !== null) {
    return node1.getCost(node2);
  } else {
    return null;
  }
}

var bfs = function(graph, sNode, eNode, speed) {
  // Ensures all nodes are 'undiscovered'
  for(var i = 0; i < graph.nodes.length; i++) {
    graph.nodes[i].state = 0;
  }

  var actions = [];
  var q = [];
  var current = null;
  var history;

  q.push([sNode,[]]);
  sNode.state = 1; // Sets state to 'frontier'
  actions.push([sNode,1,[]]);

  while(q.length !== 0) {
    history = [];
    current = q.shift();
    // Build History
    for(var i = 0; i < current[1].length; i++) {
      history.push(current[1][i]);
    }
    history.push(current[0]);  // Adds the current node to the path history

    current[0].state = 3; // Sets state to 'current'
    actions.push([current[0],3]);

    if(current[0].title.localeCompare(eNode.title) === 0) {
      actions.push(history);
      resetColor();
      drawActions(actions,speed);
      return;
    }

    for(var i = 0; i < current[0].edges.length; i++) {
      if(current[0].edges[i][0].state === 0) {
        current[0].edges[i][0].state = 1;
        actions.push([current[0].edges[i][0],1]);
        q.push([current[0].edges[i][0],history]);
      }
    }
    current[0].state = 2; // Sets the state to 'expanded'
    actions.push([current[0],2]);
  }
  resetColor();
  drawActions(actions);
}

var dfs = function(graph, sNode, eNode, speed) {
  // Ensures all nodes are 'undiscovered'
  for(var i = 0; i < graph.nodes.length; i++) {
    graph.nodes[i].found = false;
  }

  var actions = [];
  var s = [];
  var current = null;
  var history;

  s.push([sNode,[]]);
  sNode.state = 1; // Sets state to 'frontier'
  actions.push([sNode,1]);

  while(s.length !== 0) {
    history = [];
    current = s.pop();
    // Build History
    for(var i = 0; i < current[1].length; i++) {
      history.push(current[1][i]);
    }
    history.push(current[0]);  // Adds the current node to the path history

    current[0].state = 3; // Sets state to 'current'
    actions.push([current[0],3]);

    if(current[0].title.localeCompare(eNode.title) === 0) {
      actions.push(history);
      resetColor();
      drawActions(actions,speed);
      return;
    }

    for(var i = 0; i < current[0].edges.length; i++) {
      if(current[0].edges[i][0].state === 0) {
        current[0].edges[i][0].state = 1;
        actions.push([current[0].edges[i][0],1]);
        s.push([current[0].edges[i][0],history]);
      }
    }
    current[0].state = 2; // Sets the state to 'expanded'
    actions.push([current[0],2]);
  }
  resetColor();
  drawActions(actions);
}

var ucs = function(graph, sNode, eNode, speed) {
  // Ensures all nodes are 'undiscovered'
  for(var i = 0; i < graph.nodes.length; i++) {
    graph.nodes[i].state = 0;
  }

  var actions = [];
  var h = new BinaryHeap();
  var current = null;
  var curScore = 99999999;
  var history;

  h.push([sNode,0,[]]);
  sNode.state = 1; // Sets state to 'frontier'
  actions.push([sNode,1]);

  while(h.size() !== 0) {
    history = [];
    current = h.pop();
    // Build History
    for(var i = 0; i < current[2].length; i++) {
      history.push(current[2][i]);
    }
    history.push(current[0]);  // Adds the current node to the path history

    current[0].state = 3; // Sets state to 'current'
    actions.push([current[0],3]);

    if(current[0].title.localeCompare(eNode.title) === 0) {
      actions.push(history);
      resetColor();
      drawActions(actions,speed);
      return;
    }

    for(var i = 0; i < current[0].edges.length; i++) {
      if(current[0].edges[i][0].state === 0 ||
        current[0].edges[i][0].state === 1) {

        current[0].edges[i][0].state = 1;
        actions.push([current[0].edges[i][0],1]);
        h.push([current[0].edges[i][0],
          (current[1] + current[0].edges[i][1]),
          history]);
      }
    }
    current[0].state = 2; // Sets the state to 'expanded'
    actions.push([current[0],2]);
  }
  resetColor();
  drawActions(actions);
}

var gbf = function(graph, sNode, eNode, speed) {
  // Ensures all nodes are 'undiscovered'
  for(var i = 0; i < graph.nodes.length; i++) {
    graph.nodes[i].state = 0;
  }

  var actions = [];
  var h = new BinaryHeap();
  var current = null;
  var curScore = 99999999;
  var history;

  h.push([sNode,0,[]]);
  sNode.state = 1; // Sets state to 'frontier'
  actions.push([sNode,1]);

  while(h.size() !== 0) {
    history = [];
    current = h.pop();
    // Build History
    for(var i = 0; i < current[2].length; i++) {
      history.push(current[2][i]);
    }
    history.push(current[0]);  // Adds the current node to the path history

    current[0].state = 3; // Sets state to 'current'
    actions.push([current[0],3]);

    if(current[0].title.localeCompare(eNode.title) === 0) {
      actions.push(history);
      resetColor();
      drawActions(actions,speed);
      return;
    }

    for(var i = 0; i < current[0].edges.length; i++) {
      if(current[0].edges[i][0].state === 0 ||
        current[0].edges[i][0].state === 1) {

        current[0].edges[i][0].state = 1;
        actions.push([current[0].edges[i][0],1]);
        h.push([current[0].edges[i][0],
          current[0].edges[i][1],
          history]);
      }
    }
    current[0].state = 2; // Sets the state to 'expanded'
    actions.push([current[0],2]);
  }
  resetColor();
  drawActions(actions);
}

var aStar = function(graph, sNode, eNode, speed) {
  // Ensures all nodes are 'undiscovered'
  for(var i = 0; i < graph.nodes.length; i++) {
    graph.nodes[i].state = 0;
  }

  var actions = [];
  var h = new BinaryHeap();
  var current = null;
  var curScore = 99999999;
  var history;

  h.push([sNode,0,[]]);
  sNode.state = 1; // Sets state to 'frontier'
  actions.push([sNode,1]);

  while(h.size() !== 0) {
    history = [];
    current = h.pop();
    // Build History
    for(var i = 0; i < current[2].length; i++) {
      history.push(current[2][i]);
    }
    history.push(current[0]);  // Adds the current node to the path history

    current[0].state = 3; // Sets state to 'current'
    actions.push([current[0],3]);

    if(current[0].title.localeCompare(eNode.title) === 0) {
      actions.push(history);
      resetColor();
      drawActions(actions,speed);
      return;
    }

    for(var i = 0; i < current[0].edges.length; i++) {
      if(current[0].edges[i][0].state === 0 ||
        current[0].edges[i][0].state === 1) {

        current[0].edges[i][0].state = 1;
        actions.push([
          current[0].edges[i][0], 1,
          (current[1] + current[0].edges[i][1]) + distance(current[0].edges[i][0],eNode)
        ]);
        h.push([current[0].edges[i][0], (current[1] + current[0].edges[i][1]) +
          distance(current[0].edges[i][0],eNode), history]);
      }
    }
    current[0].state = 2; // Sets the state to 'expanded'
    actions.push([current[0],2]);
  }
  resetColor();
  drawActions(actions);
}

var distance = function(node1, node2) {
  return Math.sqrt( Math.pow(node1.x - node2.x, 2) +
                    Math.pow(node1.y - node2.y, 2) );
}
