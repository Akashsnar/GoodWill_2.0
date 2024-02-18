function isToShuffle(array) {
  let currentIndex = array.length,
      randomIndex;
  while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
          array[randomIndex],
          array[currentIndex],
      ];
  }
  return array;
}

var avatarArray = [0, 1, 2, 3, 4, 5, 6]

isToShuffle(avatarArray)

if (avatarArray[0] == "0") {
  document.getElementById("randAvatar").src = "randomAvatar/u0.png"
}
if (avatarArray[0] == "1") {
  document.getElementById("randAvatar").src = "randomAvatar/u1.png"
}
if (avatarArray[0] == "2") {
  document.getElementById("randAvatar").src = "randomAvatar/u2.png"
}
if (avatarArray[0] == "3") {
  document.getElementById("randAvatar").src = "randomAvatar/u3.png"
}
if (avatarArray[0] == "4") {
  document.getElementById("randAvatar").src = "randomAvatar/u4.png"
}
if (avatarArray[0] == "5") {
  document.getElementById("randAvatar").src = "randomAvatar/u5.png"
}
if (avatarArray[0] == "6") {
  document.getElementById("randAvatar").src = "randomAvatar/u6.png"
}