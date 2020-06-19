class SvgNode{
    constructor(cx, cy, r){
        this.cx = cx;
        this.cy = cy;
        this.r = r;
    }
}
function createNode() {
    let c1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    c1.setAttribute("cx", "50%");
    c1.setAttribute("cy", "50%");
    c1.setAttribute("r", "40");
    document.getElementById("mysvg").appendChild(c1);
}

function createSvgCircleNode(posx, posy, radius){
    let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", posx);
    circle.setAttribute("cy", posy);
    circle.setAttribute("r", radius);
    circle.setAttribute("fill", "white");
    circle.setAttribute("stroke", "green");
    circle.setAttribute("Id", "circle");
    circle.setAttribute("onmouseover","zoomIt(this)");
    return circle;
}

function createSvgTextNode(x, y, innerText = "", textAnchor="middle", strokeWidth = "1",){
    let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", x);
    text.setAttribute("y", y);
    text.setAttribute("text-anchor", textAnchor);
    text.setAttribute("style", "stroke-width:"+strokeWidth.toString());
    text.setAttribute("stroke", "green");
    text.textContent = innerText;
    return text;
}

function createSvgPath(x1, y1, x2, y2, strokeWidth = "1"){
    //<line x1="0" y1="0" x2="200" y2="200" style="stroke:rgb(255,0,0);stroke-width:2" />
    let path = document.createElementNS("http://www.w3.org/2000/svg", "line");
    path.setAttribute("x1", x1);
    path.setAttribute("y1", y1);
    path.setAttribute("x2", x2);
    path.setAttribute("y2", y2);
    path.setAttribute("stroke", "green");
    path.setAttribute("style", "stroke-width:"+strokeWidth.toString());
    return path;
}


function show(element){
    document.getElementById("mysvg").appendChild(element);
}

function giveDistance(x1, y1, x2, y2){
    return Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2));
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  

async function showTransaction(insertionPath){
    let baseCx = 50
    let baseCy = 10
    let baseRadius = 3
    console.log("Inside Canvas ::", insertionPath);
    let textNodeList = []
    for(let i=0; i<insertionPath.length-1; i+=2){ 
       if(insertionPath[i] == "create"){
            if(i == 0){
                insertionPath[i+1].svgCirclePointer = createSvgCircleNode(baseCx.toString() + "%", baseCy.toString() + "%", baseRadius.toString() + "%");
                insertionPath[i+1].svgTextPointer = createSvgTextNode(baseCx.toString() + "%", (baseCy+1).toString() + "%", insertionPath[i+1].data);
                show(insertionPath[i+1].svgCirclePointer);
                show(insertionPath[i+1].svgTextPointer);
                
            }
            else{

                console.log("Starting :: ", insertionPath[i+1].parent.svgCirclePointer);
                let parentCx = parseInt(insertionPath[i+1].parent.svgCirclePointer.getAttribute('cx'));
                let parentCy = parseInt(insertionPath[i+1].parent.svgCirclePointer.getAttribute('cy'));

                let parentParentCx = 0;
                if(i != 2){
                    parentParentCx = parseInt(insertionPath[i+1].parent.parent.svgCirclePointer.getAttribute('cx'));
                }
                let currentX = 0;
                let currentY = parentCy+15;

                if(insertionPath[i+2] == 'left'){
                    currentX = parentCx - Math.abs(parentParentCx - parentCx) / 2;
                }else{
                    currentX = parentCx + Math.abs(parentCx - parentParentCx) / 2;
                }
                insertionPath[i+1].svgCirclePointer = createSvgCircleNode(currentX.toString() + "%", currentY.toString() + "%", baseRadius.toString() + "%");
                insertionPath[i+1].svgTextPointer = createSvgTextNode(currentX.toString() + "%", (currentY+1).toString() + "%", insertionPath[i+1].data);
                let x1 = parentCx;
                let y1 = parentCy;
                
                let x2 = currentX;
                let y2 = currentY;
                
                let messageCx = parseInt(insertionPath[i+1].parent.svgCirclePointer.getAttribute('cx'));
                let messageCy = parseInt(insertionPath[i+1].parent.svgCirclePointer.getAttribute('cy')) - 6;
                let textNode;
                if(insertionPath[i+2] == 'left'){
                    insertionPath[i+1].parent.leftPathPointer = createSvgPath(x1.toString() + "%", y1.toString() + "%", x2.toString() + "%", y2.toString() + "%");
                    show(insertionPath[i+1].parent.leftPathPointer);
                    textNode = createSvgTextNode(messageCx.toString() + "%", messageCy.toString() + "%", insertionPath[insertionPath.length-2].data.toString() +" < " + insertionPath[i-1].data.toString());
                }
                else{
                    insertionPath[i+1].parent.rightPathPointer = createSvgPath(x1.toString() + "%", y1.toString() + "%", x2.toString() + "%", y2.toString() + "%");
                    show(insertionPath[i+1].parent.rightPathPointer);
                    textNode = createSvgTextNode(messageCx.toString() + "%", messageCy.toString() + "%", insertionPath[insertionPath.length-2].data.toString() +" > " + insertionPath[i-1].data.toString());
                }
            
                show(textNode);
                  
                textNodeList.push(textNode);

                show(insertionPath[i+1].parent.svgCirclePointer);
                show(insertionPath[i+1].parent.svgTextPointer);
                show(insertionPath[i+1].svgCirclePointer);
                show(insertionPath[i+1].svgTextPointer);
                //return;
            }
            await sleep(1000);
        }
        if(insertionPath[i] == 'root'){
            insertionPath[i+1].svgCirclePointer.setAttribute("stroke", "green");
            show(insertionPath[i+1].svgCirclePointer);
            show(insertionPath[i+1].svgTextPointer);
            await sleep(200);
        }
        
        if(insertionPath[i] == 'left'){
            insertionPath[i-1].leftPathPointer.setAttribute("stroke", "green");
            show(insertionPath[i-1].leftPathPointer);
            
            show(insertionPath[i-1].svgCirclePointer);
            show(insertionPath[i-1].svgTextPointer);
            
            show(insertionPath[i+1].svgCirclePointer);
            show(insertionPath[i+1].svgTextPointer);
            
            let messageCx = parseInt(insertionPath[i+1].parent.svgCirclePointer.getAttribute('cx'));
            let messageCy = parseInt(insertionPath[i+1].parent.svgCirclePointer.getAttribute('cy')) - 6;
            let textNode = createSvgTextNode(messageCx.toString() + "%", messageCy.toString() + "%", insertionPath[insertionPath.length-2].data.toString() +" < " + insertionPath[i-1].data.toString());
            show(textNode);
            textNodeList.push(textNode);
            await sleep(200);

            insertionPath[i+1].svgCirclePointer.setAttribute("stroke", "green");
            insertionPath[i+1].svgTextPointer.setAttribute("stroke", "green");
            show(insertionPath[i+1].svgCirclePointer);
            show(insertionPath[i+1].svgTextPointer);
            await sleep(200);
        }

        if(insertionPath[i] == 'right'){
            insertionPath[i-1].rightPathPointer.setAttribute("stroke", "green");
            show(insertionPath[i-1].rightPathPointer);
            
            show(insertionPath[i-1].svgCirclePointer);
            show(insertionPath[i-1].svgTextPointer);
            
            //show(insertionPath[i+1].svgTextPointer);
            show(insertionPath[i+1].svgCirclePointer);
            show(insertionPath[i+1].svgTextPointer);

            let messageCx = parseInt(insertionPath[i+1].parent.svgCirclePointer.getAttribute('cx'));
            let messageCy = parseInt(insertionPath[i+1].parent.svgCirclePointer.getAttribute('cy')) - 6;
            let textNode = createSvgTextNode(messageCx.toString() + "%", messageCy.toString() + "%", insertionPath[insertionPath.length-2].data.toString() +" > " + insertionPath[i-1].data.toString());
            show(textNode);
            textNodeList.push(textNode);
            await sleep(200);

            insertionPath[i+1].svgCirclePointer.setAttribute("stroke", "green");
            insertionPath[i+1].svgTextPointer.setAttribute("stroke", "green");
            show(insertionPath[i+1].svgCirclePointer);
            show(insertionPath[i+1].svgTextPointer);
            await sleep(200);
        }
        console.log("inner for loop", i);
    }

    if(insertionPath[insertionPath.length - 1] == "Found"){
        alert("Element Found");
    }

    if(insertionPath[insertionPath.length - 1] == "Not Found"){
        alert("Element Not Found ");
    }
    
    for(let i=1; i<insertionPath.length; i+=2){
        console.log("Outer for loop", i);
        if(insertionPath[i].leftPathPointer){
            insertionPath[i].leftPathPointer.setAttribute("stroke", "black");
            show(insertionPath[i].leftPathPointer);
            show(insertionPath[i].left.svgCirclePointer);
            show(insertionPath[i].left.svgTextPointer);
        }
        
        if(insertionPath[i].rightPathPointer){
            insertionPath[i].rightPathPointer.setAttribute("stroke", "black");
            show(insertionPath[i].rightPathPointer);
            show(insertionPath[i].right.svgCirclePointer);
            show(insertionPath[i].right.svgTextPointer);
        }
        
        insertionPath[i].svgCirclePointer.setAttribute("stroke", "black");
        show(insertionPath[i].svgCirclePointer);
        
        insertionPath[i].svgTextPointer.setAttribute("stroke", "black");
        show(insertionPath[i].svgTextPointer);
    }

    for(let i=0; i<textNodeList.length; i++){
        textNodeList[i].remove();
    }

}

function zoomIt(element){
    console.log("zooming");
}

$(document).ready(function(){
    //$('#mysvg').append(
    //    '<circle cx="100" cy="100" r="100" stroke="green" stroke-width="4" fill="yellow" />'
    //);
    //let c1 = document.createElement("circle");  
});

