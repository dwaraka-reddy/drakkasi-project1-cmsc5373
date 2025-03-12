import { AbstractView } from "./AbstractView.js"
import { currentUser } from "../controller/firebase_auth.js";

export class HomeView extends AbstractView {
    //instance variables
    controller = null;
    constructor(controller) {
        super();
        this.controller = controller;
    }

    async onMount() {
        if(!currentUser){
            this.parentElement.innerHTML='<h1>Access Denied</h1>'
            return;
        }
        console.log('HomeView.onMount() called');
    }

    async updateView() {
        console.log('HomeView.updateView() called');
        const viewWrapper = document.createElement('div');
        const response = await fetch('/view/templates/home.html', {cache: 'no-store'});
        viewWrapper.innerHTML=await response.text();

        const tbody=viewWrapper.querySelector('tbody');
        const numberList=this.controller.model.getNumberList();
        for(const n of numberList){
            const tr=document.createElement('tr');
            tbody.appendChild(tr);

            const td1=document.createElement('td');
            td1.textContent= n;
            tr.appendChild(td1);

            const td2=document.createElement('td');
            td2.innerHTML=`${n} <sup>2</sup> = ${n*n}`;
            tr.appendChild(td2);

            const td3=document.createElement('td');
            td3.innerHTML=`${n} <sup>2</sup> = ${n*n*n}`;
            tr.appendChild(td3);



        }

        return viewWrapper;

    }

    attachEvents() {
        //console.log('HomeView.attachEvents() called');
        const generateButton= document.getElementById('generateDataButton');
        generateButton.onclick= this.controller.onClickGenerateDataButton;
    }
    async onLeave() {
        if(!currentUser){
            this.parentElement.innerHTML='<h1>Access Denied</h1>'
            return;
        }
        console.log('HomeView.onLeave() called')
    }
}