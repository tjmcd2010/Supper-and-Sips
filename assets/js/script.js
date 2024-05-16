// Get elements from the HTML
const mealSearchFormEl = document.querySelector("#meals-search-form");
const cocktailSearchFormEl = document.querySelector("#cocktail-search-form");
const cocktailItemsDiv = document.getElementById('cocktail-recepies');
const favoriteMealContainerEl = document.getElementById("fav-meals");
const favMealButtonEl = document.getElementById("fav-btn-meals");
const favoriteSipContainerEl = document.getElementById("fav-cocktails");
const favSipButtonEl = document.getElementById("fav-btn-sips");

// Read MealID's from localStorage
let currentmealId;
function getMealsLS() {
  const mealIds = JSON.parse(localStorage.getItem("mealIds"));
  return mealIds ? mealIds : [];
}

// Store MealID into Local Storage
function addMealLS(mealId) {
  const mealIds = getMealsLS();
  localStorage.setItem("mealIds", JSON.stringify([...mealIds, mealId]));
}

// Get ingredient list
const getIngredients = (item) => {
  let ingredients = [];
  for (let i = 1; i <= 15; i++) {
    if (item[`strIngredient${i}`]) {
      const ingredientName = item[`strIngredient${i}`];
      const ingredientMeasure = item[`strMeasure${i}`] || '';
      const ingredientImage = `https://www.themealdb.com/images/ingredients/${ingredientName}-Small.png`;
      ingredients.push({
        name: ingredientName,
        measure: ingredientMeasure,
        image: ingredientImage
      });
    }
  }
  return ingredients;
};

// Sample function to fetch meal data and populate the modal
async function fetchMealData() {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    const data = await response.json();
    const meal = data.meals[0];
    
    const mealModalBody = document.getElementById('meal-recepies');
    mealModalBody.innerHTML = `
      <h3>${meal.strMeal}</h3>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      <p>${meal.strInstructions}</p>
    `;
  }
  
  // Sample function to fetch cocktail data and populate the modal
  async function fetchCocktailData() {
    const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php');
    const data = await response.json();
    const cocktail = data.drinks[0];
    
    const cocktailModalBody = document.getElementById('cocktail-recepies');
    cocktailModalBody.innerHTML = `
      <h3>${cocktail.strDrink}</h3>
      <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}">
      <p>${cocktail.strInstructions}</p>
    `;
  }

document.addEventListener('DOMContentLoaded', () => {
  // Get all modal trigger buttons
  const modalTriggers = document.querySelectorAll('.js-modal-trigger');
  
  // Add event listeners to each trigger button
  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (event) => {
      const targetModal = event.currentTarget.dataset.target;
      openModal(targetModal);
    });
  });
  
  // Function to open modal
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'block';
    }
  }
  
  // Function to close modal
  function closeModal(modal) {
    modal.style.display = 'none';
  }
  
  // Add event listeners to all close buttons
  document.querySelectorAll('.modal .delete').forEach(closeButton => {
    const modal = closeButton.closest('.modal');
    closeButton.addEventListener('click', () => closeModal(modal));
  });
  
  // Add event listeners to modal backgrounds to close modal when clicking outside
  document.querySelectorAll('.modal-background').forEach(background => {
    const modal = background.closest('.modal');
    background.addEventListener('click', () => closeModal(modal));
  });
  
  // Sample function to fetch meal data and populate the modal
  async function fetchMealData() {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    const data = await response.json();
    const meal = data.meals[0];
    
    const mealModalBody = document.getElementById('meal-recipes');
    mealModalBody.innerHTML = `
      <h3>${meal.strMeal}</h3>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      <p>${meal.strInstructions}</p>
    `;
  }
  
  // Sample function to fetch cocktail data and populate the modal
  async function fetchCocktailData() {
    const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php');
    const data = await response.json();
    const cocktail = data.drinks[0];
    
    const cocktailModalBody = document.getElementById('cocktail-recipes');
    cocktailModalBody.innerHTML = `
      <h3>${cocktail.strDrink}</h3>
      <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}">
      <p>${cocktail.strInstructions}</p>
    `;
  }
  
  // Add event listeners to the meal and cocktail buttons
  document.querySelector('[data-target="modal-supper"]').addEventListener('click', fetchMealData);
  document.querySelector('[data-target="modal-sip"]').addEventListener('click', fetchCocktailData);
});


// Function to handle Random Meal form submit
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
      const ingredientsList = getIngredients(meal);
      const foodDiv = document.createElement('div');
      foodDiv.className = 'meal';
      foodDiv.innerHTML = `
        <div class="meal-image">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" style="max-height:250px; width:250px;">
        </div>
        <div class="meal-info">
            <h3><b>${meal.strMeal}</b></h3>
            <p>${meal.strInstructions}</p>
            <h4><b>Ingredients:</b></h4>
            <ul>${ingredientsList.map(ingredient => `
                <li>
                    <img src="${ingredient.image}" alt="${ingredient.name}" style="height: 50px; width: 50px;">
                    <b>${ingredient.name}</b> - ${ingredient.measure}
                </li>`).join('')}
            </ul>
        </div>`;
      foodItemsDiv.appendChild(foodDiv);
    });
  }
};

// Function to handle Random Sip from form Submit
const handleFormSubmit1 = function (event) {
  event.preventDefault();
  const url = `https://www.thecocktaildb.com/api/json/v1/1/random.php`;
  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(data => displayCocktails(data))
  
  const displayCocktails = cocktails => {
    cocktails.drinks.forEach(cocktail => {
      const ingredientsList = getIngredients(cocktail);
      const cocktailDiv = document.createElement('div');
      cocktailDiv.className = 'cocktail';
      cocktailDiv.innerHTML = `
        <div class="cocktail-image">
            <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}" style="max-height:250px; width:250px;">
        </div>
        <div class="cocktail-info">
            <h3><b>${cocktail.strDrink}</b></h3>
            <p>${cocktail.strInstructions}</p>
            <h4><b>Ingredients:</b></h4>
            <ul>${ingredientsList.map(ingredient => `
                <li>
                    <img src="${ingredient.image}" alt="${ingredient.name}" style="height: 50px; width: 50px;">
                    <b>${ingredient.name}</b> - ${ingredient.measure}
                </li>`).join('')}
            </ul>
        </div>`;
      cocktailItemsDiv.appendChild(cocktailDiv);
    });
  }
}

// Function to add event listeners to submit search and clicking form buttons
function addEventListeners() {
  mealSearchFormEl.addEventListener("submit", handleFormSubmit);
  cocktailSearchFormEl.addEventListener("submit", handleFormSubmit1);
}

// Initializing and calling the event listener functions
function init() {
  addEventListeners();
}
init();

// Function to add event listener to the save button
favMealButtonEl.addEventListener("click", function() {
  if (currentmealId !== null) {
    addMealLS(currentmealId);
    currentmealId = null;
  }
});