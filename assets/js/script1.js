const favoriteContainer = document.getElementById("fav-meals");
const favButtonEl = document.getElementById("fav-btn");

document.addEventListener('DOMContentLoaded', () => {
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

    (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
        const modal = $trigger.dataset.target;
        const $target = document.getElementById(modal);

        $trigger.addEventListener('click', () => {
            openModal($target);
        });
    });

    (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
        const $target = $close.closest('.modal');

        $close.addEventListener('click', () => {
            closeModal($target);
        });
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === "Escape") {
            closeAllModals();
        }
    });

    function fetchRandomMeal() {
        fetch('https://www.themealdb.com/api/json/v1/1/random.php')
            .then(response => response.json())
            .then(data => {
                const meal = data.meals[0];
                const mealCard = document.getElementById('meal-card');
                const mealImage = document.getElementById('meal-image');
                const mealName = document.getElementById('meal-name');

                mealImage.src = meal.strMealThumb;
                mealName.textContent = meal.strMeal;
                mealCard.style.display = 'block';
                mealCard.dataset.id = meal.idMeal;
            })
            .catch(error => console.error('Error fetching random meal:', error));
    }

    function fetchMealDetails(id) {
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
            .then(response => response.json())
            .then(data => {
                if (data.meals) {
                    const meal = data.meals[0];
                    const mealDetails = document.getElementById('meal-details');
                    mealDetails.innerHTML = `
                        <h2>${meal.strMeal}</h2>
                        <p><strong>Category:</strong> ${meal.strCategory}</p>
                        <p><strong>Area:</strong> ${meal.strArea}</p>
                        <p><strong>Instructions:</strong> ${meal.strInstructions}</p>
                        <h3>Ingredients:</h3>
                        <ul>
                            ${getIngredients(meal).map(ingredient => `
                                <li>
                                    <img src="https://www.themealdb.com/images/ingredients/${ingredient.split(' - ')[0].trim()}.png" alt="${ingredient}" style="width: 50px; height: 50px; vertical-align: middle;">
                                    ${ingredient}
                                </li>
                            `).join('')}
                        </ul>
                    `;
                    openModal(document.getElementById('modal-meal-details'));
                }
            })
            .catch(error => console.error('Error fetching meal details:', error));
    }

    function fetchRandomCocktail() {
        fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php')
            .then(response => response.json())
            .then(data => {
                const cocktail = data.drinks[0];
                const cocktailCard = document.getElementById('cocktail-card');
                const cocktailImage = document.getElementById('cocktail-image');
                const cocktailName = document.getElementById('cocktail-name');

                cocktailImage.src = cocktail.strDrinkThumb;
                cocktailName.textContent = cocktail.strDrink;
                cocktailCard.style.display = 'block';
                cocktailCard.dataset.id = cocktail.idDrink;
            })
            .catch(error => console.error('Error fetching random cocktail:', error));
    }

    function fetchCocktailDetails(id) {
        fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`)
            .then(response => response.json())
            .then(data => {
                if (data.drinks) {
                    const cocktail = data.drinks[0];
                    const cocktailDetails = document.getElementById('cocktail-details');
                    cocktailDetails.innerHTML = `
                        <h2>${cocktail.strDrink}</h2>
                        <p><strong>Category:</strong> ${cocktail.strCategory}</p>
                        <p><strong>Glass:</strong> ${cocktail.strGlass}</p>
                        <p><strong>Instructions:</strong> ${cocktail.strInstructions}</p>
                        <h3>Ingredients:</h3>
                        <ul>
                            ${getCocktailIngredients(cocktail).map(ingredient => `
                                <li>
                                    <img src="https://www.thecocktaildb.com/images/ingredients/${ingredient.split(' - ')[0].trim()}.png" alt="${ingredient}" style="width: 50px; height: 50px; vertical-align: middle;">
                                    ${ingredient}
                                </li>
                            `).join('')}
                        </ul>
                    `;
                    openModal(document.getElementById('modal-cocktail-details'));
                }
            })
            .catch(error => console.error('Error fetching cocktail details:', error));
    }

    function getIngredients(item) {
        let ingredients = [];
        for (let i = 1; i <= 20; i++) {
            if (item[`strIngredient${i}`]) {
                ingredients.push(`${item[`strIngredient${i}`]} - ${item[`strMeasure${i}`]}`);
            }
        }
        return ingredients;
    }

    function getCocktailIngredients(item) {
        let ingredients = [];
        for (let i = 1; i <= 15; i++) {
            if (item[`strIngredient${i}`]) {
                ingredients.push(`${item[`strIngredient${i}`]} - ${item[`strMeasure${i}`]}`);
            }
        }
        return ingredients;
    }

    document.getElementById('random-meal-btn').addEventListener('click', fetchRandomMeal);
    document.getElementById('random-cocktail-btn').addEventListener('click', fetchRandomCocktail);

    document.getElementById('meal-card').addEventListener('click', (event) => {
        const mealId = event.currentTarget.dataset.id;
        fetchMealDetails(mealId);
    });

    document.getElementById('cocktail-card').addEventListener('click', (event) => {
        const cocktailId = event.currentTarget.dataset.id;
        fetchCocktailDetails(cocktailId);
    });
});
//Save favourite meals to the local storage
function addMealLS(mealId) {
    const mealIds = getMealsLS();

    localStorage.setItem("mealIds", JSON.stringify([...mealIds, mealId]));
}

function removeMealLS(mealId) {
    const mealIds = getMealsLS();

    localStorage.setItem(
        "mealIds",
        JSON.stringify(mealIds.filter((id) => id !== mealId))
    );
}
favButtonEl.addEventListener("click", () => {
    if (btn.classList.contains("active")) {
        removeMealLS(mealData.idMeal);
        btn.classList.remove("active");
    } else {
        addMealLS(mealData.idMeal);
        btn.classList.add("active");
    }
    fetchFavMeals();
});
