"use strict";

var _frenchTraining$frage, _frenchTraining$frage2, _frenchTraining$frage3, _frenchTraining$frage4, _frenchTraining$frage5, _frenchTraining$frage6, _frenchTraining$frage7, _frenchTraining$frage8, _frenchTraining$frage9, _frenchTraining$frage10;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var frenchTraining = {
    name: "Apprendre français",
    description: "Learning french with Fawda",

    fragen: []
};

(_frenchTraining$frage = frenchTraining.fragen).push.apply(_frenchTraining$frage, _toConsumableArray(Beidseitig("1", "un")));
(_frenchTraining$frage2 = frenchTraining.fragen).push.apply(_frenchTraining$frage2, _toConsumableArray(Beidseitig("2", "deux")));
(_frenchTraining$frage3 = frenchTraining.fragen).push.apply(_frenchTraining$frage3, _toConsumableArray(Beidseitig("3", "trois")));
(_frenchTraining$frage4 = frenchTraining.fragen).push.apply(_frenchTraining$frage4, _toConsumableArray(Beidseitig("4", "quatre")));
(_frenchTraining$frage5 = frenchTraining.fragen).push.apply(_frenchTraining$frage5, _toConsumableArray(Beidseitig("5", "cinq")));

(_frenchTraining$frage6 = frenchTraining.fragen).push.apply(_frenchTraining$frage6, _toConsumableArray(Beidseitig("6", "six")));
(_frenchTraining$frage7 = frenchTraining.fragen).push.apply(_frenchTraining$frage7, _toConsumableArray(Beidseitig("7", "sept")));
(_frenchTraining$frage8 = frenchTraining.fragen).push.apply(_frenchTraining$frage8, _toConsumableArray(Beidseitig("8", "huit")));
(_frenchTraining$frage9 = frenchTraining.fragen).push.apply(_frenchTraining$frage9, _toConsumableArray(Beidseitig("9", "neuf")));
(_frenchTraining$frage10 = frenchTraining.fragen).push.apply(_frenchTraining$frage10, _toConsumableArray(Beidseitig("10", "dix")));

trainings.push(frenchTraining);
