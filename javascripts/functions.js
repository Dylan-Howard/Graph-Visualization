function toggleSideBar() {
  var e = document.getElementById('side-bar');

  if(e.style.left !== '0px') {
    e.style.left = '0px';
  } else {
    e.style.left = '-420px'
  }
}

function convertToSeconds(e) {
  content = e.innerHTML;

  if(content.length > 3) {
    content = content.substring(0,1) + '.' + content.substring(1) + 's';
  } else {
    content = '.' + content.substring(1) + 's';
  }

  e.innerHTML = content;
}

function showMessage(input) {
  var data = {message: input};
  var messageBar = document.getElementById('message-bar');
  messageBar.MaterialSnackbar.showSnackbar(data);
}

function togglePopup() {
  var e1 = document.getElementById('window');
  var e2 = document.getElementById('filler');
  if(e1.style.bottom === ((.15 * window.innerHeight) + 'px') ) {
    e1.style.bottom = (-1 * .7 * window.innerHeight) + 'px';
    e2.style.opacity = 0;
    e2.style.zIndex = -1;
  } else {
    e1.style.bottom = (.15 * window.innerHeight) + 'px';
    e2.style.zIndex = 1;
    e2.style.opacity = .3;
  }
}
