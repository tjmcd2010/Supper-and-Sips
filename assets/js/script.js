//get elemnts from the html Doc:
const mealSearchFormEl = document.querySelector("#meals-search-form");
const cocktailSearchFormEl = document.querySelector("#cocktail-search-form");
const cocktailItemsDiv = document.getElementById('cocktail-recepies');
const favoriteMealContainerEl = document.getElementById("fav-meals");
const favMealButtonEl = document.getElementById("fav-btn-meals");
const favoriteSipContainerEl = document.getElementById("fav-cocktails");
const favSipButtonEl = document.getElementById("fav-btn-sips");
//read MealID's from localStorage
let currentmealId;
function getMealsLS() {
  const mealIds = JSON.parse(localStorage.getItem("mealIds"));
  return mealIds? mealIds:[];
}
//Store MealID into Local Storage
function addMealLS(mealId) {
  const mealIds = getMealsLS();
  localStorage.setItem("mealIds", JSON.stringify([...mealIds, mealId]));
}

//Open Modal Form
document.addEventListener('DOMContentLoaded', () => {
  // Functions to open and close a modal
  function openModal($el) {
    $el.classList.add('is-active');
  }

  function closeModal($el) {
    $el.classList.remove('is-active');
  }

  function closeAllModals() {
    (document.querySelectorAll('.modal') || []).forEach(($modal) => {
      closeModal($modal);
    });
  }

  // Add a click event on buttons to open a specific modal
  (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
    const modal = $trigger.dataset.target;
    const $target = document.getElementById(modal);

    $trigger.addEventListener('click', () => {
      openModal($target);
    });
  });

  // Add a click event on various child elements to close the parent modal
  (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
    const $target = $close.closest('.modal');

    $close.addEventListener('click', () => {
      closeModal($target);
    });
  });

  // Add a keyboard event to close all modals
  document.addEventListener('keydown', (event) => {
    if (event.key === "Escape") {
      closeAllModals();
    }
  });
});
//Function to handle Random Meal form submit
const handleFormSubmit = function (event) {
  event.preventDefault();
  const url = `https://www.themealdb.com/api/json/v1/1/random.php`;
  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(data => displayFoods(data))
  
  const displayFoods = foods => {
    const foodItemsDiv = document.getElementById('meal-recepies');
    currentmealId = foods.meals[0].idMeal;
    foods.meals.forEach(meal => {
      const foodDiv = document.createElement('div');
      foodDiv.className = 'eal';
      foodDiv.innerHTML = `
                    <div class="meal-image">
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" max height="250px" width="250px">
                    </div>
                    <div class="meal-info">
                        <h3>${meal.strMeal}</h3>
                        <p>${meal.strInstructions}</p>
                    </div>
                    <div class="meal-buttons">
                        <a href="${meal.strYoutube}" target="_blank" class="button is-primary is-rounded">Watch Video</a>
                    `;
      foodItemsDiv.appendChild(foodDiv);
    });
  }
};

//Function to handle Random Sip from form Submit
const handleFormSubmit1 = function (event) {
  event.preventDefault();
  //url to get a random cocktail from the cocktailDB API
  const url = `https://www.thecocktaildb.com/api/json/v1/1/random.php`;
  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(data => displayCocktails(data))
  const displayCocktails = cocktails => {
    cocktails.drinks.forEach(cocktail => {
      const cocktailDiv = document.createElement('div');
      cocktailDiv.className = 'eal';
      cocktailDiv.innerHTML = `
                    <div class="cocktail-image">
                        <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}" max height="250px" width="250px">
                    </div
                    <div class="cocktail-info">
                        <h3>${cocktail.strDrink}</h3>
                        <p>${cocktail.strInstructions}</p>
                        </div>
                        <div class="cocktail-buttons">
                            <a href="${cocktail.strYoutube}" target="_blank" class="button is-primary is-rounded">Watch Video</a>
                            `;
      cocktailItemsDiv.appendChild(cocktailDiv);
    });
  }
}
//Function to adda event listeners to submit search and clicking form buttons
function addEventListeners() {
  mealSearchFormEl.addEventListener("submit", handleFormSubmit);
  cocktailSearchFormEl.addEventListener("submit", handleFormSubmit1);
}
//intitialising and calling the event listener functions
function init() {
  addEventListeners()
}
init();
//function to add event listener to the save button

favMealButtonEl.addEventListener("click", function(){
  if (currentmealId !== null){
    addMealLS(currentmealId);
    currentmealId = null;
  }
});  