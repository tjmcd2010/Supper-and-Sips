//get recepies by ingredient
const formSubmitHandler = function (event) {
const url = `https://themealdb.p.rapidapi.com/filter.php?f=a`;
const APIKey = "c01e24caedmsh48fd839b55c5d03p1e99bajsn2750a896533a";
fetch(url)
.then(res=>res.json())
.then(data=> displayFoods(data.meals)) // data.meals instead of data
.then(function (response) {
    return response.json();  
})
.then(function (data){
    console.log(data);
})
};