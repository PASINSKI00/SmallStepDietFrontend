export class Ingredient {
    readonly idIngredient: number;
    readonly name: string;
    weight: number;
    readonly initialRatioInMeal: number | undefined;
    readonly protein: number | undefined;
    readonly carbs: number | undefined;
    readonly fats: number | undefined;
    readonly calories: number | undefined;

    constructor(id: number, name: string, protein?: number, carbs?: number, fats?: number, calories?: number, weight?: number, initialRatioInMeal?: number) {
        this.idIngredient = id;
        this.name = name;
        this.protein = protein;
        this.carbs = carbs;
        this.fats = fats;
        this.calories = calories;
        this.weight = weight ? weight : 1;
        this.initialRatioInMeal = initialRatioInMeal;
    }
}
