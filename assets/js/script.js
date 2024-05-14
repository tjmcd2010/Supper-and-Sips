//get elemnts from the html
const mealSearchFormEl = document.querySelector("#meals-search-form");
const cocktailSearchFormEl = document.querySelector("#cocktail-search-form");

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
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?f=a`;
    //const APIKey = "c01e24caedmsh48fd839b55c5d03p1e99bajsn2750a896533a";
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(data=> displayFoods(data))
        const displayFoods = foods =>{
            const foodItemsDiv = document.getElementById('meal-recepies');
            
            foods.meals.forEach(meal=>{
            
                const foodDiv = document.createElement('div');
            
                foodDiv.className = 'meal';
                const foodInfo = `
                <h3>${meal.strMeal}</h3>
            
                `;
                foodDiv.innerHTML = foodInfo;
                foodItemsDiv.appendChild(foodDiv);
            });
            }
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