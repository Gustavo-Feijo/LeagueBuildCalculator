# LeagueBuildCalculator
My first simple project, mostly has the purpose of practice of development skills and learning.
Mostly using only nodeJS, HTML and CSS, as a first project, I do not pretend to go deep into other web frameworks.
  
The main idea of the project is develop a build calculator for League of Legends, by taking data provided by Riot Games about various aspects of the game.

The calculator should work by fetching the data with https://github.com/meraki-analytics/lolstaticdata/tree/master, previously was using DDragon, but was changed due to some problems with tha data provided by DDragon.

The Data with the necessary JSON's is provided in the folder API files, some of the data was treated before, still need to at the code used for that, but mainly was adding some information that was missing on the original files, like AS Ratio.

Most of the data is not 100% precise, like the missing AS Ratio, items missing stats on the stats key of the JSONs, only being present at the description, some removed items being included. I deleted most of the items not avaible at SR with the itemsFitler.js.
For debugging purposes and to simplify the data treatment, the files are being served by the express server, already with the needed changes, instead of fetching directly from Riots DDragon Server.
