var substitutions = [
    ['witnesses', 'these dudes I know'],
    ['allegedly', 'kinda probably'],
    ['$new $study', '$tumblr $post'],
    ['$rebuild', '$avenge'],
    ['$space', '$spaaace'],
    ['$google $glass', '$virtual $boy'],
    ['$smartphone', '$pokédex'],
    ['$electric', '$atomic'],
    ['$senator', '$elf-lord'],
    ['$car', '$cat'],
    ['election', 'eating contest'],
    ['$congressional $leaders', '$river $spirits'],
    ['$homeland $security', '$homestar $runner'],
    ['could not be reached for comment', 'is guilty and everyone knows it'],
];

walk(document.body);

function find_cap_points(str) {
    var pos = [];
    
    for(var index = str.indexOf('$'); index != -1; index = str.indexOf('$')) {
        str = str.replace('$', '');
        pos.push(index);
    }
    
    return pos;
}

// Adapted from 
// http://stackoverflow.com/questions/5904914/javascript-regex-to-replace-text-not-in-html-attributes/5904945#5904945
function walk(node) {
    var child, next;

    switch(node.nodeType) {
        case 1: case 9: case 11:
            child = node.firstChild;
            while(child) {
                next = child.nextSibling;
                walk(child);
                child = next;
            }
            break;

        case 3:
            xkcdize(node);
            break;
    }
}

function xkcdize(textNode) {
    var v = textNode.nodeValue;
    
    for(var i = 0; i < substitutions.length; i++) { 
        var find = substitutions[i][0], replace = substitutions[i][1];
        var pos_find = find_cap_points(find), pos_replace = find_cap_points(replace);
        
        find = find.replace(/\$/g, '');
        replace = replace.replace(/\$/g, '');
            
        v = v.replace(new RegExp('\\b' + find + '\\b', 'gi'), function(match) {
            var capitalise = [];
            for(var i = 0; i < pos_find.length; i++) {
                var c = match[pos_find[i]];
                if(c == c.toUpperCase()) 
                    capitalise.push(i);
            }
            
            solution = replace;
            for(var i = 0; i < capitalise.length; i++) {
                var index = pos_replace[capitalise[i]];
                solution = solution.substr(0, index) + solution[index].toUpperCase() + solution.substr(index+1);
            }
            
            return solution;
        });
    }
    
    textNode.nodeValue = v;
}
