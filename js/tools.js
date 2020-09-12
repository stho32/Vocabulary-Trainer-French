/*
    Kleiner Trick aus StackOverflow, um einen 
    JS String zu multiplizieren. 
*/
String.prototype.repeat = function( num )
{
    return new Array( num + 1 ).join( this );
}

function shuffle(o){
    
    for ( var i = 0; i < o.length; i++) 
    {
        var indexA = i;
        var indexB = Math.floor(Math.random() * o.length);
        
        var a = o[indexA];
        var b = o[indexB];

        o[indexA] = b;
        o[indexB] = a;
    }
    
    return o;
}

function shuffleABit(o, anzahlDerAustauschaktionen){
    
    for ( var i = 0; i < anzahlDerAustauschaktionen; i++) 
    {
        var indexA = i;
        var indexB = Math.floor(Math.random() * o.length);
        
        var a = o[indexA];
        var b = o[indexB];

        o[indexA] = b;
        o[indexB] = a;
    }
    
    return o;
}

function BlendeWortAus(o, anzahlDerAusblendungen){
    
    var dieseWorteNichtAusblenden = ["you", "your", "to", "A", "a", "on", "the", "is", "that", "when", "from",
    "important", "want", "be", "in", "do", "of", "well", "and", "its", "whereas", "also", "same", "for", "about", "around",
    "are", "as", "it"];
    
    for (var i = 0; i < dieseWorteNichtAusblenden.length; i++ )
        dieseWorteNichtAusblenden[i] = dieseWorteNichtAusblenden[i].toUpperCase();
    
    function Ausblendbar(wort)
    {
        wort = wort.toUpperCase();
        
        if ( dieseWorteNichtAusblenden.indexOf(wort) > -1 )
            return false;
        
        /* Keine zu kurzen Worte ausblenden, das macht keinen Sinn */
        if ( wort.length <= 3 )
            return false;
        
        /* Keine Worte ausblenden, die direkt an Satzzeichen grenzen, denn die 
           wird niemand je auswendig lernen wollen. 
           */
        if ( wort.indexOf(",") > -1 || 
             wort.indexOf(".") > -1 ||
             wort.indexOf("!") > -1 || 
             wort.indexOf("’") > -1 ||
             wort.indexOf("-") > -1)
             return false;
             
        return true;
    }
    
    var versuche = 0;
            
    for ( var i = 0; i < anzahlDerAusblendungen; i++) 
    {
        var index = Math.floor(Math.random() * o.length);
        versuche = 0;
        
        while (!Ausblendbar(o[index])) {
            index = Math.floor(Math.random() * o.length);
            versuche += 1;
            if (versuche >= 20)
            {
                break;
            }
        }
        
        if ( versuche < 20 ) {
            o[index] = o[index].substring(0,1) + "_".repeat(o[index].length-2) + o[index].substring(o[index].length-1);
        }
    }
    
    return o;
}

function HtmlEncode(string) {
    return string.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br/>");
}

/**
 * Diese Hilfsfunktion kann bei Textfragen angewandt werden, die eine Reihenfolge zum Ziel haben.
 * Nehmen wir an, man hat 3 Zeilen.
 * 
 * 1
 * 2
 * 3
 * 
 * Dann würfelt diese Funktion diese durcheinander, so dass bei jedem Abfragezyklus eine neue 
 * Reihenfolge entsteht.
 */
function shuffleRows(text) {
    var zeilen = text.split("\n");
    
    zeilen = shuffle(zeilen);
    
    return zeilen.join("\n");
}

function ZufallsentfallZuPunktestand(punkte) {
    
    /* Fragen mit negativem Punktestand kommen immer vor... */
    if ( punkte < 0 )
        return false;
    
    /* Je höher der Punktestand, desto höher die Warscheinlichkeit
       dass diese Aufgabe aus der Liste dieses mal entfällt.
       
       90% Warscheinlichkeit für eine Aufgabe, bei der 10 mal richtig geantwortet wurde.
     */
    var zufall = Math.floor((Math.random() * 11) + 1);
    return zufall < punkte;
}

/**
 * Diese Funktion wandelt eine Zeichenkette in eine Text Aufgabe mit
 * Würfeltext.
 * D.h. die Worte werden aufgeteilt und durcheinandergeworfen, und man muss
 * die richtige Reihenfolge wiederherstellen.
 */
function Wuerfeltextaufgabe(frage, text) {
    var ergebnis = {
        "typ"          : "text",
        "frage"        : frage,
        "antwort-init" : ``,
        "antwort"      : text,
    };
    
    var worte = text.split(" ");
    
    var zufall = Math.floor((Math.random() * 10) + 1);
    //if ( zufall > 5 ) {
    //    worte = shuffleABit(worte, 3);
    //}
    //else
    //{
        /* Wir blenden bei längeren Texten mehr als 1 Wort aus. */
        BlendeWortAus(worte, 1 + Math.floor(worte.length/20));
    //}
    
    
    ergebnis["antwort-init"] = worte.join(" ");
    return ergebnis;
}

function Beidseitig(frage, text) {
    return [{
        "typ"          : "text",
        "frage"        : frage,
        "antwort-init" : ``,
        "antwort"      : text,
    },{
        "typ"          : "text",
        "frage"        : text,
        "antwort-init" : ``,
        "antwort"      : frage,
    }];
}

/*
    Überschrift Frage Wortnennen 
*/
function Wortsuchaufgabe(titel, frage, antwort) {
    return {
        "typ"          : "text",
        "frage"        : "<strong>" + titel + "</strong><br/>" + frage,
        "antwort-init" : ``,
        "antwort"      : antwort,
    };
}

/* 
    Ich habe jetzt in meiner Aufgabensammlung deutlich mehr Aufgaben
    hinzu bekommen. Nun muss ich anders beim lernen vorgehen, denn 
    die Zufallsauswahl ist zu verstreut. 
    
    Das Aufgabenpunktesystem :
    - Für jede Aufgabe wird ein Aufgabenhash ermittelt, der sich aus
      Frage, Antwort und Trainingsname zusammensetzt.
    - Für jede Frage wird über den Hash eine Punktezahl in einem Objekt gespeichert,
      welches in localStorage gehalten wird. 
    - Alle Fragen werden mit 0 initialisiert.
    - Falsche Antwort => 5 Punkte Abzug
    - Richtige Antwort => + 1 Punkt
    
    - "Vergessen pro Tag" => bei den Fragen, die es trifft, -1 Punkt, die Routine wird einmal pro Tag ausgeführt
*/
var Aufgabenpunktesystem = (function() {
    
    var Aufgabenpunkte = {};
    var verdientePunkte = 0;
    
    var vorInterpretation = window.localStorage.Aufgabenpunkte;
    if ( vorInterpretation !== undefined )
    {
        Aufgabenpunkte = JSON.parse(vorInterpretation);
    } 
    
    function DatenSpeichern() {
        window.localStorage.Aufgabenpunkte = JSON.stringify(Aufgabenpunkte);
    }
    
    function BilanzAusgeben() {
        
        if ( verdientePunkte > 0 )
        {
            $("#bilanz").css("color", "green");    
            $("#bilanz").text("Bilanz: +" + verdientePunkte + " :)!! ");
            return;
        }

        $("#bilanz").css("color", "red");    
        $("#bilanz").text("Bilanz: " + verdientePunkte + " :/ ");
        
    }
    
    var publicAPI = {
        PunkteFuerFrage : function(frage) {
            /* Einige Fragen werden genau so vorgegeben, wie 
               sie zurück erwartet werden. 
               Das sind "Schilder", z.B. für das nächste Kapitel. 
               Die sind immer außer Wertung und werden 
               zufallsplatziert. (Für die Spezialaufgaben...) */
            if ( frage.typ == "text" && frage.antwort == frage["antwort-init"] ) {
                //return Math.floor(Math.random() * 20)-10;
                return 0;
            }
            
            if ( Aufgabenpunkte[frage.hash] === undefined ) 
            {
                return 0;
            }
            
            return Aufgabenpunkte[frage.hash];
        },
        
        FrageWurdeFalschBeantwortet : function(frage) {
            /* Einige Fragen werden genau so vorgegeben, wie 
               sie zurück erwartet werden. 
               Das sind "Schilder", z.B. für das nächste Kapitel. 
               Die sind immer außer Wertung */
            if ( frage.typ == "text" && frage.antwort == frage["antwort-init"] ) {
                return;
            }

            /* Limit ca. ggf. ein bisschen drüber -20 */
            if ( Aufgabenpunkte[frage.hash] <= -20 )
            {
                return;
            }
            
            console.log("Die Aufgabe wurde falsch beantwortet: -5 Punkte!");
            Aufgabenpunkte[frage.hash] = publicAPI.PunkteFuerFrage(frage) -5;
            verdientePunkte -= 5;
            BilanzAusgeben();
            DatenSpeichern();
        },
 
        FrageWurdeRichtigBeantwortet : function(frage) {
            /* Einige Fragen werden genau so vorgegeben, wie 
               sie zurück erwartet werden. 
               Das sind "Schilder", z.B. für das nächste Kapitel. 
               Die sind immer außer Wertung */

            if ( frage.typ == "text" && frage.antwort == frage["antwort-init"] ) {
                return;
            }

            /* Limit 10 */
            if ( Aufgabenpunkte[frage.hash] > 9 )
            {
                return;
            }
            
            console.log("Die Aufgabe wurde richtig beantwortet: + 1 Punkt!");
            Aufgabenpunkte[frage.hash] = publicAPI.PunkteFuerFrage(frage) +1;
            verdientePunkte += 1;
            BilanzAusgeben();
            DatenSpeichern();
        },
        
        FragenlisteBewerten : function(fragen) {
            var moeglichePunktezahl = 0.0;
            var erreichtePunktezahl = 0.0;
            
            for ( var i = 0; i < fragen.length; i++ ) {
                moeglichePunktezahl += 10;
                
                //if ( fragen[i].punkte > 0 ) {
                    erreichtePunktezahl += publicAPI.PunkteFuerFrage(fragen[i]);
                //}
            }
            
            var inProzent = 0.0;
            
            if ( moeglichePunktezahl > 0 )
            {
                inProzent = Math.round((erreichtePunktezahl / moeglichePunktezahl)*10000)/100;
            }
            
            var farbempfehlung = "red";
            if ( inProzent >= 90.0 ) {
                farbempfehlung = "green";
            } 
            
            return {
                moeglichePunktezahl : moeglichePunktezahl,
                erreichtePunktezahl : erreichtePunktezahl,
                inProzent : String(inProzent) + " %",
                farbempfehlung : farbempfehlung
            };
            
        }
    }
    return publicAPI;  
})();

/**
 * Der Gegenfragengenerator kümmert sich um Multiple Choice Fragen. 
 * 
 * Er wandelt eine MC Aufgabe mit 4 Optionen in 4 Fragen um, bei denen 
 * der Trainee jeweils gefragt wird, warum eine Option richtig oder falsch ist.
 * 
 * Als Ergebnis wird eine Textaufgabe (ein Lückentext) generiert.
 * Damit vervielfacht sich das Fragenvolumen in allen Trainings und es wird sichergestellt
 * dass dem Trainee zu jedem Fragenblock bekannt ist, warum eine Option
 * richtig oder falsch ist.
 * 
 * Dieser Filter muss vor allem anderen angewandt werden, direkt nachdem 
 * die Fragen generell im Trainer verfügbar sind. 
 */
var Gegenfragengenerator = function(trainings) {
    
    /**
     * Wir wollen die Transformation nur dann anwenden, wenn Begründungen 
     * vorhanden und ausreichend lang sind.
     */
    function SindAusreichendBegruendungenVorhanden(frage) {
        
        for ( var i = 0; i < frage.optionen.length; i++ ) {
            
            /* Mindestens 20 Zeichen Begründung, sonst ist das irgendwie nur "Richtig" oder sowas... */
            if ( frage.optionen[i].begruendung === undefined ||
                 frage.optionen[i].begruendung.length < 20 
                 )
            {
                return false;
            }
        }
        
        return true;
    }
    
    
    function VerarbeiteFragenliste(fragen) {
        /* Die Ergebnisliste ist nicht die Ausgangsliste */
        var ergebnis = [];
        
        for ( var i = 0; i < fragen.length; i++ ) {
            
            ergebnis.push(fragen[i]);
            
            if ( fragen[i].typ == "multiple-choice" ) 
            {
               
               if ( !SindAusreichendBegruendungenVorhanden(fragen[i]) )
               {
                   continue;
               }
               
               for ( j = 0; j < fragen[i].optionen.length; j++ ) 
               {
                   var wahrheit = "RICHTIG";
                   if ( ! fragen[i].optionen[j].richtig ) {
                       wahrheit = "FALSCH";
                   }
                   
                   /* Wenn in der Originalfrage angegeben ist, dass HTML in der Fragestellung 
                      escaped werden soll, dann machen wir das auch bei der Erstellung der Gegenfrage.
                    */
                   var fragentext = fragen[i].frage;
                   if ( fragen[i].escapeHtml ) {
                       fragentext = HtmlEncode(fragentext);
                   }
                   
                   
                   ergebnis.push(
                       Wuerfeltextaufgabe("<strong>Frage: </strong><br/>" + 
                            fragentext + "<br/><br/><strong>Warum ist diese Antwort " + wahrheit + "?:<br/><br/>" + 
                            HtmlEncode(fragen[i].optionen[j].text) + "</strong>", 
                            fragen[i].optionen[j].begruendung)
                   );
               }
               
               
           } 
        }
        
        return ergebnis;
    }
    
    function VerarbeiteTrainings(trainings) {
        for ( var i = 0; i < trainings.length; i++ ) {
            trainings[i].fragen = VerarbeiteFragenliste(trainings[i].fragen);
        }
    }
    
    VerarbeiteTrainings(trainings);    
}