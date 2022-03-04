var genres = null;
var data = [];
var genre_scores = {};
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
    selector.id = unique_genres[i];
    option_0 = document.createElement("option");
    option_0.innerHTML = "Love";
    option_0.value = 3;
    selector.appendChild(option_0);
    option_1 = document.createElement("option");
    option_1.innerHTML = "Like";
    option_1.value = 2;
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
      selector_changed(this.id, this.value, genres, "genre", genre_scores);
    }
    genre_scores[unique_genres[i]] = selector.value;
    td2.appendChild(selector);

    document.getElementById("input_tbl").appendChild(tr);
  }
  x_values = [];

  y_values = get_unique(genres, "service").sort();

  var colors = [];

  for(var i = 0; i < y_values.length; i++){
    colors.push("rgba(0,0,0,1)");
    x_values.push(rate_services(genres, "genre", genre_scores)[y_values[i]]);
  }

  data = [{
    x: x_values,
    y: y_values,
    marker: { color: colors},
    type: "bar",
    orientation: "h"  }];
  layout = {title: "Streaming Service Leaderboard", showlegend: false,
    xaxis: {title:"Service Score", showticklabels: false}};

  Plotly.newPlot("myPlot", data, layout, {staticPlot: true});
}

function rate_services(set, key, user_scores){
  unique_services = get_unique(set, "service").sort();
  var service_scores = {};
  for(var i = 0; i < unique_services.length; i++){
    service_scores[unique_services[i]] = 0;
  }

  for(var i = 0; i < set[key].length; i++){
    service_scores[set["service"][i]] += set["percentage_of_total"][i]*user_scores[set[key][i]]*set["mean_score"][i];
  }
  return service_scores;
}

function selector_changed(id, new_value, set, key, set_scores){
  set_scores[id] = new_value;
  rate_services(set, key, set_scores);
  var highest_index = 0;
  x_values = [];
  y_values = get_unique(set, "service").sort();

  for(var i = 0; i < y_values.length; i++){
    x_values.push(rate_services(set, key, set_scores)[y_values[i]]);
    if(x_values[i] > x_values[highest_index]){
      data[0]["marker"]["color"][highest_index] = "rgba(0,0,0,1)";
      highest_index = i;
      data[0]["marker"]["color"][highest_index] = "rgba(255, 236, 135, 1)";
    }else{
      data[0]["marker"]["color"][i] = "rgba(0,0,0,1)";
    }
  }

  data[0]["x"] = x_values;
  data[0]["y"] = y_values;

  Plotly.redraw("myPlot");
}

document.getElementById("next").addEventListener('click', () =>{
  if(document.getElementById("sect_head").innerHTML == ""){
    add_genre_inputs();
  }
});
