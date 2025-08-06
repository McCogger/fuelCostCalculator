document.addEventListener('DOMContentLoaded', function () {
  var efficiencyInput = document.getElementById('efficiency');
  var efficiencyUnitSelect = document.getElementById('efficiencyUnit');
  var fuelPriceInput = document.getElementById('fuelPrice');
  var priceUnitSelect = document.getElementById('priceUnit');
  var currencySelect = document.getElementById('currency');
  var mapUnitSelect = document.getElementById('mapUnit');
  var autoFuelCheckbox = document.getElementById('autoFuelPrice');
  var saveButton = document.getElementById('saveButton');
  var saveMessage = document.getElementById('saveMessage');

  // Recupera i valori salvati
  chrome.storage.sync.get([
    'efficiencyInputted',
    'efficiencyUnit',
    'fuelPrice',
    'priceUnit',
    'currency',
    'mapUnit',
    'costPerKilometre',
    'costPerMile',
    'autoFuelEnabled'
  ], function (items) {
    if (items.efficiencyInputted) {
      efficiencyInput.value = items.efficiencyInputted;
    }
    if (items.efficiencyUnit) {
      efficiencyUnitSelect.value = items.efficiencyUnit;
    }
    if (items.fuelPrice) {
      fuelPriceInput.value = items.fuelPrice;
    }
    if (items.priceUnit) {
      priceUnitSelect.value = items.priceUnit;
    }
    if (items.currency) {
      currencySelect.value = items.currency;
    }
    if (items.mapUnit) {
      mapUnitSelect.value = items.mapUnit;
    }
    if (items.autoFuelEnabled !== undefined) {
      autoFuelCheckbox.checked = items.autoFuelEnabled;
    }
  });

  // Salva i dati al click
  saveButton.addEventListener('click', function () {
    var efficiencyInputted = parseFloat(efficiencyInput.value);
    var efficiencyUnit = efficiencyUnitSelect.value;
    var fuelPrice = parseFloat(fuelPriceInput.value);
    var priceUnit = priceUnitSelect.value;
    var currency = currencySelect.value;
    var mapUnit = mapUnitSelect.value;
    var autoFuelEnabled = autoFuelCheckbox.checked;

    var costPerMile, costPerKilometre;

    // Conversion factors
    const mpgUsToKpl = 0.425144;
    const mpgUkToKpl = 0.354006;
    const literToUSGallon = 3.785411784;
    const literToUKGallon = 4.54609;
    const mileToKilometre = 1.609344;

    // Convert efficiency to KPL
    let efficiency;
    if (efficiencyUnit === 'mpg_us') {
      efficiency = efficiencyInputted * mpgUsToKpl;
    } else if (efficiencyUnit === 'mpg_uk') {
      efficiency = efficiencyInputted * mpgUkToKpl;
    } else if (efficiencyUnit === 'l_per_100_km') {
      efficiency = 100 / efficiencyInputted;
    } else {
      efficiency = efficiencyInputted;
    }

    // Convert fuel price to price per liter
    let fuelPricePerliter;
    if (priceUnit === 'us_gallon') {
      fuelPricePerliter = fuelPrice / literToUSGallon;
    } else if (priceUnit === 'uk_gallon') {
      fuelPricePerliter = fuelPrice / literToUKGallon;
    } else {
      fuelPricePerliter = fuelPrice;
    }

    // Calculate cost
    costPerKilometre = fuelPricePerliter / efficiency;
    costPerMile = costPerKilometre * mileToKilometre;

    // Salva tutto
    chrome.storage.sync.set({
      efficiency: efficiency,
      efficiencyInputted: efficiencyInputted,
      efficiencyUnit: efficiencyUnit,
      fuelPrice: fuelPrice,
      priceUnit: priceUnit,
      currency: currency,
      mapUnit: mapUnit,
      costPerKilometre: costPerKilometre.toFixed(6),
      costPerMile: costPerMile.toFixed(6),
      autoFuelEnabled: autoFuelEnabled
    });

    // Messaggio di conferma
    saveMessage.textContent = 'Saved! Refresh Google Maps to see changes';
    saveMessage.style.display = 'inline';
    setTimeout(function () {
      saveMessage.style.display = 'none';
    }, 5000);
  });
});
