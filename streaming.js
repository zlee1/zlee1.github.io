service_genres_counted_url = "https://raw.githubusercontent.com/zlee1/StreamingServiceAnalysis/master/data/modified/service_genres_counted.txt"
ratings_counted_url = "https://raw.githubusercontent.com/zlee1/StreamingServiceAnalysis/master/data/modified/ratings_counted.txt";
decades_counted_url = "https://raw.githubusercontent.com/zlee1/StreamingServiceAnalysis/master/data/modified/decades.txt"

order = ["genre", "rating", "decade"];

scores = {};
sets = {};
weights = {};
for(var i = 0; i < order.length; i++){
  weights[order[i]] = 1;
}

fetch(service_genres_counted_url)
    .then(response => response.text())
    .then(text => {
        sets["genre"] = JSON.parse(text);
    });

fetch(ratings_counted_url)
    .then(response => response.text())
    .then(text => {
        sets["rating"] = JSON.parse(text);
    });

fetch(decades_counted_url)
    .then(response => response.text())
    .then(text => {
        sets["decade"] = JSON.parse(text);
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
  document.getElementById("info").innerHTML = "";
  document.getElementById("inputs").innerHTML = "";
  document.getElementById("sect_head").innerHTML = "";
  document.getElementById("sect_desc").innerHTML = "";
}

function add_inputs(key){
  set = sets[key];
  if(scores[key] != undefined){
    set_scores = scores[key];
  }else{
    set_scores = {};
  }
  document.getElementById("next").value = "Continue";
  clear_inputs();
  unique = get_unique(set, key).sort();
  document.getElementById("sect_head").innerHTML = key.toUpperCase() + "S";
  document.getElementById("sect_desc").innerHTML = "Please check the boxes for each of the following " + key + "s that you want:";
  tbl = document.createElement("table");
  tbl.id = "input_tbl";
  document.getElementById("inputs").appendChild(tbl);

  if(key == "rating"){
    unique = ['G', 'PG', 'PG-13', 'R', 'NC-17', 'NR'];
  }

  for(var i = 0; i < unique.length; i++){
    tr = document.createElement("tr");
    td = document.createElement("td");
    tr.appendChild(td);
    td2 = document.createElement("td");
    tr.appendChild(td2);
    td.style = "padding-right:2vw;";

    td.innerHTML = unique[i];
    checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = unique[i];
    if(unique[i] in set_scores){
      if(set_scores[unique[i]] == 1){
        checkbox.checked = true;
      }
    }else{
      set_scores[unique[i]] = 0;
    }

    checkbox.onclick = function(e){
      if(this.checked){
        selector_changed(this.id, 1, set, key);
      }else{
        selector_changed(this.id, 0, set, key);
      }
    }

    td2.appendChild(checkbox);

    document.getElementById("input_tbl").appendChild(tr);
  }

  scores[key] = set_scores;

  y_values = [];

  x_values = get_unique(set, "service").sort();

  var colors = [];

  for(var i = 0; i < x_values.length; i++){
    colors.push("#777777");
    y_values.push(0.001);
    x_values[i] = x_values[i].charAt(0).toUpperCase() + x_values[i].slice(1);
  }

  data = [{
    x: x_values,
    y: y_values,
    marker: { color: colors},
    type: "bar",
    orientation: "v"  }];
  layout = {
    title: "<b>Streaming Service Leaderboard for " + key.charAt(0).toUpperCase() + key.slice(1) + "s</b>",
    showlegend: false,
    yaxis: {title:"sigmoid(Service Score)", showticklabels: true, range: [0,1]},
    xaxis: {showticklabels: true},
    plot_bgcolor: "rgba(0,0,0,0)",
    paper_bgcolor: "rgba(0,0,0,0)",
    font: {color: "#dddddd"}};

  Plotly.newPlot("myPlot", data, layout, {staticPlot: true});
  update_plot(set, key);
}

function add_weight_inputs(){
  document.getElementById("next").value = "Finish";
  clear_inputs();
  tbl = document.createElement("table");
  tbl.id = "input_tbl";
  document.getElementById("inputs").appendChild(tbl);
  document.getElementById("sect_head").innerHTML = "WEIGHING FEATURES";
  document.getElementById("sect_desc").innerHTML = "Please rate how important each of the following features are to you.";

  for(var i = 0; i < order.length; i++){
    tr = document.createElement("tr");
    td = document.createElement("td");
    tr.appendChild(td);
    td2 = document.createElement("td");
    tr.appendChild(td2);
    td.style = "padding-right:2vw;";

    td.innerHTML = order[i].charAt(0).toUpperCase() + order[i].slice(1);

    selector = document.createElement("select");
    selector.id = order[i];
    option_0 = document.createElement("option");
    option_0.innerHTML = "Very important";
    option_0.value = 3;
    selector.appendChild(option_0);
    option_1 = document.createElement("option");
    option_1.innerHTML = "Important";
    option_1.value = 2;
    selector.appendChild(option_1);
    option_2 = document.createElement("option");
    option_2.innerHTML = "Not very important";
    option_2.value = 1;
    selector.appendChild(option_2);
    option_3 = document.createElement("option");
    option_3.innerHTML = "Doesn't matter at all";
    option_3.value = 0;
    selector.appendChild(option_3);

    selector.value = 1;
    selector.onchange = function(e){
      weights[this.id] = parseInt(this.value);
      update_final_score_plot();
    }
    td2.appendChild(selector);

    document.getElementById("input_tbl").appendChild(tr);
  }

  final_scores = get_final_scores();

  x_values = [];
  y_values = [];
  for (const key in final_scores) {
    y_values.push(final_scores[key]);
    x_values.push(key);
  }

  var colors = [];

  for(var i = 0; i < x_values.length; i++){
    colors.push("#777777");
    x_values[i] = x_values[i].charAt(0).toUpperCase() + x_values[i].slice(1);
  }

  max_y = 0;
  for (var i = 0; i < y_values.length; i++) {
    if(y_values[i] > max_y){
      max_y = y_values[i];
    }
  }

  data = [{
    x: x_values,
    y: y_values,
    marker: { color: colors},
    type: "bar",
    orientation: "v"  }];
  layout = {
    title: "<b>Overall Streaming Service Leaderboard</b>",
    showlegend: false,
    yaxis: {title:"Sum of Weighted Scores For Each Feature", showticklabels: true, range:[0,max_y]},
    xaxis: {showticklabels: true},
    plot_bgcolor: "rgba(0,0,0,0)",
    paper_bgcolor: "rgba(0,0,0,0)",
    font: {color: "#dddddd"}};

  Plotly.newPlot("myPlot", data, layout, {staticPlot: true});
  update_final_score_plot();
}

function get_final_scores(){
  all_scores = {};
  services = get_unique(sets["decade"], "service").sort();
  for(var i = 0; i < order.length; i++){
    all_scores[order[i]] = weight(order[i], normalize(rate_services(sets[order[i]], order[i])));
  }

  summed_scores = {};
  for (var i = 0; i < services.length; i++) {
    s = 0;
    for(var j = 0; j < order.length; j++){
      s += all_scores[order[j]][services[i]];
    }
    summed_scores[services[i]] = s;
  }

  return summed_scores;
}

function weight(key, set){
  values = [];
  keys = [];
  for (const key in set) {
    values.push(set[key]);
    keys.push(key);
  }

  for (var i = 0; i < values.length; i++) {
    values[i] *= weights[key]/2;
  }

  weighted = {};

  for (var i = 0; i < keys.length; i++) {
    weighted[keys[i]] = values[i];
  }
  return weighted;
}

function normalize(set){
  values = [];
  keys = [];
  for (const key in set) {
    values.push(set[key]);
    keys.push(key);
  }
  max = values[0];
  min = values[0];
  sum = 0;
  for(var i = 0; i < values.length; i++){
    sum += values[i];
    if(values[i] > max){
      max = values[i];
    }

    if(values[i] < min){
      min = values[i];
    }
  }
  avg = sum/values.length;

  for(var i = 0; i < values.length; i++){
    values[i] = (values[i]-min)/(max-min);
  }

  normalized = {};

  for (var i = 0; i < keys.length; i++) {
    normalized[keys[i]] = values[i];
  }
  return normalized;
}

function update_final_score_plot(){
  final_scores = get_final_scores();

  var highest_index = 0;

  x_values = [];
  y_values = [];
  for (const key in final_scores) {
    if(!final_scores[key] > 0){
      y_values.push(0);
    }else{
      y_values.push(final_scores[key]);
    }
    x_values.push(key.charAt(0).toUpperCase() + key.slice(1));
  }

  colors = [];
  traces = [];
  all_same = true;

  for(var i = 0; i < x_values.length; i++){

    traces.push(0);
    colors.push("#777777");
    if(y_values[highest_index] != y_values[i]){
      all_same = false;
    }
    if(y_values[i] > y_values[highest_index] || i == highest_index){
      colors[highest_index] = "#777777";
      highest_index = i;
      colors[highest_index] = "rgba(125, 239, 132, 1)";
    }else{
      colors[i] = "#777777";
    }
  }

  if(all_same){
    for(var i = 0; i < colors.length; i++){
      colors[i] = "#777777";
    }
  }


  Plotly.animate("myPlot", {
    data: [{
      x: x_values,
      y: y_values,
      marker: { color: colors},
      type: "bar",
      orientation: "v"  }]
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
  Plotly.animate("myPlot", {
    layout: {yaxis:{range:[0,y_values[highest_index]]}}
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

function sigmoid(values){
  sum = 0;
  for(var i = 0; i < values.length; i++){
    sum += values[i];
  }
  avg = sum/values.length;

  for(var i = 0; i < values.length; i++){
    values[i] = 1/(1+Math.exp(-1*((values[i])-5)));
  }
  return values;
}

function rate_services(set, key){
  user_scores = scores[key];
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

function selector_changed(id, new_value, set, key){
  scores[key][id] = new_value;
  rate_services(set, key);
  update_plot(set, key);
}

function update_plot(set, key, plot_name="myPlot"){
  set_scores = scores[key];
  var highest_index = 0;
  y_values = [];
  x_values = get_unique(set, "service").sort();
  colors = [];
  traces = [];
  all_same = true;

  for(var i = 0; i < x_values.length; i++){

    traces.push(0);
    colors.push("#777777");
    y_values.push(rate_services(set, key, set_scores)[x_values[i]]);
    if(y_values[highest_index] != y_values[i]){
      all_same = false;
    }
    if(y_values[i] > y_values[highest_index] || i == highest_index){
      colors[highest_index] = "#777777";
      highest_index = i;
      colors[highest_index] = "rgba(125, 239, 132, 1)";
    }else{
      colors[i] = "#777777";
    }
    x_values[i] = x_values[i].charAt(0).toUpperCase() + x_values[i].slice(1);
  }

  if(all_same){
    for(var i = 0; i < colors.length; i++){
      colors[i] = "#777777";
    }
  }

  y_values = sigmoid(y_values);

  Plotly.animate(plot_name, {
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

function generate_final_plots(){
  traces = [];
  for (var i = 0; i < order.length; i++) {
    set = sets[order[i]];
    x_values = [];
    y_values = [];
    colors = [];

    set_scores = scores[order[i]];
    var highest_index = 0;
    x_values = get_unique(set, "service").sort();
    all_same = true;

    for(var j = 0; j < x_values.length; j++){
      colors.push("#777777");
      y_values.push(rate_services(set, order[i], set_scores)[x_values[j]]);
      if(y_values[highest_index] != y_values[j]){
        all_same = false;
      }
      if(y_values[j] > y_values[highest_index] || j == highest_index){
        colors[highest_index] = "#777777";
        highest_index = j;
        colors[highest_index] = "rgba(125, 239, 132, 1)";
      }else{
        colors[j] = "#777777";
      }
      x_values[j] = x_values[j].charAt(0).toUpperCase() + x_values[j].slice(1);
    }

    if(all_same){
      for(var k = 0; k < colors.length; k++){
        colors[j] = "#777777";
      }
    }
    traces.push([x_values,y_values,colors]);
  }
  final_scores = get_final_scores();

  var highest_index = 0;

  x_values = [];
  y_values = [];
  for (const key in final_scores) {
    if(!final_scores[key] > 0){
      y_values.push(0);
    }else{
      y_values.push(final_scores[key]);
    }
    x_values.push(key.charAt(0).toUpperCase() + key.slice(1));
  }

  colors = [];
  all_same = true;

  for(var i = 0; i < x_values.length; i++){

    colors.push("#777777");
    if(y_values[highest_index] != y_values[i]){
      all_same = false;
    }
    if(y_values[i] > y_values[highest_index] || i == highest_index){
      colors[highest_index] = "#777777";
      highest_index = i;
      colors[highest_index] = "rgba(125, 239, 132, 1)";
    }else{
      colors[i] = "#777777";
    }
  }

  if(all_same){
    for(var i = 0; i < colors.length; i++){
      colors[i] = "#777777";
    }
  }
  traces.push([x_values, y_values,colors]);
  console.log(traces);

  document.getElementById("tbl").remove();
  if(!all_same){
    info_str = "<p>While all of these streaming services are very good options, <br><b>"
    switch(x_values[highest_index]){
      case "Netflix":
        info_str += "<a href=https://netflix.com>Netflix</a>";
        break;
      case "Amazon":
        info_str += "<a href=https://www.amazon.com/gp/video/getstarted/ref=atv_lnk_web_prime>Amazon Prime Video</a>";
        break;
      case "Hulu":
        info_str += "<a href=https://hulu.com>Hulu</a>";
        break;
      case "Hbo":
        info_str += "<a href=https://hbomax.com>HBO Max</a>";
        break;
      case "Disney":
        info_str += "<a href=https://disneyplus.com>Disney+</a>";
        break;
      default:
        break;
    }
    info_str += "</b><br>seems like the best option for you based on the preferences provided.<br><a href=capstone.html>Restart?</a></p>";

    document.getElementById("info").innerHTML = info_str;
  }

  data = [{
    x: traces[0][0],
    y: traces[0][1],
    marker: { color: traces[0][2]},
    type: "bar",
    orientation: "v"  }];
  layout = {
    autosize: false,
    width: 700,
    height: 300,
    title: "<b>Streaming Service Leaderboard for Genres</b>",
    showlegend: false,
    yaxis: {title:"Service Score", showticklabels: true},
    xaxis: {showticklabels: true},
    plot_bgcolor: "rgba(0,0,0,0)",
    paper_bgcolor: "rgba(0,0,0,0)",
    font: {color: "#dddddd"}};

  Plotly.newPlot("plot1", data, layout, {staticPlot: true});

  data = [{
    x: traces[1][0],
    y: traces[1][1],
    marker: { color: traces[1][2]},
    type: "bar",
    orientation: "v"  }];
  layout = {
    autosize: false,
    width: 700,
    height: 300,
    title: "<b>Streaming Service Leaderboard for Ratings</b>",
    showlegend: false,
    yaxis: {title:"Service Score", showticklabels: true},
    xaxis: {showticklabels: true},
    plot_bgcolor: "rgba(0,0,0,0)",
    paper_bgcolor: "rgba(0,0,0,0)",
    font: {color: "#dddddd"}};

  Plotly.newPlot("plot2", data, layout, {staticPlot: true});

  data = [{
    x: traces[2][0],
    y: traces[2][1],
    marker: { color: traces[2][2]},
    type: "bar",
    orientation: "v"  }];
  layout = {
    autosize: false,
    width: 700,
    height: 300,
    title: "<b>Streaming Service Leaderboard for Decades</b>",
    showlegend: false,
    yaxis: {title:"Service Score", showticklabels: true},
    xaxis: {showticklabels: true},
    plot_bgcolor: "rgba(0,0,0,0)",
    paper_bgcolor: "rgba(0,0,0,0)",
    font: {color: "#dddddd"}};

  Plotly.newPlot("plot3", data, layout, {staticPlot: true});

  data = [{
    x: traces[3][0],
    y: traces[3][1],
    marker: { color: traces[3][2]},
    type: "bar",
    orientation: "v"  }];
  layout = {
    autosize: false,
    width: 700,
    height: 300,
    title: "<b>Overall Streaming Service Leaderboard</b>",
    showlegend: false,
    yaxis: {title:"Sum of Weighted Scores For Each Feature", showticklabels: true},
    xaxis: {showticklabels: true},
    plot_bgcolor: "rgba(0,0,0,0)",
    paper_bgcolor: "rgba(0,0,0,0)",
    font: {color: "#dddddd"}};

  Plotly.newPlot("plot4", data, layout, {staticPlot: true});
}

function final_screen(){
  clear_inputs();
  document.getElementById("td_sect").remove();
  generate_final_plots();
}

document.getElementById("back").addEventListener('click', () =>{
  if(document.getElementById("sect_head").innerHTML == ""){
    location.href = "index.html";
  }else if(document.getElementById("sect_head").innerHTML == order[0].toUpperCase() + "S"){
    location.href = "capstone.html";
  }else if(document.getElementById("sect_head").innerHTML == order[1].toUpperCase() + "S"){
    add_inputs(order[0]);
  }else if(document.getElementById("sect_head").innerHTML == order[2].toUpperCase() + "S"){
    add_inputs(order[1])
  }else if(document.getElementById("sect_head").innerHTML == "WEIGHING FEATURES"){
    add_inputs(order[2])
  }
});

document.getElementById("next").addEventListener('click', () => {
  if(document.getElementById("sect_head").innerHTML == ""){
    add_inputs(order[0]);
  }else if(document.getElementById("sect_head").innerHTML == order[0].toUpperCase() + "S"){
    add_inputs(order[1]);
  }else if(document.getElementById("sect_head").innerHTML == order[1].toUpperCase() + "S"){
    add_inputs(order[2]);
  }else if(document.getElementById("sect_head").innerHTML == order[2].toUpperCase() + "S"){
    add_weight_inputs();
  }else if(document.getElementById("next").value == "Restart"){
    location.href = "capstone.html";
  }else{
    final_screen();
    document.getElementById("back").remove();
    document.getElementById("next").remove();
  }
});
