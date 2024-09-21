import { createSignal, Show, For } from 'solid-js';
import { createEvent } from './supabaseClient';

function App() {
  const [foodInput, setFoodInput] = createSignal('');
  const [unsuitableIngredients, setUnsuitableIngredients] = createSignal('');
  const [loading, setLoading] = createSignal(false);
  const [nutritionData, setNutritionData] = createSignal(null);
  const [unsuitableMatches, setUnsuitableMatches] = createSignal([]);

  const handleCheckNutrition = async () => {
    if (loading()) return;

    setLoading(true);
    setNutritionData(null);
    setUnsuitableMatches([]);

    try {
      const result = await createEvent('call_api', {
        api_id: 'a0d6b7f7-089d-4627-b3f7-e9fadedd9ab7',
        instructions: `Provide the nutritional information and ingredients for: "${foodInput()}"`
      });

      if (result && Array.isArray(result)) {
        setNutritionData(result);

        // Extract ingredients from the result
        const ingredientsList = result.map(item => item.name.toLowerCase());

        // Get list of unsuitable ingredients from user input
        const unsuitableList = unsuitableIngredients().split(',').map(item => item.trim().toLowerCase());

        // Find matches
        const matches = ingredientsList.filter(ingredient =>
          unsuitableList.includes(ingredient)
        );

        setUnsuitableMatches(matches);
      }
    } catch (error) {
      console.error('Error checking nutrition:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 class="text-2xl font-bold mb-4 text-center">Food Ingredient Checker</h1>
        <div class="mb-4">
          <label class="block text-gray-700 mb-2" for="unsuitable-ingredients">
            Unsuitable Ingredients (separate by commas):
          </label>
          <input
            id="unsuitable-ingredients"
            type="text"
            class="w-full px-3 py-2 border rounded box-border focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={unsuitableIngredients()}
            onInput={(e) => setUnsuitableIngredients(e.target.value)}
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-2" for="food-item">
            Food Item:
          </label>
          <input
            id="food-item"
            type="text"
            class="w-full px-3 py-2 border rounded box-border focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={foodInput()}
            onInput={(e) => setFoodInput(e.target.value)}
          />
        </div>
        <button
          class="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer"
          onClick={handleCheckNutrition}
          disabled={loading()}
        >
          <Show when={loading()} fallback="Check Ingredients">
            Loading...
          </Show>
        </button>
        <Show when={unsuitableMatches().length > 0}>
          <div class="mt-6 p-4 bg-red-100 rounded-lg border border-red-200">
            <h3 class="text-xl font-semibold mb-2 text-red-800">Warning: Unsuitable Ingredients Found!</h3>
            <p class="text-gray-700">The following ingredients are unsuitable for you:</p>
            <ul class="list-disc list-inside text-gray-700">
              <For each={unsuitableMatches()}>
                {(ingredient) => <li>{ingredient}</li>}
              </For>
            </ul>
          </div>
        </Show>
        <Show when={unsuitableMatches().length === 0 && nutritionData()}>
          <div class="mt-6 p-4 bg-green-100 rounded-lg border border-green-200">
            <h3 class="text-xl font-semibold mb-2 text-green-800">No Unsuitable Ingredients Found</h3>
            <p class="text-gray-700">This food item does not contain any of your unsuitable ingredients.</p>
          </div>
        </Show>
        <Show when={nutritionData()}>
          <div class="mt-6">
            <h3 class="text-xl font-semibold mb-2">Nutrition Information:</h3>
            <For each={nutritionData()}>
              {(item) => (
                <div class="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p class="text-gray-700"><strong>Name:</strong> {item.name}</p>
                  <p class="text-gray-700"><strong>Calories:</strong> {item.calories}</p>
                  <p class="text-gray-700"><strong>Serving Size (g):</strong> {item.serving_size_g}</p>
                  <p class="text-gray-700"><strong>Total Fat (g):</strong> {item.fat_total_g}</p>
                  <p class="text-gray-700"><strong>Saturated Fat (g):</strong> {item.fat_saturated_g}</p>
                  <p class="text-gray-700"><strong>Protein (g):</strong> {item.protein_g}</p>
                  <p class="text-gray-700"><strong>Total Carbohydrates (g):</strong> {item.carbohydrates_total_g}</p>
                  <p class="text-gray-700"><strong>Sugar (g):</strong> {item.sugar_g}</p>
                  <p class="text-gray-700"><strong>Fiber (g):</strong> {item.fiber_g}</p>
                  <p class="text-gray-700"><strong>Sodium (mg):</strong> {item.sodium_mg}</p>
                  <p class="text-gray-700"><strong>Potassium (mg):</strong> {item.potassium_mg}</p>
                  <p class="text-gray-700"><strong>Cholesterol (mg):</strong> {item.cholesterol_mg}</p>
                </div>
              )}
            </For>
          </div>
        </Show>
      </div>
    </div>
  );
}

export default App;