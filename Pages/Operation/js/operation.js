class Node{
    constructor(data){
        this.data = data;
        this.parent = null;
        this.left = null;
        this.right = null;
        this.svgCirclePointer = null;
        this.svgTextPointer = null;
        this.leftPathPointer = null;
        this.rightPathPointer = null;
    }
}

class BinaryTree{
    constructor(){
        this.root = null;
    }

    insert(data){
        let insertionPath = [];
        if(this.root == null){
            this.root = new Node(data);
            insertionPath.push("create");
            insertionPath.push(this.root);
            insertionPath.push("still");
            return insertionPath;
        }
        let q = this.root;
        insertionPath.push("root");
        insertionPath.push(q);
        while(true){
            if(data < parseInt(q.data)){
                if(q.left == null){
                    q.left = new Node(data);
                    q.left.parent = q;
                    insertionPath.push("create");
                    insertionPath.push(q.left);
                    insertionPath.push("left");
                    return insertionPath;
                }
                q = q.left;
                insertionPath.push("left");
                insertionPath.push(q);
            }
            else{
                if(q.right == null){
                    q.right = new Node(data);
                    q.right.parent = q;
                    insertionPath.push("create");
                    insertionPath.push(q.right);
                    insertionPath.push("right");
                    return insertionPath;
                }
                q = q.right;
                insertionPath.push("right");
                insertionPath.push(q);
            }
        }
    }

    search(data){
        let searchPath = [];
        if(this.root == null){
            searchPath.push("Not Found");
            return searchPath;
        }
        let q = this.root;
        searchPath.push("root");
        while(q){
            searchPath.push(q);
            if(data == q.data){
                searchPath.push("Found");
                return searchPath;
            }
            if(parseInt(data) < parseInt(q.data)){
                q = q.left;
                if(q != null){
                    searchPath.push("left");
                }
            }
            else{
                q = q.right;
                if(q != null){
                    searchPath.push("right");
                }
            }
        }

        searchPath.push("Not Found");
        return searchPath;
    }
}

B = new BinaryTree()

$(document).ready(function(){
    $("#insert").click(function(){
        let integerValue = $("#integerValue"). val();
        if(integerValue == "")
            alert("Please Enter some valid integer Value");   
        else{  
            //createNode();
            let insertionPath = B.insert(integerValue);
            console.log(insertionPath);
            showTransaction(insertionPath);
        }
    });
    $("#search").click(function(){
        let integerValue = $("#integerValue"). val();
        if(integerValue == "")
            alert("Please Enter some valid integer Value");   
        else{  
            //createNode();
            let searchPath = B.search(integerValue);
            console.log(searchPath);
            showTransaction(searchPath);
        }
    });
});