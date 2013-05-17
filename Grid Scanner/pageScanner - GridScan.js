(function(){
// the minimum version of jQuery we want
var v = "1.3.2";
// check prior inclusion and version
if (window.jQuery === undefined || window.jQuery.fn.jquery < v) { // If the current page either doesn't have jQuery or is out of date
	var done = false;
	var script = document.createElement("script");
	script.src = "http://ajax.googleapis.com/ajax/libs/jquery/" + v + "/jquery.min.js";
	script.onload = script.onreadystatechange = function(){
		if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
			done = true;
			componentScannerLink();
		
		}
	};
	document.getElementsByTagName("head")[0].appendChild(script);
	}
	else{
		componentScannerLink();
	}
function jsonp(url) { //Pull in the JSON after validator loads
	var done = false;
	var head = document.head;
	var script = document.createElement("script");
	script.setAttribute("src", url);
 	script.onload = script.onreadystatechange = function(){
		if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
			done = true;
		}
	};
	document.body.appendChild(script); // Run the json file. Links callback to componentValidator.run().
}
function componentScannerLink(url) { //Pull in the validator after jQuery loads
	var done = false;
	var head = document.head;
	var script = document.createElement("script");
	script.setAttribute("src", url);
 	script.onload = script.onreadystatechange = function(){
		if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
			done = true;
		}
	};
	document.body.appendChild(script); // Add the new windowComponent
	jsonp("https://raw.github.com/dgMillard/jsCode/master/Grid Scanner/jsonRules.js"); // Add the json, calls componentValidator.run
}
window.componentValidator = {
	run:function(jsonData){
		this.rules = jsonData;
		var time = new Date();
		var results = new Array("Grid Scanner output for scan at " + time.toTimeString() + ".<br>");
		var gridFound = false;
		$('*').each(function(index) // This resets the scanned property to enable the script to run multiple times
		{this.scanned = false;});
		$(".gdb").each(function(index){//Find jQuery instance of each grid
			var indent = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp";
			var rules = componentValidator.rules
			gridFound = true;
			var parent = new Object();
			parent.className = this.parentNode.className;
			parent.idName = this.parentNode.id;
			results.push("<br>Grid: " + $(this).attr('class') + "<br>Parent class: " + parent.className+ "<br>Parent id: " + parent.idName+ "<br><br>");// Report on grid glasses and parent
			var children = this.children;
			var isBlob = false;
			for(var c = 0;c<this.childElementCount;c++)//Iterate through each child
			{
				//Ensure we only check regions...
				if(children[c].className == "gd-left" || children[c].className == "gd-mid" || children[c].className == "gd-right")
				{

					//Check the region for...
					var containsGrid = false;
					for(var i=0; i<children[c].childElementCount; i++)
					{
						if($(children[c].children[i]).hasClass('gdb'))
							containsGrid = true;
					}
					if(containsGrid) //A child grid
					{
						results.push("Warn: " + + children[c].className + "contains another grid.<br>");
					}
					else if(children[c].childElementCount > 1)//Multiple children
					{
						var grandChildren = children[c].children;
						results.push("Fatal: " + children[c].className + " contains multiple elements.<br>");
						for( var i=0; i < children[c].childElementCount;i++)
						{
							results.push(indent + "Class: " + grandChildren[i].className + indent);
							if(!grandChildren[i].id == "")
								results.push("ID: " + grandChildren[i].id+" <br>");
							else
								results.push("<br>");
						}
						isBlob = true;	
					}
					else //Rule Parse
					{
						var childToCheck = children[c].firstElementChild;
						var componentConfirmed = false
						for(var r=0; r<rules.ruleSet.length; r++)//Check if any of the rules have our element as their target
						{
							if($(childToCheck).hasClass(rules.ruleSet[r].className))
							{//If the target lines up
								var rule = rules.ruleSet[r];
								var elementMatch = new Array(rule.criteria.length);
								for(var z=0;z<elementMatch.length;z++)
								{elementMatch[z] = false;}
								for(var q=0; q<rule.criteria.length;q++)
								{//Step through each criteria
								
									if (typeof rule.criteria[q] === 'function') // First, check if its a function
									{	if(rule.criteria[q](this)){
											elementMatch[q] = true;}
									}
									else if (typeof rule.criteria[q] == 'string' || rule.criteria[q] instanceof String) // If it isn't a function, it should be a selector string
									{//If the criteria is a selector
										var scope = $(children[c]);
										$(rule.criteria[q],scope).each(function(index) // Filter out the DOM objects that match our selector
										{
											elementMatch[q] = true;
										}); // End function
									}
								}
								var boolHolder = true;
								for(var z=0;z<elementMatch.length;z++)
								{
									if(elementMatch[z] == false)
									boolHolder = false;
								}
								if(boolHolder)
								{
									results.push($(children[c]).attr('class') + " validated. <br>");
									componentConfirmed = true;
								}
							}
						}
						if(!componentConfirmed)
						{
							results.push("Fatal: Unidentified Object: &quot"+$(childToCheck).attr('class')+"&quot in " + children[c].className+".<br>");
							isBlob = true;
						}
					}
				}
				else{
					results.push("Note: Extra child element found in the grid.<br>");
					results.push(indent + "Child Class: " + children[c].className + "<br>");
					results.push(indent + "Child ID: "+ children[c].id + "<br>");
					results.push(indent + "Child Type: "+ children[c].nodeName + "<br>");
				}
			}
			
			if(isBlob)
				results.push("Grid is a blob.<br>");
			else
				results.push("Grid validated successfully.<br>");
			results.push("____<br>");

		}); // End grid forEach
		if(!gridFound)
			results.push("No grids found on page.<br>");

		results.push("<br>_____________<br><br>")

		this.display(results);
	},
	display:function(results){
		for(var i =0; i<results.length; i++)
		{
			$("body").append(results[i]);
		}
	}
}; //End object definition
})(); // End global anonymous function
