var app = angular.module('WKUDirections', []);

app.controller('MainCtrl', [
  '$scope',
  function($scope) {

    // Initializes the graph to the defaults
    // $scope.nodes = [
    //   new node('A',[],75,75),
    //   new node('B',[],175,175),
    //   new node('C',[],300,75),
    //   new node('D',[],450,175),
    //   new node('E',[],450,75),
    //   new node('F',[],370,250)
    // ];
    //
    // $scope.nodes[0].addEdge($scope.nodes[1],10);
    // $scope.nodes[0].addEdge($scope.nodes[2],115);
    //
    // $scope.nodes[1].addEdge($scope.nodes[0],10);
    // $scope.nodes[1].addEdge($scope.nodes[2],5);
    //
    // $scope.nodes[2].addEdge($scope.nodes[0],115);
    // $scope.nodes[2].addEdge($scope.nodes[1],5);
    // $scope.nodes[2].addEdge($scope.nodes[3],10);
    // $scope.nodes[2].addEdge($scope.nodes[4],15);
    // $scope.nodes[2].addEdge($scope.nodes[5],25);
    //
    // $scope.nodes[3].addEdge($scope.nodes[2],10);
    // $scope.nodes[3].addEdge($scope.nodes[5],5);
    //
    // $scope.nodes[4].addEdge($scope.nodes[2],15);
    //
    // $scope.nodes[5].addEdge($scope.nodes[3],5);
    // $scope.nodes[5].addEdge($scope.nodes[2],25);

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
            if(tWeight === null || tWeight === undefined || tWeight < 1) {
              alert('Edge weights must be a positive integer.');
              return;
            }
            tEdges.push([$scope.nodes[i],tWeight]);
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
      $scope.title = '';
      $scope.x = '';
      $scope.y = '';
    }

    // Removes the passes node
    $scope.removeNode = function(nTitle) {
      var tNode1, tNode2;

      for(var i = 0; i < $scope.nodes.length; i++) { // Find the node
        if($scope.nodes[i].title.localeCompare(nTitle) === 0) {

          tNode1 = $scope.nodes[i];
          // alert(tNode1.edges.length);
          for(var j = 0; j < tNode1.edges.length; j++) { // Iterate through the edge nodes
            tNode2 = tNode1.edges[j][0];
            // alert('Looking at ' + tNode2.title);
            for(var k = 0; k < tNode2.edges.length; k++) { //Iterate through those nodes' edge nodes
            // alert(tNode2.edges[k][0].title + '|' + tNode1.title);
            // alert(tNode2.edges[k][0].title.localeCompare(tNode1.title) === 0);
              if(tNode2.edges[k][0].title.localeCompare(tNode1.title) === 0) {
                // alert('Removing ' + tNode2.edges[k][0].title);
                tNode2.edges.splice(k,1);
                break;
              }
            }
          }
          // alert('Removing ' + tNode1.title + ' from $scope.nodes');
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
      $scope.nodes = [];

      $scope.nodes.push(new node('A',[],75,75));
      $scope.nodes.push(new node('B',[],175,175));
      $scope.nodes.push(new node('C',[],300,75));
      $scope.nodes.push(new node('D',[],450,175));
      $scope.nodes.push(new node('E',[],450,75));
      $scope.nodes.push(new node('F',[],370,250));

      $scope.nodes[0].addEdge($scope.nodes[1],10);
      $scope.nodes[0].addEdge($scope.nodes[2],115);

      $scope.nodes[1].addEdge($scope.nodes[0],10);
      $scope.nodes[1].addEdge($scope.nodes[2],5);

      $scope.nodes[2].addEdge($scope.nodes[0],115);
      $scope.nodes[2].addEdge($scope.nodes[1],5);
      $scope.nodes[2].addEdge($scope.nodes[3],10);
      $scope.nodes[2].addEdge($scope.nodes[4],15);
      $scope.nodes[2].addEdge($scope.nodes[5],25);

      $scope.nodes[3].addEdge($scope.nodes[2],10);
      $scope.nodes[3].addEdge($scope.nodes[5],5);

      $scope.nodes[4].addEdge($scope.nodes[2],15);

      $scope.nodes[5].addEdge($scope.nodes[3],5);
      $scope.nodes[5].addEdge($scope.nodes[2],25);

      $scope.updateGraph();
      togglePopup();
    }

    $scope.preset2 = function() {
      $scope.nodes = [];

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


}]);
