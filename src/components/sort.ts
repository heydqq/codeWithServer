let mergeSort = (arr) => {
    function _merge_sort(start,end) {
        if(start >= end){
            return;
        }
        let mid = Math.floor((start + end)/2);
        _merge_sort(start,mid);
        _merge_sort(mid+1,end);
        _merge(start,mid,end);
    }
    function _merge(start,mid,end){
        let temp = [];
        let s = start,
            m = mid + 1;
        while(s <= mid && m <= end) {
            if(arr[s] <= arr[m]) {
                temp.push(arr[s++]);
            } else {
                temp.push(arr[m++])
            }
        }
        let reset,
            restEnd;
        if(s<=mid) {
            reset = s;
            restEnd = mid;
        } else {
            reset = m;
            restEnd = end;
        }
        while(reset <= restEnd){
            temp.push(arr[reset++]);
        }
        for(let i = start;i<=end;i++) {
            arr[i] = temp[i - start];
        }
    }
    _merge_sort(0,arr.length - 1);
    return arr;
}

let quickSort = (arr) => {
    function _quickSort (start,end) {
        if(start >= end){
            return;
        }
        let privot = partition(start,end); //获取分区点
        _quickSort(start,privot - 1);
        _quickSort(privot + 1,end);
    }
    function partition (start,end){
        let privot = arr[end];
        let point = start;
        let temp;
        for(let i = start;i< end;i++) {
            if(arr[i] < privot) {
                temp = arr[i];
                arr[i] = arr[point];
                arr[point] = temp;
                point++;
            }
        }
        temp = arr[point];
        arr[point] = arr[end];
        arr[end] = temp;
        return point;
        
    }
    _quickSort(0,arr.length - 1);
    return arr;
}
console.log(quickSort([11,8,3,9,7,1,2,5]))