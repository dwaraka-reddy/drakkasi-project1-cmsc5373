export class HomeModel {
    numberList=[];

    getNumberList(){
        return this.numberList;
    }

    addNumber(number){
        this.numberList.push(number);
    }

    reset(){
        this.numberList=[];
    }
}