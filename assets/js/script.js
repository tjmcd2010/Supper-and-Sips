// Get elements from the HTML
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

//calling the function to display favourite meals & sips in the page
fetchFavMeals();
fetchFavSips();

///////////
//LOCALSTORAGE FOR MEALS
//read MealID's from localStorage
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
//remove data from localStorage
function removeMealLS(mealId) {
  const mealIds = getMealsLS();

  localStorage.setItem(
    "mealIds",
    JSON.stringify(mealIds.filter((currentmealId) => currentmealId !== mealId))
  );
}
//LOCALSTORAGE FOR COCKTAILS
//read DrinkID's from localStorage
let currentSipId;
function getSipsLS() {
  const idDrinks = JSON.parse(localStorage.getItem("idDrinks"));
  return idDrinks ? idDrinks : [];
}
// Store MealID into Local Storage
function addSipsLS(idDrink) {
  const idDrinks = getSipsLS();
  localStorage.setItem("idDrinks", JSON.stringify([...idDrinks, idDrink]));
}
//remove data from localStorage
function removeSipLS(idDrink) {
  const idDrinks = getSipsLS();

  localStorage.setItem(
    "idDrinks",
    JSON.stringify(idDrinks.filter((currentSipId) => currentSipId !== idDrink))
  );
}
////////////

////////////
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
////////////////

////////////MODAL/////////////
//Modal
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

  btn.addEventListener("click", (event) => {
    event.stopPropagation();
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
  const url = `https://www.thecocktaildb.com/api/json/v1/1/random.php`;
  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(data => displayCocktails(data))

  const displayCocktails = cocktails => {
    currentSipId = cocktails.drinks[0].idDrink;cocktails
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
//Favorite Sips
//get the sips by using the idDrink
async function getSipById(currentSipId) {
  const resp = await fetch(
    "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=" + currentSipId
  );

  const respDataSip = await resp.json();
  console.log(`respDataSip`, respDataSip);
  const sip = respDataSip.drinks[0];

  return sip;
}

///////////
//function to fetch all favourite sips
async function fetchFavSips() {
  favoriteSipContainerEl.innerHTML = "";

  const idDrinks = getSipsLS();

  for (let i = 0; i < idDrinks.length; i++) {
    const idDrink = idDrinks[i];
    sip = await getSipById(idDrink);

    addSipFav(sip);
  }
}

//function to display favorite sips in the main section
function addSipFav(sipData) {
  const favSip = document.createElement("li");

  favSip.innerHTML = `
      <img
          src="${sipData.strDrinkThumb}"
          alt="${sipData.strDrink}"/><span>${sipData.strDrink}</span>
      <button class="clear"><i class="fas fa-window-close"></i></button>`;

  const btn = favSip.querySelector(".clear");

  btn.addEventListener("click", (event) => {
    event.stopPropagation();
    removeSipLS(sipData.idDrink);

    fetchFavSips();
  });

  /*favSip.addEventListener("click", () => {
    showMealInfo(mealData);
  });*/

  favoriteSipContainerEl.appendChild(favSip);
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
favMealButtonEl.addEventListener("click", function () {
  if (currentmealId !== null) {
    addMealLS(currentmealId);
    currentmealId = null;
    fetchFavMeals();
  }
});
favSipButtonEl.addEventListener("click", function () {
  if (currentSipId !== null) {
    addSipsLS(currentSipId);
    currentSipId = null;
    fetchFavSips();
  }
});

//Event listener to close the favorite meals popup  
popupCloseBtn.addEventListener("click", () => {
  mealPopup.classList.add("hidden");
});