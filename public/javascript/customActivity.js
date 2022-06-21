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

let commsMap;

let imageMap;

console.log(JSON.stringify(commsMap));
console.log(JSON.stringify(imageMap));

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

//    console.log($("#DropdownCommunications"));

    console.log(JSON.stringify(commsMap));
    console.log(JSON.stringify(imageMap));

    var vendor = getVendor();

    if (vendor == 'Select Vendor') {
        $("#DropdownCommunications").hide();
        $("#Communications").hide();
        $("#CommunicationsDiv").hide();    
        $("#MethodDiv").hide();    
        $("#PreviewDiv").hide();    
    }

    var comms = getComms();
    
    if (comms == 'Select Communication') {
        $("#MethodDiv").hide();    
        $("#PreviewDiv").hide();    
    }


    $("#DropdownOptions").change(function () {
        var vendor = getVendor();

        $("#DropdownCommunications").empty();

        console.log('vendor');
        console.log(vendor);
        console.log(commsMap);
        
        var data = commsMap[vendor];

        console.log(data);

        for (var index = 0; index < data.length; index++) {
           console.log(data[index]);

           $('#DropdownCommunications').append('<option value="' + data[index].Name + '">' + data[index].Value + '</option>');
        }

        if (vendor != 'Select Vendor') {
            $("#DropdownCommunications").show();
            $("#Communications").show();    
            $("#CommunicationsDiv").show(); 
            $("#DropdownCommunications").change();   
   
        }
        else {
            $("#DropdownCommunications").hide();
            $("#Communications").hide();    
            $("#CommunicationsDiv").hide();    
            $("#MethodDiv").hide();    
            $("#PreviewDiv").hide();    
        }


    });
  
    $("#DropdownCommunications").change(function () {
        var comms = getComms();

        console.log('comms');
        console.log(comms);
        console.log(imageMap);

        if (comms != 'Select Communication') {
            $("#MethodDiv").show();    
            $("#PreviewDiv").show();    

            var iUrl = imageMap[comms];

            console.log(iUrl);

            $("#PreviewImage").attr("src", iUrl);

        }
        else {
            $("#MethodDiv").hide();    
            $("#PreviewDiv").hide();    
        }


    });
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
    console.log(JSON.stringify(data));
    
    const inArguments = hasInArguments
        ? payload['arguments'].execute.inArguments
        : {};


    $.each(inArguments, function (index, inArgument) {

        console.log(JSON.stringify(inArgument));

        $.each(inArgument, function (key, value) {
            const $el = $('#' + key);

            if ((key == 'commsMap') && ((!commsMap) || (commsMap.length == 0))) {
                console.log('Setting Comms Map');

                commsMap = value;
                console.log(commsMap);

                $("#DropdownOptions").empty();

                $('#DropdownOptions').append('<option value="Select Vendor">Select Vendor</option>');

                for(var i in commsMap){
                    $('#DropdownOptions').append('<option value="' + i + '">' + i + '</option>');

                }
            }

            if ((key == 'imageMap') && ((!imageMap) || (imageMap.length == 0))) {
                console.log('Setting Image Map');

                imageMap = value;
                console.log(imageMap);
            }

            console.log(key);
            console.log(value);
            console.log($el);

            if($el.attr('type') === 'radio') {

                if (value == 'on') {
                    $el.prop('checked', true);
                }
                else {
                    $el.prop('checked', false);
                }
            } else {
                $el.val(value);
            }

            if (key == 'DropdownOptions') {
                if (value != 'Select Vendor') {
                    $("#DropdownCommunications").show();
                    $("#Communications").show();
                    $("#CommunicationsDiv").show(); 
                    $("#DropdownOptions").change();   
                }
            
            }
            if (key == 'DropdownCommunications') {
                if (value != 'Select Communication') {
                    $("#MethodDiv").show();    
                    $("#PreviewDiv").show();    
                    $("#DropdownCommunications").change();   

                }
            
            }

        });
    });

    console.log(imageMap);
    console.log(commsMap);

 

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

  //      payload['arguments'].execute.inArguments = [
  //          {
   //             "contactKey": "{{Contact.Key}}",
    //            "contactEmail": "{{Contact.Attribute.Contact_DE_LC.Email}}"
    //        }
   //     ];

        $('.js-activity-setting').each(function () {
            const $el = $(this);
            const setting = {
                id: $(this).attr('id'),
                value: $(this).val()
            };

            console.log(JSON.stringify(setting));

            let valToStore;
            let idToStore = setting.id;

            console.log($el.attr('type'));
            console.log('setting id - ' + setting.id);
            console.log('setting.value - ' + setting.value);
            console.log('idToStore - ' + idToStore);
        
            if($el.attr('type') === 'radio') {

                console.log($el.is(":checked"));

                if($el.is(":checked")) {
                    valToStore = setting.value;
                } else {
                    valToStore = 'false';
                }
            } else {
                valToStore = setting.value;
            }

            let found = false;

            $.each(payload['arguments'].execute.inArguments, function(index, value) {

                console.log(JSON.stringify(value));
                
                console.log('key - ' + Object.keys(value)[0]);
                console.log('idToStore - ' + idToStore);
                console.log('valToStore - ' + valToStore);
                console.log('index - ' + index);

                if (Object.keys(value)[0] == idToStore) {
                    value = valToStore;
                    found = true;
                    console.log('found');

                    let newVal = {[idToStore]:valToStore};

                    payload['arguments'].execute.inArguments.splice(index, 1);
                    payload['arguments'].execute.inArguments.push(newVal);
    
                }

            })

            if (found == false) {

                let newVal = {[idToStore]:valToStore};

                payload['arguments'].execute.inArguments.push(newVal);
            }
        });

        console.log('ca.payload - ');
        console.log(JSON.stringify(payload['arguments'].execute.inArguments));

        connection.trigger('updateActivity', payload);
    }
}
