function Node(val) {
    this.value = val;
    this.left = null;
    this.right = null;
}

function BinaryST() {
    this.root = null;
}

BinaryST.prototype.push = function(val) {
    var root = this.root;
    if (!root) {
        this.root = new Node(val);
        //console.log(val);
        return;
    }
    //console.log("Root value: : : " + this.root.value)
    var current_node = root;
    var new_node = new Node(val);
    while (current_node) {
        
        if (val < current_node.value) {
            if(!current_node.left) {
                current_node.left = new_node;
                //console.log(val);
                break;
            } else {
                current_node = current_node.left;
            }
        }
        else if (val > current_node.value) {
            if (!current_node.right) {
                current_node.right = new_node;
                //console.log(val);
                break;
            } else {
                current_node = current_node.right;
            }
        } else {
            console.log("Value already present");
            break;
        }
    }
}


BinaryST.prototype.bfs = function (val) {
    var current_node = this.root;
    
    if (!current_node) {
        console.log("No tree exists");
        return;
    }
    var temp = null; 
    var list = [];
    var found = null;
    //console.log("Current node" + this.root.value)
    list.push(current_node);
    while (!(list == undefined || list.length == 0)) {
        temp = list.shift();
        //console.log(list);
        //console.log(temp.value);
        if (val == temp.value) {
            found = temp.value;
            console.log("Found it: " + temp.value)
            return;
        } 
        if (temp.left) {
            list.push(temp.left);
            //console.log(temp.value + " ");
        }
        
        if(temp.right) {
            list.push(temp.right);
            //console.log(temp.value + "\n");
        }
        console.log("Checked " + temp.value);
    }
    if (found != null) {
        console.log("Does not exist in tree............");
    } else {
        console.log("Does not exist in tree");
    }

}
//still not working
BinaryST.prototype.dfs = function (val) {
    var current_node = this.root;
    console.log(current_node.value);
    if (!current_node) {
        console.log("No tree exists");
        return;
    }
    
    var temp = null;
    (function search (cur_node) {
        if (val == cur_node.value) {
            console.log("Found it: " + cur_node.value);
            return;
        } else if (val != cur_node.value) {
            console.log("Checked: " + cur_node.value);
            if (cur_node.left) {
                search(cur_node.left)
            } 
            if (cur_node.right) {
                search(cur_node.right)
            }

        }
    })(current_node);
    
}

// var tree = new BinaryST();

// tree.push(8);       // root
// tree.push(6);
// tree.push(10);
// tree.push(7);
// tree.push(5);
// tree.push(9);
// tree.push(11);

// tree.push(37);
// tree.push(12);
// tree.push(21);
// tree.push(54);
// tree.push(1);

// tree.dfs(6);



// 
// dfjasdfjajds hunter 
//
//check if brackets in string are balanced

var isBalanced = function (string) {
    var stack = [];
    for (var i=0; i< string.length; i++) {
        if (string[i] == '{') {
            stack.push(string[i]);
        } 
        if (string[i] == '[') {
            stack.push(string[i]);
        }
        if (string[i] == '}' && stack.pop() != '{') {
            return false;
        }
        if (string[i] == ']' && stack.pop() != '[') {
            return false;
        }
        //console.log(stack  + " is All");
    }
    if (stack.length != 0) {
        return false;
    } else return true;
    
}

var string_two = " { [ dajfsdafd {[ dfasdf ]} ]dfasdff";

var string = "{    asdfdsaf  [   dfad   [   dsafdsfasd  {  dfasdfa   }  df  ]  d   ]   }";
console.log(isBalanced(string_two));

function factorial (n) {
    if (n == 0 || n == 1) {
        console.log("1");
        return 1;
    }
    
    var sum = factorial(n-1) * n;
    console.log(sum);
    return sum;
    
}

factorial(7);



