function CreateSoldier(name) {
    this.type = 'soldier';
    this.name = name;
}

CreateSoldier.prototype.shot = function() {
    console.log('shot')
}
function CreateTreatSoldier(name) {
    CreateSoldier.call(this,name);
}

/* 问题：修改了父对象的constructor对象
CreateTreatSoldier.prototype = CreateSoldier.prototype;
CreateTreatSoldier.prototype.constructor = CreateTreatSoldier;
*/
/* 问题：prototype上面有不必要的属性 而且调用了两次父类构造函数
CreateTreatSoldier.prototype = new CreateSoldier('');
CreateTreatSoldier.prototype.constructor = CreateTreatSoldier;
*/
//完美
function createProto (pro){
    function F (){};
    F.prototype = pro;
    return new F();
}
CreateTreatSoldier.prototype = createProto(CreateSoldier.prototype);
CreateTreatSoldier.prototype.constructor = CreateTreatSoldier;

CreateTreatSoldier.prototype.treat = function() {
    console.log('treat')
}


var s1 = new CreateSoldier('James');
var s2 = new CreateSoldier('david');
var s3 = new CreateTreatSoldier('dqq');
s3.shot();
console.log(s3);



let objCreate = function (obj,params) {
    function F (){}
    F.prototype = obj;
    let o = new F();
    Object.defineProperties(o,params);
    return o;
}