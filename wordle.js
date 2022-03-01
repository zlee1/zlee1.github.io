//var inc_btn = document.getElementById("inc_btn");
//var dec_btn = document.getElementById("dec_btn");
var output = document.getElementById("length_lbl");
var tbl = document.getElementById("game_tbl");
var chosen = null;
var words = null;
var ctrl_down = 0;
var wait_one = 0;
var alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

for(var i = 1; i < output.value; i++){
  addColumn("game_tbl");
}

if(screen.width < screen.height){

  document.getElementsByTagName("style")[0].innerHTML = 'body {font-family: Courier New;font-weight: 550;} ' +
    'table {text-align: center;font-size: 3vw;font-family: Courier New;font-weight:600;border-spacing: 1vw;margin-left: auto;margin-right: auto;} ' +
    'tr {border: 2px solid black;overflow: hidden;} ' +
    'td {border: 2px solid black;width: 5vw;height: 5vw;border-radius: .75vw;overflow: hidden;} ' +
    'input {font-family: Courier New;font-weight: 550;font-size: 3vw;border-radius: .75vw;margin: 2px;margin-right:-1px;margin-left:-1px;text-align: center;border: 2px solid black;width:8vw;height:14vw;background-color:white;color:black;} ' +
    'h1 {margin:10px;font-size:5vw;} ' +
    'label {font-size:4vw;} ';
  //document.getElementById("inc_btn").style = "width:4vw;height:4vw;";
  //document.getElementById("dec_btn").style = "width:4vw;height:4vw;";
  //document.getElementById("inc_guess_btn").style = "width:4vw;height:4vw;";
  //document.getElementById("dec_guess_btn").style = "width:4vw;height:4vw;";
  document.getElementById("length_lbl").style = "width:12vw;height:4vw;";
  document.getElementById("guess_num_lbl").style = "width:12vw;height:4vw;";

  document.getElementById("guess_btn").style = "width:15vw;text-align:center;";
  document.getElementById("back_btn").style = "width:15vw;text-align:center;";

}

function handleButton(id){
  document.activeElement.blur();
  var cur_row = 0;
  for(var i = 0; i < tbl.rows.length; i++){
    if(!['rgb(221, 221, 221)','rgb(189, 241, 130)','rgb(255, 245, 133)'].includes(tbl.rows[i].cells[0].style.backgroundColor)){
      cur_row = i;
      break;
    }
  }

  for(var j = 0; j < tbl.rows[cur_row].cells.length; j++){
    if(tbl.rows[cur_row].cells[j].innerHTML == ""){
      if(document.getElementById("guess_btn").value != "Restart"){
        tbl.rows[cur_row].cells[j].innerHTML = id;
      }
      return null;

    }
  }
}

document.onkeyup = function(e) {
  if(wait_one == 1){
    wait_one = 0;
  }else if(e.code == "Enter"){
    button.click();
  }else if(e.keyCode >= 65 && e.keyCode <= 90 && ctrl_down != 1){
    document.getElementById(e.code.toString().charAt(3)).click();
  }else if(e.code == "Backspace"){
    document.getElementById("back_btn").click();
  }else if(e.key == "Control"){
    ctrl_down = 0;
  }
}

document.onkeydown = function(e) {
  if(e.key == "Control"){
    ctrl_down = 1;
  }else if(e.keyCode == 86 && ctrl_down == 1){
    navigator.clipboard.readText().then((copiedText) => {
      for(var i = 0; i < copiedText.length; i++){
        document.getElementById(copiedText[i].toUpperCase()).click();
      }
    });
    ctrl_down = 0;
    wait_one = 1;
  }
}

url = "https://raw.githubusercontent.com/zlee1/WordleN/master/data/generated/word_set.txt"

fetch(url)
    .then(response => response.text())
    .then(text => {
        words = JSON.parse(text);
    });

document.getElementById("length_lbl").onchange = function(e) {
  clear_board("game_tbl");
  if(document.getElementById("length_lbl").value > 22){
    document.getElementById("length_lbl").value = 22;
  }else if(document.getElementById("length_lbl").value < 2){
    document.getElementById("length_lbl").value = 2;
  }else{
    if(tbl.rows[0].cells.length < document.getElementById("length_lbl").value){
      for(var i = tbl.rows[0].cells.length; i < document.getElementById("length_lbl").value; i++){
        addColumn("game_tbl");
      }
    }else if(tbl.rows[0].cells.length > document.getElementById("length_lbl").value){
      for(var i = tbl.rows[0].cells.length; i > document.getElementById("length_lbl").value; i--){
        deleteColumn("game_tbl");
      }
    }
  }
}

document.getElementById("guess_num_lbl").onchange = function(e) {
  clear_board("game_tbl");
  if(document.getElementById("guess_num_lbl").value > 999){
    document.getElementById("guess_num_lbl").value = 999;
  }else if(document.getElementById("guess_num_lbl").value < 1){
    document.getElementById("guess_num_lbl").value = 1;
  }else{
    if(tbl.rows.length < document.getElementById("guess_num_lbl").value){
      for(var i = tbl.rows.length; i < document.getElementById("guess_num_lbl").value; i++){
        addRow("game_tbl");
      }
    }else if(tbl.rows.length > document.getElementById("guess_num_lbl").value){
      for(var i = tbl.rows.length; i > document.getElementById("guess_num_lbl").value; i--){
        removeRow("game_tbl");
      }
    }
  }
}

/**
document.getElementById("inc_guess_btn").addEventListener('click', () => {
  addRow("game_tbl");
  document.getElementById("guess_num_lbl").innerHTML = tbl.rows.length;
  clear_board("game_tbl");
});

document.getElementById("dec_guess_btn").addEventListener('click', () => {
  removeRow("game_tbl");
  document.getElementById("guess_num_lbl").innerHTML = tbl.rows.length;
  clear_board("game_tbl");
});

inc_btn.addEventListener('click', () => {
  if(dec_btn.disabled == true){
    dec_btn.disabled = false;
  }
  val = parseInt(output.innerHTML);
  if(val < 22){
    output.innerHTML = val+1;
    for(var i = tbl.rows[0].cells.length; i < val+1; i++){
      addColumn("game_tbl");
    }
  }
  clear_board("game_tbl");
  if(val == 22){
    inc_btn.disabled = true;
  }
});

dec_btn.addEventListener('click', () => {
  if(inc_btn.disabled == true){
    inc_btn.disabled = false;
  }
  val = parseInt(output.innerHTML);
  if(val > 2){
    output.innerHTML = val-1;
    for(var i = val-1; i <= tbl.rows[0].cells.length; i++){
      deleteColumn("game_tbl");
    }
  }
  clear_board("game_tbl");
  if(val == 2){
    dec_btn.disabled = true;
  }
});**/

function clear_board(id){
  document.getElementById("answer").innerHTML = null;
  chosen = null;
  //guess.value = null;
  button.value = "Guess";
  tbl = document.getElementById(id);
  for(var i = 0; i < tbl.rows.length; i++){
    for(var j = 0; j < tbl.rows[i].cells.length; j++)
      tbl.rows[i].cells[j].innerHTML = "";
  }

  for(var i = 0; i < tbl.rows.length; i++){
    for(var j = 0; j < tbl.rows[i].cells.length; j++)
      tbl.rows[i].cells[j].style.backgroundColor = "white";
  }

  for(var i = 0; i < alphabet.length; i++){
    document.getElementById(alphabet[i]).style.backgroundColor = "white";
  }
}

function check_guess_legal(guess,len){
  return words[len.toString()].legal.includes(guess.toLowerCase());
}

var button = document.getElementById("guess_btn");
var guess = document.getElementById("guess_txt");
/**
guess.addEventListener("keyup", function(e) {
  if(e.code == "Enter"){
    button.click();
  }
});**/

function get_info(guess){
  var colors = [];
  var used_letters = [];
  for(var i = 0; i < chosen.length; i++){
    colors.push("gray");
  }

  for(var i = 0; i < chosen.length; i++){
    if(guess[i] == chosen[i]){
      colors[i] = "green";
      used_letters.push(guess[i]);
    }
  }

  for(var i = 0; i < chosen.length; i++){
    if(chosen.includes(guess[i]) && colors[i] == "gray"){
      if(used_letters.includes(guess[i])){
        var w_count = 0;
        var u_count = 0;
        for(var j = 0; j < chosen.length; j++){
          if(chosen[j] == guess[i]){
            w_count += 1;
          }
        }
        for(var j = 0; j < used_letters.length; j++){
          if(used_letters[j] == guess[i]){
            u_count += 1;
          }
        }
        if(w_count > u_count){
          colors[i] = "yellow";
        }
      }else{
        colors[i] = "yellow";
      }
      used_letters.push(guess[i]);
    }
  }

  for(var i = 0; i < colors.length; i++){
    if(colors[i] == "green"){
      document.getElementById(guess[i].toUpperCase()).style.backgroundColor = "#BDF182";
    }else if(colors[i] == "yellow" && document.getElementById(guess[i].toUpperCase()).style.backgroundColor != 'rgb(189, 241, 130)'){
      document.getElementById(guess[i].toUpperCase()).style.backgroundColor = "#FFF585";
    }else if(colors[i] == "gray" && !['rgb(189, 241, 130)', 'rgb(255, 245, 133)'].includes(document.getElementById(guess[i].toUpperCase()).style.backgroundColor)){
      document.getElementById(guess[i].toUpperCase()).style.backgroundColor = "#DDDDDD";
    }
  }
  return colors;
}

function set_colors(colors, row){
  var cur_row = 0;
  for(var row = 0; row < tbl.rows.length; row++){
    if(!['rgb(221, 221, 221)','rgb(189, 241, 130)','rgb(255, 245, 133)'].includes(tbl.rows[row].cells[0].style.backgroundColor)){
      cur_row = row;
      break;
    }
  }

  for(var i = 0; i < colors.length; i++){
    if(colors[i] == "green"){
      tbl.rows[cur_row].cells[i].style.backgroundColor = '#BDF182';
    }else if(colors[i] == "yellow"){
      tbl.rows[cur_row].cells[i].style.backgroundColor = '#FFF585';
    }else{
      tbl.rows[cur_row].cells[i].style.backgroundColor = '#DDDDDD';
    }
  }
}

document.getElementById("back_btn").addEventListener('click', () => {
  var last_row = 0;
  var last_col = 0;
  for(var i = 0; i < tbl.rows.length; i++){
    for(var j = 0; j < tbl.rows[i].cells.length; j++){
      if(tbl.rows[i].cells[j].innerHTML != ""){
        last_row = i;
        last_col = j;
      }
    }
  }
  if(!['rgb(221, 221, 221)','rgb(189, 241, 130)','rgb(255, 245, 133)'].includes(tbl.rows[last_row].cells[last_col].style.backgroundColor)){
    tbl.rows[last_row].cells[last_col].innerHTML = "";
  }
});

button.addEventListener('click', () => {
  var user_guess = "";
  for(var i = 0; i < tbl.rows.length; i++){
    if(!['rgb(221, 221, 221)','rgb(189, 241, 130)','rgb(255, 245, 133)'].includes(tbl.rows[i].cells[0].style.backgroundColor)){
      for(var j = 0; j < tbl.rows[i].cells.length; j++){
        user_guess = user_guess + tbl.rows[i].cells[j].innerHTML;
      }
      break;
    }
  }

  if(button.value == "Restart"){
    chosen = null;
    clear_board("game_tbl");
    button.value = "Guess"
    return null;
  }

  if(chosen == null){
    chosen = choose_word(tbl.rows[0].cells.length).toUpperCase();
  }

  if(check_guess_legal(user_guess,tbl.rows[0].cells.length)){

    var cur_row = 0;
    for(var row = 0; row < tbl.rows.length; row++){
      if(!['rgb(221, 221, 221)','rgb(189, 241, 130)','rgb(255, 245, 133)'].includes(tbl.rows[row].cells[0].style.backgroundColor)){
        cur_row = row;
        break;
      }
    }
    for(var i = 0; i < user_guess.length; i++){
      tbl.rows[cur_row].cells[i].innerHTML = user_guess[i].toUpperCase();
    }
    set_colors(get_info(user_guess), cur_row);

    if(cur_row == tbl.rows.length-1 || user_guess == chosen){
      button.value = "Restart";
      document.getElementById("answer").innerHTML = "Answer: " + chosen.toUpperCase();
    }
    else{
      user_guess = null;
    }

  }

});

function addColumn(tblId)
{
  var tblHeadObj = document.getElementById(tblId);
  var l = tblHeadObj.rows.length;
  for (var h=0; h<l; h++) {
    var newTH = document.createElement('td');
    tblHeadObj.rows[h].appendChild(newTH);
  }
}

function deleteColumn(tblId)
{
  var allRows = document.getElementById(tblId).rows;
  for (var i=0; i<allRows.length; i++) {
    if (allRows[i].cells.length > 1) {
      allRows[i].deleteCell(-1);
    }
  }
}

function addRow(tblId){
  var tblHeadObj = document.getElementById(tblId);
  var row = tblHeadObj.insertRow();
  for(var i = 0; i < tblHeadObj.rows[0].cells.length; i++){
    row.insertCell();
  }
}

function removeRow(tblId){
  var tblHeadObj = document.getElementById(tblId);
  if(tblHeadObj.rows.length > 1){
    var row = tblHeadObj.deleteRow(tblHeadObj.rows.length-1);
  }
}

function choose_word(len){
  return words[len.toString()].answers[Math.floor(Math.random()*words[len.toString()].answers.length)];
}


document.getElementById("A").addEventListener('click', () => {
  handleButton("A");
});
document.getElementById("B").addEventListener('click', () => {
  handleButton("B");
});
document.getElementById("C").addEventListener('click', () => {
  handleButton("C");
});
document.getElementById("D").addEventListener('click', () => {
  handleButton("D");
});
document.getElementById("E").addEventListener('click', () => {
  handleButton("E");
});
document.getElementById("F").addEventListener('click', () => {
  handleButton("F");
});
document.getElementById("G").addEventListener('click', () => {
  handleButton("G");
});
document.getElementById("H").addEventListener('click', () => {
  handleButton("H");
});
document.getElementById("I").addEventListener('click', () => {
  handleButton("I");
});
document.getElementById("J").addEventListener('click', () => {
  handleButton("J");
});
document.getElementById("K").addEventListener('click', () => {
  handleButton("K");
});
document.getElementById("L").addEventListener('click', () => {
  handleButton("L");
});
document.getElementById("M").addEventListener('click', () => {
  handleButton("M");
});
document.getElementById("N").addEventListener('click', () => {
  handleButton("N");
});
document.getElementById("O").addEventListener('click', () => {
  handleButton("O");
});
document.getElementById("P").addEventListener('click', () => {
  handleButton("P");
});
document.getElementById("Q").addEventListener('click', () => {
  handleButton("Q");
});
document.getElementById("R").addEventListener('click', () => {
  handleButton("R");
});
document.getElementById("S").addEventListener('click', () => {
  handleButton("S");
});
document.getElementById("T").addEventListener('click', () => {
  handleButton("T");
});
document.getElementById("U").addEventListener('click', () => {
  handleButton("U");
});
document.getElementById("V").addEventListener('click', () => {
  handleButton("V");
});
document.getElementById("W").addEventListener('click', () => {
  handleButton("W");
});
document.getElementById("X").addEventListener('click', () => {
  handleButton("X");
});
document.getElementById("Y").addEventListener('click', () => {
  handleButton("Y");
});
document.getElementById("Z").addEventListener('click', () => {
  handleButton("Z");
});
