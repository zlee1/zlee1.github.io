service_genres_counted_url = "https://raw.githubusercontent.com/zlee1/StreamingServiceAnalysis/master/data/modified/service_genres_counted.txt"
var genres = null;

fetch(service_genres_counted_url)
    .then(response => response.text())
    .then(text => {
        genres = JSON.parse(text);
        console.log(genres);
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

document.getElementById("get_genres").addEventListener('click', () =>{
  console.log(get_by_service("hbo", "genre", genres));
});
