import { Review } from './review';

export class Meal {
    idMeal: number;
    name: string;
    rating: number;
    image: string;
    ingredientsNames: Array<String>;

    recipe: string = "";
    timeToPrepare: number = 0;
    proteinRatio: number = 0;
    carbsRatio: number = 0;
    fatsRtaio: number = 0;
    reviews: Array<Review> = [];

    constructor(idMeal: number, name: string, ingredientsNames: Array<String>, rating: number, image: string) {
        this.idMeal = idMeal;
        this.name = name;
        this.ingredientsNames = ingredientsNames;
        this.rating = rating;
        this.image = image;
    }

    extendMeal(recipe: string, timeToPrepare: number, proteinRatio: number, carbsRatio: number, fatsRtaio: number, reviews: Array<Review>) {
        this.recipe = recipe;
        this.timeToPrepare = timeToPrepare;
        this.proteinRatio = proteinRatio;
        this.carbsRatio = carbsRatio;
        this.fatsRtaio = fatsRtaio;
        this.reviews = reviews;
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
