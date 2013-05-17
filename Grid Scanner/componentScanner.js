window.componentValidator.validate = function(component, jsonData){
	this.rules = jsonData;
	var results = new Array("Component Validator output for scan at " + time.toTimeString() + ".<br><br>");
	var matchFound = new Array(this.rules.ruleSet.length);// Create an array to track if each rule is run
	for(var r=0;r<this.rules.ruleSet.length;r++) // Iterate through each rule...
	{
		matchFound[r] = false; // Var to confirm this rule was ever run
		$(this.rules.ruleSet[r].target, component).each(function(index) //Search for the target
		{
			var rules = componentValidator.rules; // Simplifies the rules call in this function's scope
			var $tempDiv = $(this); // Create a temp div so we aren't changing the actual page
			$tempDiv.find('*').each(function(index) // This resets the scanned property to enable the script to run multiple times
			{this.scanned = false;}); // Adds and falsifies a bool to each element				
			matchFound[r] = true; // Tells the log we actually ran this rule
			var tempCriteria = new Array(rules.ruleSet[r].criteriaList.length); // Simplifies json query and allows us to alter elements 
			for(var i=0;i<rules.ruleSet[r].criteriaList.length; i++)
			{ // Might be unneccesary, need to check if you can set equate arrays
				tempCriteria[i] = rules.ruleSet[r].criteriaList[i];
			}
			for (var  i=0;i<tempCriteria.length;i++)// Time to eval each criteria
			{
				if (typeof tempCriteria[i] === 'function') // First, check if its a function
				{
					tempCriteria[i] = tempCriteria[i](this); // If it is, pass the function the DOM object 'target' and set our completion tracker to the returned value 
				}
				else if (typeof tempCriteria[i] == 'string' || tempCriteria[i] instanceof String) // If it isn't a function, it should be a selector string
				{
					$(tempCriteria[i],$tempDiv).each(function(index) // Filter out the DOM objects that match our selector
					{
						if(this.scanned != true && tempCriteria[i] != true) // Confirm we have not already eval'd the element, and comfirm we are not running 1 criteria on multiple elements
						{
							tempCriteria[i] = true; // An instance was found, good!
							this.scanned = true; // Property to tell script the element was eval'd
						}
					}); // End function
				}// End string check if statement
			}//End criteria iteration
			var complete = true; //Set our completion variable. If it stays true, it met all criteria
			if(rules.ruleSet[r].behavior == 'strict') // If our rule has the 'strict' behavior...
			{
				$tempDiv.find('*').each(function(index)
				{//Check all the elements in the target
					if(this.scanned != true) //If one has not been successfully evaluated...
					{
						complete = false; // Fail the rule for this target.
						results.push("<font color=\"red\">Excess element " +this.className + " was found in " + rules.ruleSet[r].target + ".<br></font>"); // Log the failure.
					}
				}); // End strict for loop
			}// End strict behavior check
			for(var i=0;i<tempCriteria.length; i++) // Check if the class had all elements properly evaluated
			{
				if(tempCriteria[i] != true) // If the criteria has not been replaced with true...
				{
					complete = false; // Fail the rule...
					results.push("<font color=\"red\">Field " +tempCriteria[i] + " was not found in " + rules.ruleSet[r].target + ".<br></font>"); // Log the missing element
				}
			}// End criteria completion for loop
			if(complete == true) // If completion is still true, then it is valid
			{				
				this.style.border = "3px solid green"; // Create a green border around the div/element
				results.push("<font color=\"green\">" + rules.ruleSet[r].title + " validated successfully.<br><br></font>"); // Log the success!
			}
			else
			{
				this.style.border = "3px solid red"; // Create a red border around the div/element
				results.push("<font color=\"red\">" + rules.ruleSet[r].title + " failed to validate.<br><br></font>"); // Log the failed rule.
			}
		}); // End the for each target function
	}// End ruleset iteration
	for(var i=0; i<matchFound.length; i++) // Check if each rule was run
	{
		if(matchFound[i] == false) // If it was unable to find a suitable target...
		{
			results.push("No targets of class: " + this.rules.ruleSet[i].target + " were found on this page.<br>"); // Log that it was not present
		}
	}
	return results;
}
