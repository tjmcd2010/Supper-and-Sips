//get elemnts from the html
const mealSearchFormEl = document.querySelector("#meals-search-form");
const cocktailSearchFormEl = document.querySelector("#cocktail-search-form");
var mealTitleEl = document.querySelector("#meal-title");
var mealDesEl = document.querySelector("#meal-desc");
var mealIconEl = document.querySelector("#meal-image");

//get recepies by ingredient
const handleFormSubmit = function (event) {
    event.preventDefault();
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?f=a`;
    //const APIKey = "c01e24caedmsh48fd839b55c5d03p1e99bajsn2750a896533a";
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            const currentMeals = data.meals;
            currentMeals.forEach(dataPoint => {

                mealTitleEl.textContent = currentMeals.strMeal;
                mealDesEl.textContent = currentMeals.strInstructions;
                mealIconEl.src = currentMeals.strMealThumb;
            });
            
        });
};
//Function to adda event listeners to submit search and clicking city search buttons
function addEventListeners() {
    mealSearchFormEl.addEventListener("submit", handleFormSubmit);
    // cocktailSearchFormEl.addEventListener("click", handleFormSubmit);
}
//intitialising and calling the event listener functions
function init() {
    addEventListeners()
}

init();