var genres = null;
service_genres_counted_url = "https://raw.githubusercontent.com/zlee1/StreamingServiceAnalysis/master/data/modified/service_genres_counted.txt"

fetch(service_genres_counted_url)
    .then(response => response.text())
    .then(text => {
        genres = JSON.parse(text);
    });

function get_by_service(service, key, set){
  var r = {};
  for(var i = 0; i < set.service.length; i++){
    if(set.service[i] == service){
      r[set[key][i]] = set.count[i];
    }
  }
  return r;
}

function get_unique(set, key){
  var unique = [];
  for(var i = 0; i < set[key].length; i++){
    if(!unique.includes(set[key][i])){
      unique.push(set[key][i]);
    }
  }
  return unique;
}

function clear_inputs(){
  document.getElementById("inputs").innerHTML = "";
}

function add_genre_inputs(){
  document.getElementById("next").value = "Continue";
  clear_inputs();
  unique_genres = get_unique(genres, "genre").sort();
  document.getElementById("sect_head").innerHTML = "Genres";
  document.getElementById("sect_desc").innerHTML = "Please rate each of the following genres based on how much you like them:";
  tbl = document.createElement("table");
  tbl.id = "input_tbl";
  document.getElementById("inputs").appendChild(tbl);

  for(var i = 0; i < unique_genres.length; i++){
    tr = document.createElement("tr");
    td = document.createElement("td");
    tr.appendChild(td);
    td2 = document.createElement("td");
    tr.appendChild(td2);
    td.style = "padding-right:2vw;";

    td.innerHTML = unique_genres[i];

    selector = document.createElement("select");
    selector.id = unique_genres[i] + "_sel";
    option_0 = document.createElement("option");
    option_0.innerHTML = "Love";
    option_0.value = 2;
    selector.appendChild(option_0);
    option_1 = document.createElement("option");
    option_1.innerHTML = "Like";
    option_1.value = 1;
    selector.appendChild(option_1);
    option_2 = document.createElement("option");
    option_2.innerHTML = "Neutral";
    option_2.value = 0;
    selector.appendChild(option_2);
    option_3 = document.createElement("option");
    option_3.innerHTML = "Dislike";
    option_3.value = -1;
    selector.appendChild(option_3);
    option_4 = document.createElement("option");
    option_4.innerHTML = "Hate";
    option_4.value = -2;
    selector.appendChild(option_4);
    selector.value = 0;
    selector.onchange = function(e){
      console.log(this.value);
    }
    //selector.appendChild(document.createElement(""))
    td2.appendChild(selector);
    document.getElementById("input_tbl").appendChild(tr);
  }
}

document.getElementById("next").addEventListener('click', () =>{
  if(document.getElementById("sect_head").innerHTML == ""){
    add_genre_inputs();
  }
});
