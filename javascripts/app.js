var app = angular.module('WKUDirections', []);

app.controller('MainCtrl', [
  '$scope',
  function($scope) {

    $scope.nodes = [];

    $scope.waypoints = [];

    $scope.appBuildGraph = function() {
      buildGraph();
    }

    $scope.getDistance = function() {
      if($scope.start === '' || $scope.start === undefined) { return; }
      if($scope.end === '' || $scope.end === undefined) { return; }
      if($scope.start === $scope.end) {
        $scope.distance = 0;
        return;
      }

      $scope.distance = distance($scope.start, $scope.end);
    }

    // Adds a waypoint
    $scope.add = function () {
      $scope.waypoints.push({
        name: ($scope.waypoints.length + 1)
      });
    };

    // Removes a waypoint
    $scope.removeWP = function(wp) {
      $scope.waypoints.splice(wp-1,1);
      for(var i = wp-1; i < $scope.waypoints.length; i++) {
        $scope.waypoints[i].name -= 1;
      }
    }

    // Adds a waypoint
    $scope.addWaypoint = function(node) {
      waypoints.add(node);
    }

    // Adds a node to the node list
    $scope.addNode = function() {
      if($scope.title === '' || $scope.title === undefined) {
        alert('Please enter a title for the node.');
        return;
      }
      if($scope.x === '' || $scope.x === undefined) {
        alert('Please enter a x-cooredinate for the node.');
        return;
      }
      if($scope.y === '' || $scope.y === undefined) {
        alert('Please enter a y-coordinate for the node.');
        return;
      }

      // Get edge info
      var e;
      var tEdges = [];
      for(var i = 0; i < $scope.nodes.length; i++) {
        e = document.getElementById('edge-' + $scope.nodes[i].title);
        if(e !== undefined && e !== null) {
          if(e.checked) {
            e = document.getElementById('weight-' + $scope.nodes[i].title);
            var tWeight = parseInt(e.value);
            var tDist = Math.pow( Math.pow($scope.nodes[i].x-parseInt($scope.x),2)+Math.pow($scope.nodes[i].y-parseInt($scope.y),2),.5);
            if(tWeight === null || tWeight === undefined || tWeight < 1) {
              alert('Edge weights must be a positive integer.');
              return;
            } else if( parseInt(tWeight) < tDist) { // If it will mess with the heuristic
              if(confirm('One or more of your node edges is too small for the heuristic to work properly.')) {
                tEdges.push([$scope.nodes[i],tWeight]);
              } else {
                alert('Try a number greater than ' + tDist + ' next time.');
                return;
              }
            } else {
              tEdges.push([$scope.nodes[i],tWeight]);
            }
          }
        }
      }

      if( ($scope.nodes.length > 0) && (tEdges.length === 0) ) {
        alert('You must provide at least 1 edge.');
        return;
      }

      // Build Node
      var tNode = new node($scope.title,[],$scope.x,$scope.y);
      // Add edges
      for(var i = 0; i < tEdges.length; i++) {
        tNode.addEdge(tEdges[i][0],tEdges[i][1]);
        tEdges[i][0].addEdge(tNode,tEdges[i][1]);
      }
      // Push to Graph
      $scope.nodes.push(tNode);
      showMessage('Adding a new node: ' + tNode.title);

      $scope.updateGraph();

      // Clears every input form for nodes
      $scope.title = '';
      $scope.x = '';
      $scope.y = '';
      for(var i = 0; i < $scope.nodes.length; i++) {
        e = document.getElementById('edge-' + $scope.nodes[i].title);
        if(e !== undefined && e !== null) {
          if(e.checked) {
            e.checked = false;
            e = document.getElementById('weight-' + $scope.nodes[i].title);
            e.value = '';
          }
        }
      }
    }

    // Removes the passes node
    $scope.removeNode = function(nTitle) {
      var tNode1, tNode2;

      for(var i = 0; i < $scope.nodes.length; i++) { // Find the node
        if($scope.nodes[i].title.localeCompare(nTitle) === 0) {
          tNode1 = $scope.nodes[i];
          for(var j = 0; j < tNode1.edges.length; j++) { // Iterate through the edge nodes
            tNode2 = tNode1.edges[j][0];
            for(var k = 0; k < tNode2.edges.length; k++) { // Iterate through those nodes' edge nodes
              if(tNode2.edges[k][0].title.localeCompare(tNode1.title) === 0) {
                tNode2.edges.splice(k,1);
                break;
              }
            }
          }
          $scope.nodes.splice(i,1);
          break;
        }
      }

      showMessage('Removing ' + nTitle);
      $scope.updateGraph();
    }

    // Updates the graph in drawing.js and searching.js
    $scope.updateGraph = function() {
      recieveUpdate(new graph($scope.nodes));
    }

    // Performs a search on the given nodes
    $scope.search = function() {
      if($scope.start === undefined || $scope.start === null) {
        alert('You must select a start node');
        return;
      } else if($scope.end === undefined || $scope.end === null) {
        alert('You must select an end node');
        return;
      } else if($scope.start.localeCompare($scope.end) === 0) {
        alert('The start and end cannot be the same nodes.');
        return;
      } else if ($scope.speed === undefined) {
        alert('You must select a display speed');
        return;
      }

      resetColor();
      switch($scope.type) {
        case '1':
          showMessage('Searching for a path from ' + $scope.start + ' to ' + $scope.end + ' using Breadth-First Search');
          runBfs($scope.start,$scope.end,$scope.speed);
          break;
        case '2':
          showMessage('Searching for a path from ' + $scope.start + ' to ' + $scope.end + ' using Depth-First Search');
          runDfs($scope.start,$scope.end,$scope.speed);
          break;
        case '3':
          showMessage('Searching for a path from ' + $scope.start + ' to ' + $scope.end + ' using Uniform Cost Search');
          runUcs($scope.start,$scope.end,$scope.speed);
          break;
        case '4':
          showMessage('Searching for a path from ' + $scope.start + ' to ' + $scope.end + ' using Greedy Best-First Search');
          runGbf();
          break;
        case '5':
          showMessage('Searching for a path from ' + $scope.start + ' to ' + $scope.end + ' using A* Search');
          runAStar($scope.start,$scope.end,$scope.speed);
          break;
        default:
          alert('Please select a search algorithm.');
          break;
      }
    }

    $scope.preset1 = function() {
      while($scope.nodes.length > 0) {
        $scope.nodes.splice(0,1);
      }

      $scope.nodes.push(new node('A',[],75,75));
      $scope.nodes.push(new node('B',[],175,175));
      $scope.nodes.push(new node('C',[],300,75));
      $scope.nodes.push(new node('D',[],450,175));
      $scope.nodes.push(new node('E',[],450,75));
      $scope.nodes.push(new node('F',[],370,250));

      $scope.nodes[0].addEdge($scope.nodes[1],145);
      $scope.nodes[0].addEdge($scope.nodes[2],225);

      $scope.nodes[1].addEdge($scope.nodes[0],145);
      $scope.nodes[1].addEdge($scope.nodes[2],165);

      $scope.nodes[2].addEdge($scope.nodes[0],225);
      $scope.nodes[2].addEdge($scope.nodes[1],165);
      $scope.nodes[2].addEdge($scope.nodes[3],185);
      $scope.nodes[2].addEdge($scope.nodes[4],150);
      $scope.nodes[2].addEdge($scope.nodes[5],190);

      $scope.nodes[3].addEdge($scope.nodes[2],185);
      $scope.nodes[3].addEdge($scope.nodes[5],110);

      $scope.nodes[4].addEdge($scope.nodes[2],150);

      $scope.nodes[5].addEdge($scope.nodes[2],190);
      $scope.nodes[5].addEdge($scope.nodes[3],110);

      $scope.updateGraph();
      togglePopup();
    }

    $scope.preset2 = function() {
      while($scope.nodes.length > 0) {
        $scope.nodes.splice(0,1);
      }

      $scope.nodes.push(new node('A',[],100,150));
      $scope.nodes.push(new node('B',[],225,75));
      $scope.nodes.push(new node('C',[],350,150));
      $scope.nodes.push(new node('D',[],350,300));
      $scope.nodes.push(new node('E',[],100,300));

      $scope.nodes[0].addEdge($scope.nodes[1],10);
      $scope.nodes[0].addEdge($scope.nodes[2],10);
      $scope.nodes[0].addEdge($scope.nodes[3],10);
      $scope.nodes[0].addEdge($scope.nodes[4],10);

      $scope.nodes[1].addEdge($scope.nodes[0],10);
      $scope.nodes[1].addEdge($scope.nodes[2],10);
      $scope.nodes[1].addEdge($scope.nodes[3],10);
      $scope.nodes[1].addEdge($scope.nodes[4],10);

      $scope.nodes[2].addEdge($scope.nodes[0],10);
      $scope.nodes[2].addEdge($scope.nodes[1],10);
      $scope.nodes[2].addEdge($scope.nodes[3],10);
      $scope.nodes[2].addEdge($scope.nodes[4],10);

      $scope.nodes[3].addEdge($scope.nodes[0],10);
      $scope.nodes[3].addEdge($scope.nodes[1],10);
      $scope.nodes[3].addEdge($scope.nodes[2],10);
      $scope.nodes[3].addEdge($scope.nodes[4],10);

      $scope.nodes[4].addEdge($scope.nodes[0],10);
      $scope.nodes[4].addEdge($scope.nodes[1],10);
      $scope.nodes[4].addEdge($scope.nodes[2],10);
      $scope.nodes[4].addEdge($scope.nodes[3],10);

      $scope.updateGraph();
      togglePopup();
    }

    $scope.preset3 = function() {
      while($scope.nodes.length > 0) {
        $scope.nodes.splice(0,1);
      }
      // 0-5
      $scope.nodes.push(new node('A1',[],100,100));
      $scope.nodes.push(new node('B1',[],100,200));
      $scope.nodes.push(new node('C1',[],100,300));
      $scope.nodes.push(new node('D1',[],100,400));
      $scope.nodes.push(new node('E1',[],100,500));
      $scope.nodes.push(new node('F1',[],100,600));
      // 6-11
      $scope.nodes.push(new node('A2',[],200,100));
      $scope.nodes.push(new node('B2',[],200,200));
      $scope.nodes.push(new node('C2',[],200,300));
      $scope.nodes.push(new node('D2',[],200,400));
      $scope.nodes.push(new node('E2',[],200,500));
      $scope.nodes.push(new node('F2',[],200,600));
      // 12-17
      $scope.nodes.push(new node('A3',[],300,100));
      $scope.nodes.push(new node('B3',[],300,200));
      $scope.nodes.push(new node('C3',[],300,300));
      $scope.nodes.push(new node('D3',[],300,400));
      $scope.nodes.push(new node('E3',[],300,500));
      $scope.nodes.push(new node('F3',[],300,600));
      // 18-23
      $scope.nodes.push(new node('A4',[],400,100));
      $scope.nodes.push(new node('B4',[],400,200));
      $scope.nodes.push(new node('C4',[],400,300));
      $scope.nodes.push(new node('D4',[],400,400));
      $scope.nodes.push(new node('E4',[],400,500));
      $scope.nodes.push(new node('F4',[],400,600));
      // 24-29
      $scope.nodes.push(new node('A5',[],500,100));
      $scope.nodes.push(new node('B5',[],500,200));
      $scope.nodes.push(new node('C5',[],500,300));
      $scope.nodes.push(new node('D5',[],500,400));
      $scope.nodes.push(new node('E5',[],500,500));
      $scope.nodes.push(new node('F5',[],500,600));
      // 30-35
      $scope.nodes.push(new node('A6',[],600,100));
      $scope.nodes.push(new node('B6',[],600,200));
      $scope.nodes.push(new node('C6',[],600,300));
      $scope.nodes.push(new node('D6',[],600,400));
      $scope.nodes.push(new node('E6',[],600,500));
      $scope.nodes.push(new node('F6',[],600,600));

      // Edge addition
      $scope.nodes[0].addEdge($scope.nodes[1],100);
      $scope.nodes[1].addEdge($scope.nodes[0],100);
      $scope.nodes[0].addEdge($scope.nodes[6],100);
      $scope.nodes[6].addEdge($scope.nodes[0],100);

      $scope.nodes[1].addEdge($scope.nodes[2],100);
      $scope.nodes[2].addEdge($scope.nodes[1],100);
      $scope.nodes[1].addEdge($scope.nodes[7],100);
      $scope.nodes[7].addEdge($scope.nodes[1],100);

      $scope.nodes[2].addEdge($scope.nodes[3],100);
      $scope.nodes[3].addEdge($scope.nodes[2],100);
      $scope.nodes[2].addEdge($scope.nodes[8],100);
      $scope.nodes[8].addEdge($scope.nodes[2],100);

      $scope.nodes[3].addEdge($scope.nodes[4],100);
      $scope.nodes[4].addEdge($scope.nodes[3],100);
      $scope.nodes[3].addEdge($scope.nodes[9],100);
      $scope.nodes[9].addEdge($scope.nodes[3],100);

      $scope.nodes[4].addEdge($scope.nodes[5],100);
      $scope.nodes[5].addEdge($scope.nodes[4],100);
      $scope.nodes[4].addEdge($scope.nodes[10],100);
      $scope.nodes[10].addEdge($scope.nodes[4],100);

      $scope.nodes[5].addEdge($scope.nodes[11],100);
      $scope.nodes[11].addEdge($scope.nodes[5],100);

      $scope.nodes[6].addEdge($scope.nodes[7],100);
      $scope.nodes[7].addEdge($scope.nodes[6],100);
      $scope.nodes[6].addEdge($scope.nodes[12],100);
      $scope.nodes[12].addEdge($scope.nodes[6],100);

      $scope.nodes[7].addEdge($scope.nodes[8],100);
      $scope.nodes[8].addEdge($scope.nodes[7],100);
      $scope.nodes[7].addEdge($scope.nodes[13],100);
      $scope.nodes[13].addEdge($scope.nodes[7],100);

      $scope.nodes[8].addEdge($scope.nodes[9],100);
      $scope.nodes[9].addEdge($scope.nodes[8],100);
      $scope.nodes[8].addEdge($scope.nodes[14],100);
      $scope.nodes[14].addEdge($scope.nodes[8],100);

      $scope.nodes[9].addEdge($scope.nodes[10],100);
      $scope.nodes[10].addEdge($scope.nodes[9],100);
      $scope.nodes[9].addEdge($scope.nodes[15],100);
      $scope.nodes[15].addEdge($scope.nodes[9],100);

      $scope.nodes[10].addEdge($scope.nodes[11],100);
      $scope.nodes[11].addEdge($scope.nodes[10],100);
      $scope.nodes[10].addEdge($scope.nodes[16],100);
      $scope.nodes[16].addEdge($scope.nodes[10],100);

      $scope.nodes[11].addEdge($scope.nodes[17],100);
      $scope.nodes[17].addEdge($scope.nodes[11],100);

      $scope.nodes[12].addEdge($scope.nodes[13],100);
      $scope.nodes[13].addEdge($scope.nodes[12],100);
      $scope.nodes[12].addEdge($scope.nodes[18],100);
      $scope.nodes[18].addEdge($scope.nodes[12],100);

      $scope.nodes[13].addEdge($scope.nodes[14],100);
      $scope.nodes[14].addEdge($scope.nodes[13],100);
      $scope.nodes[13].addEdge($scope.nodes[19],100);
      $scope.nodes[19].addEdge($scope.nodes[13],100);

      $scope.nodes[14].addEdge($scope.nodes[15],100);
      $scope.nodes[15].addEdge($scope.nodes[14],100);
      $scope.nodes[14].addEdge($scope.nodes[20],100);
      $scope.nodes[20].addEdge($scope.nodes[14],100);

      $scope.nodes[15].addEdge($scope.nodes[16],100);
      $scope.nodes[16].addEdge($scope.nodes[15],100);
      $scope.nodes[15].addEdge($scope.nodes[21],100);
      $scope.nodes[21].addEdge($scope.nodes[15],100);

      $scope.nodes[16].addEdge($scope.nodes[17],100);
      $scope.nodes[17].addEdge($scope.nodes[16],100);
      $scope.nodes[16].addEdge($scope.nodes[22],100);
      $scope.nodes[22].addEdge($scope.nodes[16],100);

      $scope.nodes[17].addEdge($scope.nodes[23],100);
      $scope.nodes[23].addEdge($scope.nodes[17],100);

      $scope.nodes[18].addEdge($scope.nodes[19],100);
      $scope.nodes[19].addEdge($scope.nodes[18],100);
      $scope.nodes[18].addEdge($scope.nodes[24],100);
      $scope.nodes[24].addEdge($scope.nodes[18],100);

      $scope.nodes[19].addEdge($scope.nodes[20],100);
      $scope.nodes[20].addEdge($scope.nodes[19],100);
      $scope.nodes[19].addEdge($scope.nodes[25],100);
      $scope.nodes[25].addEdge($scope.nodes[19],100);

      $scope.nodes[20].addEdge($scope.nodes[21],100);
      $scope.nodes[21].addEdge($scope.nodes[20],100);
      $scope.nodes[20].addEdge($scope.nodes[26],100);
      $scope.nodes[26].addEdge($scope.nodes[20],100);

      $scope.nodes[21].addEdge($scope.nodes[22],100);
      $scope.nodes[22].addEdge($scope.nodes[21],100);
      $scope.nodes[21].addEdge($scope.nodes[27],100);
      $scope.nodes[27].addEdge($scope.nodes[21],100);

      $scope.nodes[22].addEdge($scope.nodes[23],100);
      $scope.nodes[23].addEdge($scope.nodes[22],100);
      $scope.nodes[22].addEdge($scope.nodes[28],100);
      $scope.nodes[28].addEdge($scope.nodes[22],100);

      $scope.nodes[23].addEdge($scope.nodes[29],100);
      $scope.nodes[29].addEdge($scope.nodes[23],100);

      $scope.nodes[24].addEdge($scope.nodes[25],100);
      $scope.nodes[25].addEdge($scope.nodes[24],100);
      $scope.nodes[24].addEdge($scope.nodes[30],100);
      $scope.nodes[30].addEdge($scope.nodes[24],100);

      $scope.nodes[25].addEdge($scope.nodes[26],100);
      $scope.nodes[26].addEdge($scope.nodes[25],100);
      $scope.nodes[25].addEdge($scope.nodes[31],100);
      $scope.nodes[31].addEdge($scope.nodes[25],100);

      $scope.nodes[26].addEdge($scope.nodes[27],100);
      $scope.nodes[27].addEdge($scope.nodes[26],100);
      $scope.nodes[26].addEdge($scope.nodes[32],100);
      $scope.nodes[32].addEdge($scope.nodes[26],100);

      $scope.nodes[27].addEdge($scope.nodes[28],100);
      $scope.nodes[28].addEdge($scope.nodes[27],100);
      $scope.nodes[27].addEdge($scope.nodes[33],100);
      $scope.nodes[33].addEdge($scope.nodes[27],100);

      $scope.nodes[28].addEdge($scope.nodes[29],100);
      $scope.nodes[29].addEdge($scope.nodes[28],100);
      $scope.nodes[28].addEdge($scope.nodes[34],100);
      $scope.nodes[34].addEdge($scope.nodes[28],100);

      $scope.nodes[29].addEdge($scope.nodes[35],100);
      $scope.nodes[35].addEdge($scope.nodes[29],100);

      $scope.nodes[30].addEdge($scope.nodes[31],100);
      $scope.nodes[31].addEdge($scope.nodes[30],100);
      $scope.nodes[31].addEdge($scope.nodes[32],100);
      $scope.nodes[32].addEdge($scope.nodes[31],100);
      $scope.nodes[32].addEdge($scope.nodes[33],100);
      $scope.nodes[33].addEdge($scope.nodes[32],100);
      $scope.nodes[33].addEdge($scope.nodes[34],100);
      $scope.nodes[34].addEdge($scope.nodes[33],100);
      $scope.nodes[34].addEdge($scope.nodes[35],100);
      $scope.nodes[35].addEdge($scope.nodes[34],100);

      $scope.updateGraph();
      togglePopup();
    }

}]);
