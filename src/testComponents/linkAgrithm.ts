function ListNode(val, next) {
    this.val = (val===undefined ? 0 : val);
    this.next = (next===undefined ? null : next)
}
let node5 = new ListNode(5,undefined);
let node4 = new ListNode(4,node5);
let node3 = new ListNode(4,node4);
let node2 = new ListNode(4,node3);
let node1 = new ListNode(4,node2);

var oddEvenList = function(head) {
    if(!head){
        return null;
    }
    let oddHead = head;
    let evenHead = head.next;
    let oddTemp = oddHead;
    let evenTemp = evenHead;
    while(oddTemp.next && evenTemp.next){
        oddTemp.next = evenTemp.next;
        oddTemp = oddTemp.next;
        evenTemp.next = oddTemp.next;
        evenTemp = evenTemp.next;
    }
    oddTemp.next = evenHead;
    return head;
};

var getIntersectionNode = function(headA, headB) {
    let set = new Set();
    while(headA!==null){
        set.add(headA);
        headA = headA.next;
    }
    while(headB !== null){
        if(set.has(headB)){
            return headB;
        }
        headB = headB.next;
    }
    return null;
};
var inorderTraversal = function(root) {
    let arr = [];
    function _inorderTraversal(root){
        if(!root){
            return;
        }
        inorderTraversal(root.left);
        arr.push(root.val);
        inorderTraversal(root.right)
    }
    _inorderTraversal(root)
    return arr;
};