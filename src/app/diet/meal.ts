import { Review } from './review';

export class Meal {
    idMeal: number;
    name: string;
    rating: number;
    imageUrl: string;
    ingredientsNames: Array<String>;
    avgRating: number = 0;
    timesUsed: number = 0;
    
    recipe: string = "";
    timeToPrepare: number = 0;
    proteinRatio: number = 0;
    carbsRatio: number = 0;
    fatsRatio: number = 0;
    reviews: Array<Review> = [];
    categoriesNames: Array<String> = [];

    constructor(idMeal: number, name: string, ingredientsNames: Array<String>, rating: number, imageUrl: string, 
        avgRating: number, proteinRatio: number, timesUsed: number, recipe?: string, timeToPrepare?: number, 
        carbsRatio?: number, fatsRatio?: number, reviews?: Array<Review>) 
        {
        this.idMeal = idMeal;
        this.name = name;
        this.ingredientsNames = ingredientsNames;
        this.rating = rating;
        this.imageUrl = imageUrl;
        this.avgRating = avgRating;
        this.proteinRatio = proteinRatio;
        this.timesUsed = timesUsed;
        recipe ? this.recipe = recipe : null;
        timeToPrepare ? this.timeToPrepare = timeToPrepare : null;
        carbsRatio ? this.carbsRatio = carbsRatio : null;
        fatsRatio ? this.fatsRatio = fatsRatio : null;
        reviews ? this.reviews = reviews : null;
    }

    getIngredientsNames(): string {
        let ingredientsNamesString: string = "";
        for (let i=0; i<2; i++) {
            if(i != 1) {
                ingredientsNamesString += this.ingredientsNames[i] + ", ";
            } else {
                ingredientsNamesString += this.ingredientsNames[i];
                if(this.ingredientsNames.length > 2) {
                    ingredientsNamesString += ", ...";
                }
            }
        }

        return ingredientsNamesString;
    }
}
