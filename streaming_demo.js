var genres = null;
var ratings = null;
var data = [];
var genre_scores = {};
var rating_scores = {};
service_genres_counted_url = "https://raw.githubusercontent.com/zlee1/StreamingServiceAnalysis/master/data/modified/service_genres_counted.txt"
ratings_counted_url = "https://raw.githubusercontent.com/zlee1/StreamingServiceAnalysis/master/data/modified/ratings_counted.txt";

fetch(service_genres_counted_url)
    .then(response => response.text())
    .then(text => {
        genres = JSON.parse(text);
    });

fetch(ratings_counted_url)
    .then(response => response.text())
    .then(text => {
        ratings = JSON.parse(text);
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
  document.getElementById("sect_desc").innerHTML = "Please check the boxes for each of the following genres that you like:";
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

    genre_scores[unique_genres[i]] = 0;
    checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = unique_genres[i];
    checkbox.onclick = function(e){
      if(this.checked){
        selector_changed(this.id, 1, genres, "genre", genre_scores);
      }else{
        selector_changed(this.id, 0, genres, "genre", genre_scores);
      }
    }

    td2.appendChild(checkbox);

    document.getElementById("input_tbl").appendChild(tr);
  }
  y_values = [];

  x_values = get_unique(genres, "service").sort();

  var colors = [];

  for(var i = 0; i < x_values.length; i++){
    colors.push("rgba(0,0,0,1)");
    y_values.push(0.5);
  }

  data = [{
    x: x_values,
    y: y_values,
    marker: { color: colors},
    type: "bar",
    orientation: "v"  }];
  layout = {title: "Streaming Service Leaderboard", showlegend: false,
    yaxis: {title:"Service Score", showticklabels: false, range: [0,1]},
    xaxis: {showticklabels: true}};

  Plotly.newPlot("myPlot", data, layout, {staticPlot: true});
}

function add_rating_inputs(){
  document.getElementById("next").value = "Continue";
  clear_inputs();
  unique_ratings = get_unique(ratings, "rating").sort();
  document.getElementById("sect_head").innerHTML = "Ratings";
  document.getElementById("sect_desc").innerHTML = "Please check the boxes for each of the following ratings that you want:";
  tbl = document.createElement("table");
  tbl.id = "input_tbl";
  document.getElementById("inputs").appendChild(tbl);

  for(var i = 0; i < unique_ratings.length; i++){
    tr = document.createElement("tr");
    td = document.createElement("td");
    tr.appendChild(td);
    td2 = document.createElement("td");
    tr.appendChild(td2);
    td.style = "padding-right:2vw;";

    td.innerHTML = unique_ratings[i];

    rating_scores[unique_ratings[i]] = 0;
    checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = unique_ratings[i];
    checkbox.onclick = function(e){
      if(this.checked){
        selector_changed(this.id, 1, ratings, "rating", rating_scores);
      }else{
        selector_changed(this.id, 0, ratings, "rating", rating_scores);
      }
    }

    td2.appendChild(checkbox);

    document.getElementById("input_tbl").appendChild(tr);
  }
  y_values = [];

  x_values = get_unique(ratings, "service").sort();

  var colors = [];

  for(var i = 0; i < x_values.length; i++){
    colors.push("rgba(0,0,0,1)");
    y_values.push(0.5);
  }

  data = [{
    x: x_values,
    y: y_values,
    marker: { color: colors},
    type: "bar",
    orientation: "v"  }];
  layout = {title: "Streaming Service Leaderboard", showlegend: false,
    yaxis: {title:"Service Score", showticklabels: false, range: [0,1]}};

  Plotly.newPlot("myPlot", data, layout, {staticPlot: true});
}

function sigmoid(values){
  sum = 0;
  for(var i = 0; i < values.length; i++){
    sum += values[i];
  }
  avg = sum/values.length;

  for(var i = 0; i < values.length; i++){
    values[i] = 1/(1+Math.exp(-1*.5*((values[i])-avg/2)));
  }
  return values;
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
  update_plot(set, key, set_scores);
}

function update_plot(set, key, set_scores){
  var highest_index = 0;
  y_values = [];
  x_values = get_unique(set, "service").sort();
  colors = [];
  traces = [];

  for(var i = 0; i < x_values.length; i++){
    traces.push(0);
    colors.push("rgba(0,0,0,1)");
    y_values.push(rate_services(set, key, set_scores)[x_values[i]]);
    if(y_values[i] > y_values[highest_index] || i == highest_index){
      colors[highest_index] = "rgba(0,0,0,1)";
      highest_index = i;
      colors[highest_index] = "rgba(255, 236, 135, 1)";
    }else{
      colors[i] = "rgba(0,0,0,1)";
    }
  }

  y_values = sigmoid(y_values);

  console.log(data);

  Plotly.animate("myPlot", {
    data: [{
      x: x_values,
      y: y_values,
      marker: { color: colors},
      type: "bar",
      orientation: "v"  }],
    layout: {}
  },
  {
    transition: {
      duration: 500,
      easing: 'cubic-in-out'
    },
    frame: {
      duration: 500
    }
  });
}

document.getElementById("next").addEventListener('click', () =>{
  if(document.getElementById("sect_head").innerHTML == ""){
    add_genre_inputs();
  }else if(document.getElementById("sect_head").innerHTML == "Genres"){
    add_rating_inputs();
  }else if(document.getElementById("sect_head").innerHTML == "Ratings"){

  }
});
