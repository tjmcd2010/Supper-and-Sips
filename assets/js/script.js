//get elemnts from the html Doc:
const mealSearchFormEl = document.querySelector("#meals-search-form");
const cocktailSearchFormEl = document.querySelector("#cocktail-search-form");
const cocktailItemsDiv = document.getElementById('cocktail-recepies');
const favoriteMealContainerEl = document.getElementById("fav-meals");
const favMealButtonEl = document.getElementById("fav-btn-meals");
const mealPopup = document.getElementById("meal-popup");
const mealInfoEl = document.getElementById("meal-info");
const popupCloseBtn = document.getElementById("close-popup");
const favoriteSipContainerEl = document.getElementById("fav-cocktails");
const favSipButtonEl = document.getElementById("fav-btn-sips");

//calling the function to display favourite meals in the page
fetchFavMeals();

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
//remove data from localStorage
function removeMealLS(mealId) {
  const mealIds = getMealsLS();

  localStorage.setItem(
      "mealIds",
      JSON.stringify(mealIds.filter((currentmealId) => currentmealId !== mealId))
  );
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
//get meals by using the random API
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
//get the meals by using the Mealid
async function getMealById(currentmealId) {
  const resp = await fetch(
      "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + currentmealId
  );

  const respData = await resp.json();
  const meal = respData.meals[0];

  return meal;
}

///////////
//function to fetch all favourite meals
async function fetchFavMeals() {
  favoriteMealContainerEl.innerHTML = "";

  const mealIds = getMealsLS();

  for (let i = 0; i < mealIds.length; i++) {
      const mealId = mealIds[i];
      meal = await getMealById(mealId);

      addMealFav(meal);
  }
}
//function to display favourite meals in the main section
function addMealFav(mealData) {
  const favMeal = document.createElement("li");

  favMeal.innerHTML = `
      <img
          src="${mealData.strMealThumb}"
          alt="${mealData.strMeal}"/><span>${mealData.strMeal}</span>
      <button class="clear"><i class="fas fa-window-close"></i></button>`;

  const btn = favMeal.querySelector(".clear");

  btn.addEventListener("click", () => {
      removeMealLS(mealData.idMeal);

      fetchFavMeals();
  });

 favMeal.addEventListener("click", () => {
      showMealInfo(mealData);
  });

  favoriteMealContainerEl.appendChild(favMeal);
}
//Function to popup Meal Info for the favourite Meal selected
function showMealInfo(mealData) {
    mealInfoEl.innerHTML = "";

    const mealEl = document.createElement("div");

    const ingredients = [];

    for (let i = 1; i <= 20; i++) {
        if (mealData["strIngredient" + i]) {
            ingredients.push(`${mealData["strIngredient" + i]} - ${mealData["strMeasure" + i]}`);
        }
        else {
            break;
        }
    }

    mealEl.innerHTML = `
        <h1>${mealData.strMeal}</h1>
        <img
            src="${mealData.strMealThumb}"
            alt="${mealData.strMeal}"/>
        <p>${mealData.strInstructions}</p>
        <h3>Ingredients:</h3>
        <ul>${ingredients.map((ing) => `<li>${ing}</li>`).join("")}</ul>`;

    mealInfoEl.appendChild(mealEl);

    mealPopup.classList.remove("hidden");
}
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
popupCloseBtn.addEventListener("click", () => {
  mealPopup.classList.add("hidden");
});