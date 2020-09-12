function Vokabeltrainer(fragen) {
    
    var unterstuetzteFragentypen = [
        "text",
        "multiple-choice"
    ];

    /* Wir möchten einen lustigen Hintergrundeffekt
       für den Vokabeltrainer haben: Wenn eine Frage richtig
       beantwortet wird, dann wird der Hintergrund kurz grün, sonst
       rot animiert. */
    function Hintergrundeffekt(cssKlasse) {
        
        $("body").addClass(cssKlasse);

        setTimeout(function() {
            $("body").removeClass(cssKlasse);
        }, 1000);
        
    }

    function AntwortAnzeigen(frage) {
        
        if ( frage.typ == "text" )
        {
            $("#antwort").val(frage.antwort);
        }
        
        if ( frage.typ == "multiple-choice" ) {
            $(".fragentyp-multiple-choice").find("input").each(
                function(index, value) {
                    $(value).closest(".row").find(".multiple-choice-option-begruendung").fadeIn();
                }  
            );        
        }
        
    }

    function IstAntwortKorrekt(frage) {
        switch (fragen[position].typ) {
            case "text":
                return IstAntwortKorrekt_Text(frage);
            case "multiple-choice":
                return IstAntwortKorrekt_MultipleChoice(frage);
            default :
                alert("(Antwort-Vorbereitung) Der Fragetyp " + fragetyp + " ist mir unbekannt.");
        }        
    }
    
    function IstAntwortKorrekt_Text(frage) {

        var vorbereitet = AntwortVorbereiten($("#antwort").val());
        
        console.log("Bei der Frage: " + AntwortVorbereiten(frage.antwort));
        console.log("Deine Antwort: " + vorbereitet)

        return vorbereitet === AntwortVorbereiten(frage.antwort);
         
    }
    
    function IstAntwortKorrekt_MultipleChoice(frage) {
        
        var hauptelement = $(".fragentyp-" + frage.typ);
        
        /* Wenn wir schon was anzeigen, dann faden wir es weg... */
        hauptelement.find("input").each(
            function(index, value) {
                $(value).closest(".row").find(".multiple-choice-option-begruendung").hide();
            }  
        );
        
       
        /* 1. Prüfen, ob die gewählten Lösungen dem geforderten Muster entsprechen. */
        var musterEntsprichtDemRichtigMuster = true;
        
        for ( var i = 0; i < frage.optionen.length; i++ )
        {
            var istOptionAusgewaehlt = hauptelement.find("#option" + frage.optionen[i].id).is(":checked"); 
            var sollOptionAusgewaehltSein = frage.optionen[i].richtig;
            
            console.log(istOptionAusgewaehlt + " ?? " + sollOptionAusgewaehltSein);
            
            if ( istOptionAusgewaehlt != sollOptionAusgewaehltSein ) {
                musterEntsprichtDemRichtigMuster = false;
                console.log("Leider nicht die richtige Antwort");
            }
        }        
        
        if ( !musterEntsprichtDemRichtigMuster) {
            /* Wenn nicht das richtige gewählt wurde, dann blenden wir alle Lösungen ein. */
            hauptelement.find("input").each(
                function(index, value) {
                    $(value).closest(".row").find(".multiple-choice-option-begruendung").fadeIn();
                }  
            );
        }
        
        return musterEntsprichtDemRichtigMuster;
    }

    function ZeigeFragentyp(fragetyp) {
        /* Erstmal alles ausblenden */
        for (var i = 0; i < unterstuetzteFragentypen.length; i++) {
            $(".fragentyp-" + unterstuetzteFragentypen[i]).hide();
        }

        /* Gewünschten Fragentyp einblenden */
        $(".fragentyp-" + fragetyp).show();
    }
    
    function DomFuerAufgabeVorbereiten_Text(frage) {
        
        if ( frage.escapeHtml == true )
        {
            $(".frage").text(frage.frage);
        }
        else
        {
            $(".frage").html(frage.frage);
        }
        
        $("#antwort").val("").focus();
        if ( frage["antwort-init"] !== undefined ) {
            $("#antwort").val(frage["antwort-init"]).focus();
        }
    }

    function DomFuerAufgabeVorbereiten_MultipleChoice(frage) {
        
        if ( frage.escapeHtml == true )
        {
            $(".frage").text(frage.frage);
        }
        else
        {
            $(".frage").html(frage.frage);
        }

        var hauptelement = $(".fragentyp-" + frage.typ);
        
        hauptelement.html("");
        var optionen = shuffle(frage.optionen);
        
        for ( var i = 0; i < optionen.length; i++ ) {
            var template = "";
            template += '<div class="row"><div class="col-sm-12">';
            template += '<input type="checkbox" id="option' + optionen[i].id + '" class="multiple-choice-option mc-position-' + (i+1) + '">';
            template += '<label for="option' + optionen[i].id + '">';
            template += (i+1) + ') ' + HtmlEncode(optionen[i].text);
            template += '</label></div>';
            if ( optionen[i].richtig )
            {
                template += '<div class="col-sm-12 alert alert-success multiple-choice-option-begruendung" style="display:none">';
            }
            else
            {
                template += '<div class="col-sm-12 alert alert-danger multiple-choice-option-begruendung" style="display:none">';
            }
            template += HtmlEncode(optionen[i].begruendung);
            template += '</div>';
            template += '</div>';
            
            hauptelement.append(template);
        }
    }
    
    function DomFuerAufgabeVorbereiten(frage) {
        switch (fragen[position].typ) {
            case "text":
                DomFuerAufgabeVorbereiten_Text(frage);
                break;
            case "multiple-choice":
                DomFuerAufgabeVorbereiten_MultipleChoice(frage);
                break;
            default :
                alert("(DOM-Vorbereitung) Der Fragetyp " + fragetyp + " ist mir unbekannt.");
        }
    }

    function TestErfolgreichAbgeschlossen() {
        $("#antwort").parent().html("<div class='richtig'>SEHR GUT!</div>");
        $("#ergebnis").html("<div class='richtig'>FERTIG!</div>");
        $("#antworten").remove();
    }

    function AntwortVorbereiten(antwort) {
        /* Wir haben leider nicht die Möglichkeiten 
           die Antwort bereits Mehrzeilig anzugeben. 
           Also müssen wir die Antwort aus der Textarea vor dem Vergleich vorbereiten. 
        */
        
        /* Toleranz gegenüber Spaces vor und hinter runden Klammern */
        antwort = antwort.replace(/\(/g, ' ( ');
        antwort = antwort.replace(/\)/g, ' ) ');
        
        /* Case insensitive */
        antwort = antwort.toLowerCase();
        
        /* zu viele Leerzeichen oder Leerzeilen vorne und hinten. */
        antwort = antwort.trim();

        /* Komische Linefeeds und Folgen von vielen Whitespaces elemenieren */
        antwort = antwort.replace(/(\r\n|\n|\r)/gm, ' ');
        antwort = antwort.replace(/\s+/g, ' ');


        return antwort;
    }

    function NaechsteFrage() {
        $("#antworten").off("click");
        $("#antwortAnzeigen").off("click");
        $("#ergebnis").html("");
        
        $("#training").text(fragen[position].training);
        $("#positionsangabe").text((position+1) + " / " + fragen.length + " [ APS: " + Aufgabenpunktesystem.PunkteFuerFrage(fragen[position]) + " ]");
       
        ZeigeFragentyp(fragen[position].typ);

        DomFuerAufgabeVorbereiten(fragen[position]);

        $("#antwortAnzeigen").on("click", function(event) {
            AntwortAnzeigen(fragen[position]);
        });

        $("#antworten").on("click", function (event) {
            
            if ( IstAntwortKorrekt(fragen[position]) ) {
                $("#ergebnis").html("<div class='richtig'>RICHTIG</div>");
                Hintergrundeffekt("richtig-hintergrund");
                Aufgabenpunktesystem.FrageWurdeRichtigBeantwortet(fragen[position]);
                
                position += 1;
                if (position > (fragen.length - 1)) {
                    TestErfolgreichAbgeschlossen();
                    return;
                }
                window.setTimeout(function () { NaechsteFrage(); }, 1000);
            }
            else {
                $("#ergebnis").html("<div class='falsch'>FALSCH</div>");
                Hintergrundeffekt("falsch-hintergrund");
                Aufgabenpunktesystem.FrageWurdeFalschBeantwortet(fragen[position]);
                /* Wenn der Nutzer falsch antwortet, dann fügen wir 
                   die Frage hinten an der Liste nochmal an :). */
                /* Zum Schluss nochmal fragen */
                fragen.push(fragen[position]);
                /* Ein bisschen Konsequenz sofort */
                fragen.splice(position+1, 0, fragen[position]);
                /* erhöhte Strafe zum besseren Training */
                fragen.splice(position+1, 0, fragen[position]);

                
                $("#positionsangabe").text((position+1) + " / " + fragen.length + " [ APS: " + Aufgabenpunktesystem.PunkteFuerFrage(fragen[position]) + " ]");
            }
            
        });
    }



    /* Tabs akzeptieren (und als Spaces in die Textarea einfügen) */
    $("textarea").keydown(function (e) {
        if (e.keyCode === 9) {
            var start = this.selectionStart;
            var end = this.selectionEnd;

            var $this = $(this);
            var value = $this.val();
            $this.val(value.substring(0, start) + "    " + value.substring(end));
            this.selectionStart = this.selectionEnd = start + 4;
            e.preventDefault();
        }
        
        if (e.keyCode === 13 && !e.ctrlKey ) {
            if ( $(e.target).is(":visible") )
                e.stopPropagation();
        }
    });

    $("body").on("keydown", function(e) {
        if (e.keyCode == 13) {
            $("#antworten").click();
            e.preventDefault();
        }
            
        /* 1,2,3,4,5,6,7,8,9 + Strg als Hotkey für die MC-Fragen*/
        if (e.keyCode >= 49 && e.keyCode <= 57) {
            var idSelector = ".mc-position-" + String.fromCharCode(e.keyCode);
            $(idSelector).prop("checked", !$(idSelector).prop("checked"));
        }
    });


    var position = 0;
    NaechsteFrage();
};


/* GEGENFRAGENGENERATOR FÜR DIE MC-AUFGABEN */

Gegenfragengenerator(trainings);


/*
    Konfiguration
*/
(function Konfiguration(Vokabeltrainer, trainings) {
    
    function VokabeltrainerStarten(fragen)
    {
        Vokabeltrainer(fragen);
    }
    
    function TrainingsDurchnummerieren() {
        for ( var i = 0; i < trainings.length; i++ )
        {
            trainings[i].Id = i;
        }
    }
    
    function FragenMitTrainingsnameVersehen() {
        for ( var i = 0; i < trainings.length; i++ )
        {
            for (var j = 0; j < trainings[i].fragen.length; j++) {
                trainings[i].fragen[j].training = trainings[i].name;
            }
            
            /* Sorry, das ist nicht ganz sauber, bietet sich hier aber an. 
               Einfach alle Punktestände laden...
             */
            FragenMitHashUndPunktezahlVersehen(trainings[i].fragen);
        }
    }

    
    function DefaultfragentypIst(defaulttyp) {
        for ( var i = 0; i < trainings.length; i++ )
        {
            for (var j = 0; j < trainings[i].fragen.length; j++) {
                if (trainings[i].fragen[j].typ === undefined ) 
                    trainings[i].fragen[j].typ = defaulttyp;
            }
        }
    }
    
    function TrainingsauswahlZusammenstellen() {
        /* gemerkte Werte ermitteln */
        var trainingsAuswahl = [];
        
        if (window.localStorage.trainingsAuswahl !== undefined) {
            trainingsAuswahl = JSON.parse(window.localStorage.trainingsAuswahl);
        }

        /* Trainings alphabethisch sortieren */
        trainings.sort(function(x,y) {
            if ( x.name > y.name )
                return 1;
            if ( x.name < y.name)
                return -1;
            return 0;
        });
        
        /* Auswahl rendern */
        var ergebnis = '<ul class="list-unstyled">\n';
        
        for ( var i = 0; i < trainings.length; i++ ) {
            console.log(trainings[i].name);
            var checkedAttr = "";
            if (trainingsAuswahl.indexOf(trainings[i].name) > -1) {
                checkedAttr = " checked";
            }
            
            var punkte = Aufgabenpunktesystem.FragenlisteBewerten(trainings[i].fragen);
            
            ergebnis += '<li><label for="training-' + trainings[i].Id + '"><input type="checkbox" id="training-' + trainings[i].Id + '" ' + checkedAttr + '/> ' + HtmlEncode(trainings[i].name) + ' (' + trainings[i].fragen.length + ' Aufgaben)</label>'
            ergebnis += '<p class="indent-1"><small><strong style="color:' + punkte.farbempfehlung + '">' + punkte.erreichtePunktezahl + " / " + punkte.moeglichePunktezahl + " (" + punkte.inProzent + ")" + "</strong></small></p>";
            ergebnis += '<p class="indent-1"><small>' + trainings[i].description + "</small></p>";
            ergebnis += '</li>';
        }
        
        ergebnis += '</ul>';
        
        $("#verfuegbare-trainings").html(ergebnis);
        
    }
    
    function TrainingauswahlMerken() {
        var auswahl = [];
        
        for ( var i = 0; i < trainings.length; i++ ) {
            if ( $("#training-" + trainings[i].Id).is(":checked") ) {
                auswahl.push(trainings[i].name);
            }
        }
        
        window.localStorage.trainingsAuswahl = JSON.stringify(auswahl);
    }
    
    function FragenSammeln() {
        var fragen = [];
        
        for ( var i = 0; i < trainings.length; i++ ) {
            if ( $("#training-" + trainings[i].Id).is(":checked") ) {
                fragen = fragen.concat(trainings[i].fragen);
            }
        }
        
        console.log(fragen.length + " Fragen zusammengesammelt");
        return fragen;
    }
    
    /* Je nach Punkten kann der Übende bestimmte Bereiche 
       bereits ganz gut. Die Dinge die er gut kann sollten mit 
       deutlich geringerer Wahrscheinlichkeit auftauchen, als die
       die er kann. */
    function EntferneFragenMitWarscheinlichkeit(fragen) {
        for (var i = fragen.length-1; i >= 0; i--) {
            if (ZufallsentfallZuPunktestand(fragen[i].punkte)) {
                console.log(fragen[i].frage + "(" + fragen[i].punkte + ") entfällt.");
                fragen.splice(i, 1);
            }
        }
    }
    
    function HashErmitteln(frage) {
        /* Wir dürfen bei der Ermittlung des Hashs alle 
           Felder einbeziehen, außer Antwort-init. 
           Dieses Feld kann bei Würfeltextaufgaben jedes mal anders aussehen.
           Daher würden wir uns Punkte nicht mehr merken.
        */
        var frageOhneZufallselement = {};
        
        for (var property in frage) {
            if (property !== "antwort-init")
                frageOhneZufallselement[property] = frage[property];
        }
        
        
        return MD5( JSON.stringify(frageOhneZufallselement) );
    }
    
    
    function FragenMitHashUndPunktezahlVersehen(fragen) {
        for ( var i = 0; i < fragen.length; i++ )
        {
            fragen[i].hash = HashErmitteln( fragen[i] );
            fragen[i].punkte = Aufgabenpunktesystem.PunkteFuerFrage(fragen[i]);
        }        
    }    
    
    function FragenSortieren(fragen) {
        
        /* Als erstes sortieren wir immer nach den Punkten. 
           Auf diese Weise stehen die "bedürftigsten" Fragen 
           immer vorne an. 
         */
        fragen.sort(function( a, b ) {
            if (a.punkte > b.punkte)
                return 1;
            if (a.punkte < b.punkte)
                return -1;
            return 0;
        });;
        
        window.localStorage.ReihenfolgeAuswahl = "#reihenfolge-nacheinander";
        if ( $("#reihenfolge-zufall").is(":checked") ) {
            window.localStorage.ReihenfolgeAuswahl = "#reihenfolge-zufall";

            shuffle(fragen);
            
            /* Durcheinanderwerfen ist ok, aber zum Schluss müssen 
               die Fragen mit dem größten Lernbedarf dennoch vorne liegen. 
             */            
            fragen.sort(function( a, b ) {
                if (a.punkte > b.punkte)
                    return 1;
                if (a.punkte < b.punkte)
                    return -1;
                return 0;
            });;
            
            return;
        }
    }
    
    function FragenBegrenzen(fragen) {

        if ( $("#anzahl-5").is(":checked") ) {
            window.localStorage.AnzahlAuswahl = "#anzahl-5";
            return fragen.slice(0, 5);
        }        
        if ( $("#anzahl-30").is(":checked") ) {
            window.localStorage.AnzahlAuswahl = "#anzahl-30";
            return fragen.slice(0, 30);
        }
        if ( $("#anzahl-45").is(":checked") ) {
            window.localStorage.AnzahlAuswahl = "#anzahl-45";            
            return fragen.slice(0, 45);
        }
        if ( $("#anzahl-100").is(":checked") ) {
            window.localStorage.AnzahlAuswahl = "#anzahl-100";
            return fragen.slice(0, 100);
        }
     
        window.localStorage.AnzahlAuswahl = "#anzahl-alle";
        return fragen;   
    }
    
    
    $(".konfigurations-bereich").show();
    $(".vokabeltrainer-bereich").hide();
    
    /* Wir merken uns die Auswahlen in der UI und stellen sie von alleine wieder her. */
    $(window.localStorage.AnzahlAuswahl).attr("checked", "checked");
    $(window.localStorage.ReihenfolgeAuswahl).attr("checked", "checked");
    
    TrainingsDurchnummerieren();
    FragenMitTrainingsnameVersehen();
    DefaultfragentypIst("text");
    TrainingsauswahlZusammenstellen();
    
    $("#training-starten").on("click", function() {
        TrainingauswahlMerken();
        
        var fragen = FragenSammeln();
        EntferneFragenMitWarscheinlichkeit(fragen);
        
        if (fragen.length == 0) {
            alert("Du musst vorher die Trainings auswählen.");
            return;
        }
        
        FragenSortieren(fragen);
        fragen = FragenBegrenzen(fragen);
        
        $(".konfigurations-bereich").hide();
        $(".vokabeltrainer-bereich").show();
        
        VokabeltrainerStarten(fragen);
    });
    
})(Vokabeltrainer, trainings);



