service_genres_counted_url = "https://raw.githubusercontent.com/zlee1/StreamingServiceAnalysis/master/data/modified/service_genres_counted.txt"
var genres = null;

fetch(service_genres_counted_url)
    .then(response => response.text())
    .then(text => {
        genres = JSON.parse(text);
        console.log(genres);
    });

function get_service_genres(service){
  console.log(genres);
  for(var i = 0; i < genres.service.length; i++){
    if(genres.service[i] == service){
      console.log(genres.genre[i] + ": " + genres.percentage_of_total[i]);
    }
  }
}

document.getElementById("get_genres").addEventListener('click', () =>{
  get_service_genres("hbo");
});
