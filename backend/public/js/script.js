function displayMenuBar(x) {
  if (x.matches) {
    document.getElementById("menuBar").style.display = "block";
    document.getElementById("lists").style.display = "none";
  } else {
    document.getElementById("menuBar").style.display = "none";
    document.getElementById("lists").style.display = "block";
  }
}

var x = window.matchMedia("(max-width: 1410px)");
displayMenuBar(x);
x.addListener(displayMenuBar);
