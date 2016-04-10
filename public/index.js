var host ='http://pokeapi.co'
var nextPath = '/api/v1/pokemon/?limit=12';
var avatarSrc = id => "http://pokeapi.co/media/img/"+id+".png";
var tpItem = item => '<li class="type type--'+item.name+'">'+item.name+"</li>";
var tpList = list => list.reduce((r, i)=>(r+tpItem(i)),"");
function getPokemon(callback) {

  var myReq = new XMLHttpRequest();
  myReq.onreadystatechange = function(){
    if (myReq.readyState !== XMLHttpRequest.DONE || myReq.status !== 200) return;

    var resp = JSON.parse(myReq.responseText);

    nextPath=resp.meta.next;
    callback(resp.objects);
  }
  myReq.open('GET', host+nextPath);
  myReq.send();

}
var pokemons =[];
function loadPokemons(templ, callback) {

  getPokemon(function(list) {
    var page =list.reduce(function(result, pokemon){      
      pokemons.push(pokemon);
      return result+templ.replace("%name%", pokemon.name)
        .replace("%ava%", avatarSrc(pokemon.pkdx_id))
        .replace("%types%", tpList(pokemon.types))
        .replace("%id%", pokemon.pkdx_id)

    }, "")
    document.getElementById('pokCollection').insertAdjacentHTML('beforeend', page);
    if(callback){
      callback();

    }
  });

}
function showDetails(id) {
  var pokemon = pokemons.find(pokemon => pokemon.pkdx_id == id);
  var tmplPokemon = document.getElementById('showDetails').innerText;
  var content =  tmplPokemon.replace("%ava%", avatarSrc(pokemon.pkdx_id))
    .replace("%name%",pokemon.name)
    .replace("%id%", pokemon.pkdx_id)
    .replace("%types%", tpList(pokemon.types))
    .replace("%attack%", pokemon.attack)
    .replace("%defense%", pokemon.defense)
    .replace("%hp%", pokemon.hp)
    .replace("%sp_atk%", pokemon.sp_atk)
    .replace("%sp_def%", pokemon.sp_def)
    .replace("%speed%", pokemon.speed)
    .replace("%weight%", pokemon.weight)
    .replace("%totalMoves%", pokemon.moves.length);

  document.getElementById('pokemonDetails').innerHTML = content; 
}
window.onload = function(){
  var templ = document.getElementById('pokedexTempl').innerText;
  var btn=document.getElementById('loadMore');
  var onBtnClick = function(){
    btn.style.visibility = "hidden";
    loadPokemons(templ, function(){
      if(nextPath){
        btn.style.visibility = "visible";
      }
    });
  }
  btn.onclick = onBtnClick;
  onBtnClick();
}
