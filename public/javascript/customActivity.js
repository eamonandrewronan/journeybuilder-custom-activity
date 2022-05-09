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

const commsMap={};

/*= {
    
        'Edipost': [
            { 'name': 'Select Communication', 'value': 'Select Communication' },
            { 'name': 'Welcome', 'value': 'Welcome' },
            { 'name': 'Renewal', 'value': 'Renewal' }
        ],
        'ONG Conseil' : [
            { 'name': 'Select Communication', 'value': 'Select Communication' },
            { 'name': 'Membership Renewal', 'value': 'Membership Renewal' },
            { 'name': 'Send Invoice', 'value': 'Send Invoice' }
        ],
         'Call to Action' : [
            { 'name': 'Select Communication', 'value': 'Select Communication' },
            { 'name': 'Fundraising Pack', 'value': 'Fundraising Pack' },
            { 'name': 'Sponsorship Request', 'value': 'Sponsorship Request' }
         ],
        'Voxens': [
            { 'name': 'Select Communication', 'value': 'Select Communication' },
            { 'name': 'Welcome', 'value': 'Welcome' },
            { 'name': 'Send Invoice', 'value': 'Send Invoice' }
        ]
        
}; */

const imageMap={};

/*= {
    'Welcome' : 'images/image1.png',
    'Renewal': 'images/image2.png',
    'Membership Renewal' : 'images/image3.png',
    'Send Invoice' : 'images/image4.png',
    'Fundraising Pack' : 'images/image5.png',
    'Sponsorship Request' : 'images/image6.png'
         
}; */

/*
var data1 = [
    { "name": "Select Communication", "value": "Select Communication" },
    { "name": "Welcome", "value": "Welcome" },
    { "name": "Renewal", "value": "Renewal" }
 ];

 commsMap.set('Edipost', data1);
 imageMap.set('Welcome', "images/image1.png");
 imageMap.set('Renewal', "images/image2.png");

var data2 = [
    { "name": "Select Communication", "value": "Select Communication" },
    { "name": "Membership Renewal", "value": "Membership Renewal" },
    { "name": "Send Invoice", "value": "Send Invoice" }
 ];

commsMap.set('ONG Conseil', data2);
imageMap.set('Membership Renewal', "images/image3.png");
imageMap.set('Send Invoice', "images/image4.png");


var data3 = [
    { "name": "Select Communication", "value": "Select Communication" },
    { "name": "Fundraising Pack", "value": "Fundraising Pack" },
    { "name": "Sponsorship Request", "value": "Sponsorship Request" }
    ];

commsMap.set('Call to Action', data3);
imageMap.set('Fundraising Pack', "images/image5.png");
imageMap.set('Sponsorship Request', "images/image6.png");

var data4 = [
    { "name": "Select Communication", "value": "Select Communication" },
    { "name": "Welcome", "value": "Welcome" },
    { "name": "Send Invoice", "value": "Send Invoice" }
    ];

commsMap.set('Voxens', data4);
*/

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

    if (vendor == 'Select_Vendor') {
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

    $("#DropdownCommunications").change(function () {
        var comms = getComms();

        console.log('comms');
        console.log(comms);
        
        if (comms != 'Select Communication') {
            $("#MethodDiv").show();    
            $("#PreviewDiv").show();    

            var iUrl = imageMap[comms];

            $("#PreviewImage").attr("src", iUrl);

  /*          switch (comms) {
                case 'Welcome' :
                    $("#PreviewImage").attr("src","images/image1.png");
                    break;
                case 'Renewal' :
                    $("#PreviewImage").attr("src","images/image2.png");
                    break;
                case 'Membership Renewal' :
                    $("#PreviewImage").attr("src","images/image3.png");
                    break;
                case 'Send Invoice' :
                    $("#PreviewImage").attr("src","images/image4.png");
                    break;
                case 'Fundraising Pack' :
                    $("#PreviewImage").attr("src","images/image5.png");
                    break;
                case 'Sponsorship Request' :
                    $("#PreviewImage").attr("src","images/image6.png");
                    break;
            } */

        }
        else {
            $("#MethodDiv").hide();    
            $("#PreviewDiv").hide();    
        }


    });
    $("#DropdownOptions").change(function () {
        var vendor = getVendor();

        $("#DropdownCommunications").empty();

        console.log('vendor');
        console.log(vendor);
        
        var data = commsMap[vendor];

        console.log(data);

        for (var index = 0; index < data.length; index++) {
           console.log(data[index]);

           $('#DropdownCommunications').append('<option value="' + data[index].name + '">' + data[index].value + '</option>');
        }

/*        if (vendor == 'Edipost') {

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
                { "name": "Fundraising Pack", "value": "Fundraising Pack" },
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
                { "name": "Send Invoice", "value": "Send Invoice" }
             ];
             console.log(data);

             for (var index = 0; index < data.length; index++) {
                console.log(data[index]);
                $('#DropdownCommunications').append('<option value="' + data[index].name + '">' + data[index].value + '</option>');
             }
        } */

        if (vendor != 'Select_Vendor') {
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
    console.log(JSON.stringify(data));
    
    const inArguments = hasInArguments
        ? payload['arguments'].execute.inArguments
        : {};


    $.each(inArguments, function (index, inArgument) {

        console.log(JSON.stringify(inArgument));

        $.each(inArgument, function (key, value) {
            const $el = $('#' + key);

            if ((key == 'commsMap') && ((!commsMap) || (commsMap.length == 0))) {
                commsMap = value;
            }

            if ((key == 'imageMap') && ((!imageMap) || (imageMap.length == 0))) {
                imageMap = value;
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
                if (value != 'Select_Vendor') {
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
