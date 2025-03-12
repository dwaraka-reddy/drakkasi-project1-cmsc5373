import { HomeModel } from "../model/HomeModel.js";

export const glHomeModel = new HomeModel();
export class HomeController{
    //instance members
    model=null;
    view=null;

    constructor()
    {
        this.model = glHomeModel;
        this.onClickGenerateDataButton=this.onClickGenerateDataButton.bind(this);
    }
    setView(view)
    {
        this.view = view;
    }

    onClickGenerateDataButton(){
        //generate a random number between 1-100
        const randomNumber= Math.floor(Math.random() *100)+1;
        this.model.addNumber(randomNumber);
        this.view.render();
    }
}