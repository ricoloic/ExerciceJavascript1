$(document).ready(function () {
    $("#numElev_2, #numElev_3, #elevPriceUnit, #elevTotal, #installationFee, #total_").attr('readonly', true);

    var numApp, numFloors, numBase, maxOcc, numElev;
    var prodRange = {
        type: null,
        price: null,
        installationFeePercentage: null
    };

    $('.formField').on('keyup', function () {
        doCalc();
    });


    $('#standard').on('click', function () {
        document.getElementById('elevPriceUnit').value = (7565).toFixed(2) + " $";
        doCalc();
        checkNaN();
    });

    $("#premium").on("click", function () {
        $('#elevPriceUnit').val((12345).toFixed(2) + ' $');
        doCalc();
    });

    $("#excelium").on("click", function () {
        $('#elevPriceUnit').val((15400).toFixed(2) + ' $');
        doCalc();
    });

    $('#residential, #commercial, #corporate, #hybrid').on('click', function () {
        initialize();
    });


    function initialize() {
        $('.formField').val('');
        $('.productRangeBtn').prop('checked', false);
    };

    function getInfoNumApp() {
        numApp = parseInt($('#numApp').val(), 10);
    };
    function getInfoNumFloors() {
        numFloors = parseInt($('#numFloors').val(), 10);
    };

    function getInfoNumBase() {
        numBase = parseInt($('#numBase').val(), 10);
    };

    function getInfoNumElev() {
        numElev = parseInt($('#numElev').val(), 10);
    };

    function getInfoMaxOcc() {
        maxOcc = parseInt($('#maxOcc').val(), 10);
    };

    function checkNaN() {
        if (isNan(parseFloat($('#numElev_3').val(), 10))) {
            $('#numElev_3').val('');
        }

        if (isNan(parseFloat($('#numElev_2').val(), 10))) {
            $('#numElev_2').val('');
        }

        if (isNan(parseFloat($('#elevTotal').val(), 10))) {
            $('#elevTotal').val('');
        }
        
        if (isNan(parseFloat($('#installationFee').val(), 10))) {
            $('#installationFee').val('');
        }

        if (isNan(parseFloat($('#total_').val(), 10))) {
            $('#total_').val('');
        }
    }

    function getProdRange() {
        if ($('#standard').is(':checked')) {
            prodRange.type = "standard";
            prodRange.price = 7565;
            prodRange.installationFeePercentage = 0.1;
            return prodRange;

        } else if ($('#premium').is(':checked')) {
            prodRange.type = "premium";
            prodRange.price = 12345;
            prodRange.installationFeePercentage = 0.13;
            return prodRange;

        } else if ($('#excelium').is(':checked')) {
            prodRange.type = "excelium";
            prodRange.price = 15400;
            prodRange.installationFeePercentage = 0.16;
            return prodRange;
        } else {
            prodRange.type = null,
            prodRange.price = null,
            prodRange.installationFeePercentage = null
            return prodRange;
        }
    };

    function GetInfos() {
        getInfoNumApp();
        getInfoNumFloors();
        getInfoNumBase();
        getInfoNumElev();
        getInfoMaxOcc();
        getProdRange();
    };

    function setPricesResults(finNumElev, roughTotal, installFee, total) {
        $("#numElev_2, #numElev_3").val(parseFloat(finNumElev));
        $("#elevTotal").val(parseFloat(roughTotal).toFixed(2) + " $");
        $("#installationFee").val(parseFloat(installFee).toFixed(2) + " $");
        $("#total_").val(parseFloat(total).toFixed(2) + " $");
    };

    function emptyElevatorsNumberAndPricesFields() {
        $('#numElev_2, #numElev_3').val('');
        $('.priceField').val('');
    };

    function createFormData(projectType) {
        return {
            numberApp: numApp,
            numberFloors: numFloors,
            numberBase: numBase,
            maximumOcc: maxOcc,
            productRange: prodRange,
            projectType: projectType
        }
    };

    function negativeValues() {
        if ($('#numApp').val() < 0) {

            alert("Please enter a positive number!");
            $('#numApp').val('');
            return false;

        } else if ($('#numFloors').val() < 0) {

            alert("Please enter a positive number!");
            $('#numFloors').val('');
            return false;

        } else if ($('#numBase').val() < 0) {

            alert("Please enter a positive number!");
            $('#numBase').val('');
            return false;

        } else if ($('#numComp').val() < 0) {

            alert("Please enter a positive number!");
            $('#numComp').val('');
            return false;

        } else if ($('#numPark').val() < 0) {

            alert("Please enter a positive number!");
            $('#numPark').val('');
            return false;

        } else if ($('#numElev').val() < 0) {

            alert("Please enter a positive number!");
            $('#numElev').val('');
            return false;

        } else if ($('#numCorpo').val() < 0) {

            alert("Please enter a positive number!");
            $('#numCorpo').val('');
            return false;

        } else if ($('#maxOcc').val() < 0) {

            alert("Please enter a positive number!");
            $('#maxOcc').val('');
            return false;
        } else {
            return true;
        }
    };


    function apiCall(projectType) {
        //Getting numbers from quote
        GetInfos();

        //Preparing data for Api call
        var formData = createFormData(projectType);

        $.ajax({
            type: "POST",
            // url: 'http://localhost:3000/api/quoteCalculation/', //for local testing
            url: 'https://rocketelevators-quote.herokuapp.com/api/quoteCalculation/',
            data: JSON.stringify(formData),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                if (prodRange.type != null) {
                    setPricesResults(data.finalNumElev, data.subTotal, data.installationFee, data.grandTotal);
                }
            }
        });
    }
    
    function doCalc() {
        if ($('#residential').hasClass('active') && negativeValues()) {
            apiCall('residential');
            checkNaN();
        } else if ($('#commercial').hasClass('active') && negativeValues()) {
            apiCall('commercial');
            checkNaN();
        } else if ($('#corporate').hasClass('active') && negativeValues()) {
            apiCall('corporate');
            checkNaN();
        } else if ($('#hybrid').hasClass('active') && negativeValues()) {
            apiCall('hybrid');
            checkNaN();
        } else {
            emptyElevatorsNumberAndPricesFields();
        };
    };
});
