//get elemnts from the html
const mealSearchFormEl = document.querySelector("#meals-search-form");
const cocktailSearchFormEl = document.querySelector("#cocktail-search-form");
const cocktailItemsDiv = document.getElementById('cocktail-recepies');
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
      if(event.key === "Escape") {
        closeAllModals();
      }
    });
  });
//get recepies by ingredient
const handleFormSubmit = function (event) {
    event.preventDefault();
    const url = `https://www.themealdb.com/api/json/v1/1/random.php`;
    //const APIKey = "c01e24caedmsh48fd839b55c5d03p1e99bajsn2750a896533a";
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(data=> displayFoods(data))
        const displayFoods = foods =>{
            const foodItemsDiv = document.getElementById('meal-recepies');
            
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


const handleFormSubmit1 = function (event) {
    event.preventDefault();
    const url = `https://www.thecocktaildb.com/api/json/v1/1/random.php`;
    //const APIKey = "c01e24caedmsh48fd839b55c5d03p1e99bajsn2750a896533a";
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(data=> displayCocktails(data))
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
//Function to adda event listeners to submit search and clicking city search buttons
function addEventListeners() {
    mealSearchFormEl.addEventListener("submit", handleFormSubmit);
     cocktailSearchFormEl.addEventListener("submit", handleFormSubmit1);
}
//intitialising and calling the event listener functions
function init() {
    addEventListeners()
}

init();