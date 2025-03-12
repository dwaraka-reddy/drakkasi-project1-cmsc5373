import { currentUser } from "../controller/firebase_auth.js";
//Common superclass for all view classes
export class AbstractView{
    parentElement = document.getElementById('spaRoot');

    //Check to see if instance of AbstractView has been created directly
    constructor(){
        if(new.target==AbstractView)
        {
            throw new Error('Cannot instantiate AbstractView directly');
            
        }
    }
    //Called when view is mounted to DOM
    //Fetch initial data from resources like DB,API then update the model
    async onMount()
    {
        throw new Error('onMount method must be implemented');
    }

    //To update the view to reflect the updated model
    async render()
    {
        if(!currentUser){
            this.parentElement.innerHTML='<h1>Access Denied</h1>'
            return;
        }
        this.parentElement.innerHTML='';
        //Update view to the updated model
        const elements=await this.updateView();
        //Render the update view
        this.parentElement.append(elements);
        //add event listeners
        this.attachEvents();
    }

    async updateView()
    {
        throw new Error('updateView method must be implemented');
    }

    attachEvents()
    {
        throw new Error('attachEvents method must be implemented');
    }

    //Called when view is unmounted from DOM
    async onLeave()
    {
        throw new Error('onLeave must be implemented');
    }
}

