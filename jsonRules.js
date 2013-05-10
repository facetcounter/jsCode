componentValidator.run(
{
   "ruleSet":[
      {
         "behavior" : "loose",
         "title":"Rule for .c50-pilot",
         "target":".c50-pilot",
         "criteriaList":[
               ".frame",
               ".c50-text",
               "#thumbnails",
               function(target){
                  target = jQuery(target);
                  return true;
               }
         ]
      },
      {
         "behavior" : "strict",
         "title":"Rule for .c47-pilot",
         "target":".c47-pilot",
         "criteriaList":[
              "h3",
               "p", 
              ".cta-links"
         ]
      },
      {
         "behavior" : "loose",
         "title":"Rule for .c46-pilot",
         "target":".c46-pilot",
         "criteriaList":[
               "h2"
         ]
      },
      {
         "behavior" : "strict",
         "title":"Test rule",
         "target":".test",
         "criteriaList":[
               "h1",
               "h1",
               "p"
         ]
      }
   ]
}
);
