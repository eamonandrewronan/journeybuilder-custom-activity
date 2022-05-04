'use strict';

const validateForm = function(cb) {
    $form = $('.js-settings-form');

    $form.validate({
        submitHandler: function(form) { },
        errorPlacement: function () { },
    });

    cb($form);
};

const connection = new Postmonger.Session();
let authTokens = {};
let payload = {};
let $form;

$(window).ready(onRender);

connection.on('initActivity', initialize);
connection.on('requestedTokens', onGetTokens);
connection.on('requestedEndpoints', onGetEndpoints);
connection.on('clickedNext', save);

const buttonSettings = {
    button: 'next',
    text: 'done',
    visible: true,
    enabled: false,
};



function onRender() {
    connection.trigger('ready');
    connection.trigger('requestTokens');
    connection.trigger('requestEndpoints');

    console.log('OnRender');

    console.log($("#DropdownCommunications"));

    $("#DropdownCommunications").hide();
    $("#Communications").hide();
    $("#CommunicationsDiv").hide();    
    $("#MethodDiv").hide();    

    $("#DropdownCommunications").change(function () {
        var comms = getComms();

        console.log('comms');
        console.log(comms);
        
        if (comms != 'Select Communication') {
            $("#MethodDiv").show();    
        }
        else {
            $("#MethodDiv").hide();    
        }


    });
    $("#DropdownOptions").change(function () {
        var vendor = getVendor();

        $("#DropdownCommunications").empty();

        console.log('vendor');
        console.log(vendor);
        
        if (vendor == 'Edipost') {

            var data = [
                { "name": "Select Communication", "value": "Select Communication" },
                { "name": "Welcome", "value": "Welcome" },
                { "name": "Renewal", "value": "Renewal" }
             ];

             console.log(data);

             for (var index = 0; index < data.length; index++) {
                console.log(data[index]);

                $('#DropdownCommunications').append('<option value="' + data[index].name + '">' + data[index].value + '</option>');
             }
        }

        if (vendor == 'ONG Conseil') {

            var data = [
                { "name": "Select Communication", "value": "Select Communication" },
                { "name": "Membership Renewal", "value": "Membership Renewal" },
                { "name": "Send Invoice", "value": "Send Invoice" }
             ];
             console.log(data);

             for (var index = 0; index < data.length; index++) {
                console.log(data[index]);
                $('#DropdownCommunications').append('<option value="' + data[index].name + '">' + data[index].value + '</option>');
             }
        }

        if (vendor == 'Call to Action') {

            var data = [
                { "name": "Select Communication", "value": "Select Communication" },
                { "name": "Fundraising Pack", "value": "Funcraising Pack" },
                { "name": "Sponsorship Request", "value": "Sponsorship Request" }
             ];
             console.log(data);

             for (var index = 0; index < data.length; index++) {
                console.log(data[index]);
                $('#DropdownCommunications').append('<option value="' + data[index].name + '">' + data[index].value + '</option>');
             }
        }

        if (vendor == 'Voxens') {

            var data = [
                { "name": "Select Communication", "value": "Select Communication" },
                { "name": "Welcome", "value": "Welcome" },
                { "name": "Renewal", "value": "Renewal" }
             ];
             console.log(data);

             for (var index = 0; index < data.length; index++) {
                console.log(data[index]);
                $('#DropdownCommunications').append('<option value="' + data[index].name + '">' + data[index].value + '</option>');
             }
        }

        if (vendor != 'Select_Vendor') {
            $("#DropdownCommunications").show();
            $("#Communications").show();    
            $("#CommunicationsDiv").show();    
        }
        else {
            $("#DropdownCommunications").hide();
            $("#Communications").hide();    
            $("#CommunicationsDiv").hide();    
            $("#MethodDiv").hide();    
        }


    });
  

    // validation
//    validateForm(function($form) {
//        $form.on('change click keyup input paste', 'input, textarea', function () {
//            buttonSettings.enabled = $form.valid();

//            console.log(buttonSettings.enabled);

  //          connection.trigger('updateButton', buttonSettings);
    //    });
  //  });
}

/**
 * Initialization
 * @param data
 */
function initialize(data) {
    if (data) {

        payload = data;
    }
    const hasInArguments = Boolean(
        payload['arguments'] &&
        payload['arguments'].execute &&
        payload['arguments'].execute.inArguments &&
        payload['arguments'].execute.inArguments.length > 0
    );

    console.log('ca.initialize - ');
    console.log(payload);
    
    const inArguments = hasInArguments
        ? payload['arguments'].execute.inArguments
        : {};

    $.each(inArguments, function (index, inArgument) {

        console.log(inArgument);

        $.each(inArgument, function (key, value) {
            const $el = $('#' + key);

            console.log(key);
            console.log(value);

            if($el.attr('type') === 'radio') {
                $el.prop('checked', value === 'true');
            } else {
                $el.val(value);
            }
        });
    });

    validateForm(function($form) {
        buttonSettings.enabled = $form.valid();

        console.log(buttonSettings.enabled);

        connection.trigger('updateButton', buttonSettings);
    });
}

/**
 *
 *
 * @param {*} tokens
 */
function onGetTokens(tokens) {
    authTokens = tokens;
}

/**
 *
 *
 * @param {*} endpoints
 */
function onGetEndpoints(endpoints) {
    console.log(endpoints);
}

function getVendor() {
    return $("#DropdownOptions").find("option:selected").attr("value").trim();
}

function getComms() {
    return $("#DropdownCommunications").find("option:selected").attr("value").trim();
}

/**
 * Save settings
 */
function save() {

    console.log('ca.save');
    console.log('ca.payload - ');
    console.log(JSON.stringify(payload['arguments'].execute.inArguments));

    if($form.valid()) {
        payload['metaData'].isConfigured = true;

        payload['arguments'].execute.inArguments = [
            {
                "contactKey": "{{Contact.Key}}",
                "contactEmail": "{{Contact.Attribute.LC_Entry_DE.Email}}"
            }
        ];

        $('.js-activity-setting').each(function () {
            const $el = $(this);
            const setting = {
                id: $(this).attr('id'),
                value: $(this).val()
            };

            console.log(JSON.stringify(setting));

            $.each(payload['arguments'].execute.inArguments, function(index, value) {

                console.log($el.attr('type'));

                if($el.attr('type') === 'radio') {

                    console.log($el.is(":checked"));
                    console.log(JSON.stringify(value));

                    if($el.is(":checked")) {
                        value[setting.id] = setting.value;
                    } else {
                        value[setting.id] = 'false';
                    }
                } else {
                    value[setting.id] = setting.value;
                }
            })
        });

        console.log('ca.payload - ');
        console.log(JSON.stringify(payload['arguments'].execute.inArguments));

        connection.trigger('updateActivity', payload);
    }
}
