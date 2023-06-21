import { Component, OnInit } from '@angular/core';
import { DietService } from 'src/app/diet/diet.service';
import { Meal } from 'src/app/diet/meal';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder } from '@angular/forms';
import { ReviewService } from 'src/app/diet/review.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.sass']
})
export class ReviewComponent implements OnInit {
  meals: Meal[] = [];
  mealForReview: Meal|undefined = undefined;
  reviewing: boolean = false;
  returnIcon = faAngleLeft;
  
  reviewForm = this.formBuilder.group({
    idMeal: 0,
    rating: -1,
    comment: ''
  });

  constructor(private dietService: DietService, private formBuilder: FormBuilder, private reviewService: ReviewService) { }

  ngOnInit(): void {
    this.getMeals(); 
  }

  getMeals() {
    this.dietService.getUnreviewedMealsFromMyDiets().subscribe(response => {
      let mealsJSON: Array<any> = JSON.parse(response.body);
      mealsJSON.forEach((mealJSON: any) => {
        this.meals.push(Object.assign(new Meal(mealJSON.id, mealJSON.name, mealJSON.ingredientNames, mealJSON.rating, mealJSON.image, mealJSON.avgRating, mealJSON.proteinRatio, mealJSON.timesUsed), mealJSON));
      });
      console.log(this.meals);
    });
  }

  review(meal: Meal) {
    this.reviewing = true;
    this.mealForReview = meal;
  }

  submitReview() {
    if(!this.isReviewFormFine(this.reviewForm)) 
      return;

    this.reviewForm.controls.idMeal.setValue(this.mealForReview!.idMeal);

    this.reviewService.reviewMeal(this.reviewForm).subscribe(response => {
      if(response.status != 200) {
        alert("Something went wrong");
        return;
      }
    });

    this.reviewing = false;
    this.meals = this.meals.filter(meal => meal.idMeal != this.mealForReview!.idMeal);
    this.mealForReview = undefined;
  }

  private isReviewFormFine(form: any) : boolean {
    if(form.value.rating < 0 || form.value.rating > 10) {
      alert("You must give a rating that's between 0 and 10");
      return false;
    }

    return true;
  }
}
