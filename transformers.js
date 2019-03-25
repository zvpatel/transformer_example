$(document).ready(function(){

    $("p.error-msg").text("");
    var a=document.getElementById('result');
    a.addEventListener('click', function(){
      try{
          fillbattleLineup();
      }catch (error) {
          handleErrorException(error);
      }
    });

    handleErrorException = function(error) {
      switch (error.type) {
        case 'OptimusPredakingagaintsException':
           $("p.error-msg").text("Both are winning Team. Optimus Prime againts Predaking and Battle not possible!");
          alert("Both are winning Team. Optimus Prime againts Predaking and Battle not possible!");
          break;
        case 'NullinfoException':
          $("p.error-msg").text(" Please currect all attributes value of " + error.team +" Battel Team.");
          alert(" Please currect all attributes value of " + error.team +" Battel Team.");
          break;
        case 'BattleTiedException':
            $("p.error-msg").text(error.message);
            alert(error.message);
            break;
        default:
          break;
        }
        reseteverything();
      };

    function fillbattleLineup()
    {
      var battleLineup = [];
      var autobots = [];
      var decepticons = [];

      window.winnerBots = [];
      window.extrarobots = [];

      window.amountOfBattles = 0;
      window.autobotVictories = 0;
      window.decepticonVictories = 0;
      window.loosingTeam = "";
      var lines = $('#battlegroup').val().split(/\n/);
      var texts = [];
      for (var i=0; i < lines.length; i++) {
          if (/\S/.test(lines[i])) {
          texts.push($.trim(lines[i]));
        }
      }
     
      texts.forEach(function(value, key) {
     
        var valueArray = value.split(',');
        var team = {};
       
        if(valueArray.length < 10){
            var error = {
            type: "NullinfoException",
            team: valueArray[0],
          };
          throw error;
        }else{
            
            checknullvalue(valueArray);
          
            team.name = valueArray[0].trim();
            team.teamtype = valueArray[1].trim();

            team.strength = Number(valueArray[2]);
            team.intelligence = Number(valueArray[3]);
            team.speed = Number(valueArray[4]);
            team.endurance = Number(valueArray[5]);
            team.rank = Number(valueArray[6]);
            team.courage = Number(valueArray[7]);
            team.firePower = Number(valueArray[8]);
            team.skill = Number(valueArray[9]);
            team.overallRating = team.strength + team.intelligence + team.speed + team.endurance + team.firePower;
  
            battleLineup.push(team);
             
            if(team.teamtype=="D"){
                  decepticons.push(team);
            }else{
              autobots.push(team);
            }
        }
      });
      autobots.sort(function(obj1, obj2) {      
            return obj1.rank - obj2.rank;
      });
      
      while(autobots.length>0 && decepticons.length>0)
      {
        window.amountOfBattles++;
        var autobot = autobots.pop();
        var decepticon = decepticons.pop(); 
        var winner = resolveFaceOff(autobot, decepticon);  
        
         if(winner!=undefined || winner!=null){

            increaseTeamPoint(winner);
            window.winnerBots.push(winner);
           
         }
      }

      LooserTeam();

      // remaing Robots list
      window.extrarobots = (window.loosingTeam=="D") ? decepticons : autobots;
      
      finalWinnerTeam(window.winnerBots,window.loosingTeam);
    }

    function finalWinnerTeam(winnerBots,loosingTeam)
    {
     
      var winners = _.remove(winnerBots, function(transformer) {
          return (transformer.teamtype!=loosingTeam);
      });
    
      window.lastWinner = winners[0];
     
      var winnerteam_type="";
      if(window.lastWinner.teamtype=="D")
      {
          winnerteam_type="Decepticon";
      }else{
          winnerteam_type="Autobots";
      }
      
      $("p.error-msg").text(" ");
      $("p.win-team").text("Winner Team Type : "+ winnerteam_type);
      $("p.win-name").text("Winner Team Name : "+ window.lastWinner.name);
      $("p.win-noofbattle").text("No of Battle : " +window.amountOfBattles);
      var lossingteamname="";
      var losserteamtype="";
      if(window.lastWinner.teamtype=="D")
      {
          losserteamtype="Autobots";
      }else{
          losserteamtype="Decepticon";
      }
      
      $.each( window.extrarobots, function( key, value ) {
        lossingteamname=lossingteamname+value.name+" , " ;
      });
      
      $("p.loosing-team").text("Lossing team Type : " + losserteamtype);
      $("p.loosing-name").text("Lossing team name : " + lossingteamname);
    }
    function LooserTeam(){

      if (window.autobotVictories - window.decepticonVictories !== 0) {
       
        window.loosingTeam = window.autobotVictories > window.decepticonVictories ? "D" : "A";
        
      } else {
        
          window.loosingTeam = "TIED";
          
      }
      
    }
    function increaseTeamPoint(winner)
    {
     
      if(winner.teamtype=="D")
      {
        window.decepticonVictories++;
      }else{
        window.autobotVictories++;
      }
      
    }
    function resolveFaceOff(autobot,decepticon){
      var winner;
      var error;
      if((autobot.name=="Optimus Prime" || autobot.name=="Predaking") && (decepticon.name=="Optimus Prime" || decepticon.name=="Predaking"))
      {
        var error = {
          type: "OptimusPredakingagaintsException",
                   
        };
        throw error;
      }
      var autobotRunsAway = (decepticon.strength - autobot.strength) >= 3 && (decepticon.courage - autobot.courage) >= 4;
      var decepticonRunsAway = (autobot.strength - decepticon.strength) >= 3 && (autobot.courage - decepticon.courage) >= 4;
      if (autobot.name=="Optimus Prime" || autobot.name=="Predaking") {
        winner = autobot;
      } else if (decepticon.name=="Optimus Prime" || decepticon.name=="Predaking") {
        winner = decepticon;
      }else if (autobotRunsAway) {
        winner = decepticon;
      } else if (decepticonRunsAway) {
        winner = autobot;
      } else if (Math.abs(autobot.skill - decepticon.skill) >= 3) {
        winner = autobot.skill > decepticon.skill ? autobot : decepticon;
      } else if (autobot.overallRating - decepticon.overallRating > 0) {
        winner = autobot.overallRating > decepticon.overallRating ? autobot : decepticon;
      } else if (autobot.overallRating - decepticon.overallRating === 0) {
          error = {
            type: "BattleTiedException",
            message: autobot.name + " battled against " + decepticon.name + " and both were destroyed."

          };
        throw error;
      } 

      return winner;

    }
    function checknullvalue(valueArray)
    {

      if(isNaN(valueArray[2]) || isNaN(valueArray[3]) || isNaN(valueArray[4]) || 
        isNaN(valueArray[5]) || isNaN(valueArray[6]) || isNaN(valueArray[7]) || 
        isNaN(valueArray[8]) || isNaN(valueArray[9])){
       
        var error = {
          type: "NullinfoException",
          team: valueArray[0],
          
        };
      
        throw error;
      }else{
       return; }
    }
    function reseteverything(){
        $("p.win-team").text(" ");
        $("p.win-name").text(" ");
        $("p.win-noofbattle").text(" ");
        $("p.loosing-team").text(" ");
        $("p.loosing-name").text(" ");
    }
});