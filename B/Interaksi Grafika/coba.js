function main(){
    var count = 0;
    var start = Date.now();
    var inter = setInterval(loop, 0);
    function loop(){
        count += 1;
        if(Date.now() - start < 5000){
            clearInterval(inter);
            console.log(count, 'loops in 5 second');
        }
    }
}