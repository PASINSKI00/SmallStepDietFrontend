import { Ingredient } from "../ingredient";

export class FinalMeal {
    idMeal: number;
    name: string;
    ingredients: Array<Ingredient>;
    
    weight: number = 0;
    calories: number = 0;
    protein: number = 0;
    carbs: number = 0;
    fats: number = 0;

    constructor(id: number, name: string, ingredients: Array<Ingredient>) {
        this.idMeal = id;
        this.name = name;
        this.ingredients = ingredients;
    }

    calculateWeight() {
        let weight: number = 0;
    }

    calculateProteinAmount() {
        let protein: number = 0;
        this.ingredients.forEach(ingredient => {
            protein += ingredient.protein!/ingredient.weight;
        });
        return protein;
    }

}