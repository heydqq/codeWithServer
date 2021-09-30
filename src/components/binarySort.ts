/*
function binarySwarch(array,num){
    let start = 0,
        end = ...,
        mid;
    while(...){
        mid = Math.floor( (start+end)/2 );
        if(num === array[mid]){
            ...
        } else if(num < array[mid] ){
            end = ...
        } else if ( num > array[mid] ){
            start = ...
        }
    }
    return ...
}
*/
function binarySwarch1(array,num){
    let start = 0,
        end = array.length - 1,
        mid;
    while(start <= end){
        mid = Math.floor( (start+end)/2 );
        if(num === array[mid]){
            return mid;
        } else if(num < array[mid] ){
            end = mid-1
        } else if ( num > array[mid] ){
            start = mid+1
        }
    }
    return -1;
}

function binarySwarch_left_bound(array,num){
    let start = 0,
        end = array.length-1,
        mid;
    while( start <= end ){
        mid = Math.floor( (start+end)/2 );
        if(num === array[mid]){
            end = mid-1;
        } else if(num < array[mid] ){
            end = mid -1;
        } else if ( num > array[mid] ){
            start = mid + 1;
        }
    }
    if(start >= array.length){
        return -1;
    }
    return array[start] === num ? start : -1;
}

function binarySwarch_right_bound(array,num){
    let start = 0,
        end = array.length-1,
        mid;
    while( start <= end ){
        mid = Math.floor( (start+end)/2 );
        if(num === array[mid]){
            start = mid + 1;
        } else if(num < array[mid] ){
            end = mid - 1;
        } else if ( num > array[mid] ){
            start = mid + 1;
        }
    }
    if (start == 0) return -1;
    return array[start-1] == num ? (start-1) : -1;
}