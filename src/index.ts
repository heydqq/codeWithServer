import './index.scss';
const findSmallestNumber = (array) => {
    let len = array.length;
    let arr = new Array(len).fill(0);
    for(let i = 0;i<len;i++){
        let number = array[i];
        if(number > 0 && number <= len){
            arr[number - 1] = 1;
            console.log(arr)
        }
    }
    for(let i = 0;i<len;i++){
        if(arr[i] === 0){
            return i+1;
        }
    }
    return len+1;
}
// console.log(findSmallestNumber([7,8,9,11,12]))