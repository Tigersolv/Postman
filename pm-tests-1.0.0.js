function testResponseLength() {
    console.log("testResponseLength - Starting...");
    pm.test("Response length", function() {
        var actualLength = Object.keys(jsonResponse).length;
        pm.expect(pm.environment.get("ExpectedResponseLength")).to.equal(actualLength);
    });
    console.log("testResponseLength - Completed");
}

function testArray(containerName, arrayName, arrayLength) {
    console.log("testArray - Starting...");
    pm.test("Testing Table arrary", function(){
        var jsonResponse = pm.response.json();
        var tables = jsonResponse[containerName][arrayName];
        pm.expect(tables).to.be.an('array');
        pm.expect(tables).to.have.lengthOf(arrayLength);
    });
    console.log("testArray - Completed");
}




function testResponseStatus() {
    console.log("testResponseStatus - Starting...");
    pm.test("Response Status", function() {
        pm.response.to.have.status(pm.environment.get("ExpectedResponseStatus"));
    });
    console.log("testResponseStatus - Completed");
}

function testResponseMessage() {
    console.log("testResponseMessage - Starting...");
    pm.test("Response Message", function() {
        var expectedMessage = pm.environment.get("ResponseMessage");
        var key = pm.environment.get("ResponseMessageKey");
        
        if (expectedMessage !== "" && key !== "") {
            if(pm.environment.get("AcceptType")=="application/json"){
                pm.expect(pm.response.text()).to.equal('{"' + key + '":"' + expectedMessage + '"}');
            }else{
                pm.expect(pm.response.text()).to.equal('<"' + key + '":"' + expectedMessage + '">}');  
            }
        }
    });
    console.log("testResponseMessage - completed");
}

function testAttributes() {
    console.log("testAttributes - Starting...");
    
    var expectedAttributes = pm.environment.get("Attributes");
    if(expectedAttributes!=''){
        expectedAttributes = JSON.parse(expectedAttributes);

        for (var key in expectedAttributes) {
            if (expectedAttributes.hasOwnProperty(key)) {
                //console.log("Key is " + key + ", value is" + expectedAttributes[key]);
                
                if(Array.isArray(expectedAttributes[key])){
                    testArrayAttribute(key, expectedAttributes[key]);
                }else{
                    testAttribute(key, expectedAttributes[key]);
                }

            }
        } 
    }

    console.log("testAttributes - Completed");
}

function testArrayAttribute(attributeName, expectedValue){
    console.log("testArrayAttribute(" + attributeName + ") - Starting...");
    
    pm.test("Testing Array Attribute '" + attributeName + "'", function(){
        pm.expect(jsonResponse).to.have.property(attributeName);
        
        var actualValue;
        actualValue = jsonResponse[attributeName];
        
        pm.expect(actualValue).to.be.an('array');
        pm.expect(actualValue).to.deep.equal(expectedValue);
    })

    console.log("testArrayAttribute - Completed");
  
}
function testAttribute(attributeName, expectedValue) {
    pm.test("Attribute [" + attributeName + "] value", function() {
        var actualValue;

        pm.expect(jsonResponse).to.have.property(attributeName);

        if (pm.environment.get("TestType") === "JSON") {
            actualValue = jsonResponse[attributeName];
        }

        if (attributeName == "Id" && expectedValue == "") {
            // nothing to do - cannot predict value
        //} else if (attributeName == "Reference" && expectedValue == "" && actualValue == id) {
            // nothing to - cannot predict value
        } else if(attributeName=="Table"){
            
        } else {
            //console.log(attributeName + ".actualValue=" + actualValue);
            //console.log(attributeName + ".expectedValue=" + expectedValue);
            pm.expect(actualValue).to.equal(expectedValue);
        }
    });
}
/* 
var testType = pm.environment.get("TestType");
var controllerName = pm.environment.get("ControllerName");
var controllerDataLength = pm.environment.get("ControllerDataLength");
var classNumber = pm.environment.get("ClassNumber"); 
var responseStatus = pm.environment.get("ResponseStatus");
var responseTime = pm.environment.get("ResponseTime");
var responseLength = pm.environment.get("ResponseLength");
var expectedCreatedBy = pm.environment.get("CreatedByUserName");
var expectedCreatedDate = pm.environment.get("CreatedDate");
var expectedEditedBy = pm.environment.get("EditedByUserName");
var expectedEditedDate = pm.environment.get("EditedDate");
var expectedId = pm.environment.get("ExpectedId");
var expectedReference = pm.environment.get("ExpectedReference");
var jsonResponse = null;
var debug = false;


function testElement(elementName, expectedValue){
    pm.test(controllerName + " includes " + elementName + " element", function () {
        var controllerData = jsonResponse;
        if(pm.environment.get("TestType")==="Xml"){
			controllerData = controllerData[controllerName];
		} else if(pm.environment.get("TestType")==="JSON"){
		    controllerData = jsonResponse;
		}

        pm.expect(controllerData).to.have.property(elementName);
        pm.expect(controllerData[elementName] === expectedValue);
    }); 
}
function testElementsElement(){
    
    var elementName="Elements";
    var expectedLength = pm.environment.get("ExpectedElementsCount");
    var actualLength = 0;
    
    pm.test(controllerName + " includes " + elementName + " element", function () {
        var controllerData = jsonResponse;
        if(pm.environment.get("TestType")==="Xml"){
            //console.log("controllerData: " + JSON.stringify(controllerData));
            controllerData = controllerData[controllerName]["Elements"];
            //console.log("Elements: " + JSON.stringify(controllerData));
            if(controllerData["Organisation"]!=null){actualLength += Object.keys(controllerData["Organisation"]).length};
            //console.log("Actual Length: " + actualLength);
		} else if(pm.environment.get("TestType")==="JSON"){
		    controllerData = jsonResponse;
		    //console.log("Elements: " + JSON.stringify(controllerData));
		    actualLength += jsonResponse["Elements"].length;
		}
        pm.expect(actualLength).to.equal(expectedLength);
    }); 
}
function testOrganisations(){
    
    console.log("testOrganisations");
    
    var elementName="Organisations";
    var expectedLength = pm.environment.get("ExpectedOrganisationsCount");
    var actualLength = 0;
    
    pm.test(controllerName + " includes " + elementName + " element", function () {
        var controllerData = jsonResponse;
        if(pm.environment.get("TestType")==="Xml"){
            //console.log("controllerData: " + JSON.stringify(controllerData));
            controllerData = controllerData[controllerName]["Elements"];
            //console.log("Elements: " + JSON.stringify(controllerData));
            if(controllerData["Organisation"]!=null){actualLength += Object.keys(controllerData["Organisation"]).length};
            //console.log("Actual Length: " + actualLength);
		} else if(pm.environment.get("TestType")==="JSON"){
		    controllerData = jsonResponse["Organisations"];
		    if(controllerData!=null){actualLength += controllerData.length;}
		    //console.log("Elements: " + JSON.stringify(controllerData));
		    
		}

        pm.expect(actualLength).to.equal(expectedLength);
    }); 
}

function testResponseTime(){
    console.log("testResponseTime");
    if(responseTime>0){
        pm.test("Response time", function () {
            pm.expect(pm.response.responseTime).to.be.below(responseTime);
        }); 
    }
}

function testControllerName(){
    console.log("testControllerName");
	//console.log(JSON.stringify(jsonResponse));
    pm.test("Includes " + controllerName, function () {
        pm.expect(jsonResponse).to.have.property(controllerName);
    });
}
function testControllerLength(){
    console.log("testControllerLength");
    pm.test(controllerName + " length", function () {
        var controllerData = jsonResponse[controllerName];
        pm.expect(Object.keys(controllerData).length).to.equal(controllerDataLength);
    });
}


*/


function testArray(parent, arrayPropertyName, arrayLength){
    console.log("testArray('" + arrayPropertyName + "') is starting....");
    pm.test(arrayPropertyName + " is property", function(){
        pm.expect(jsonResponse).to.have.property(arrayPropertyName);
    });
    pm.test(arrayPropertyName + " IsArray", function(){
        pm.expect(Array.isArray(jsonResponse[arrayPropertyName])).to.equal(true);
    });
    pm.test(arrayPropertyName + " Length", function(){
        console.log("Array.length=" + jsonResponse[arrayPropertyName].length);
        pm.expect(jsonResponse[arrayPropertyName].length).to.equal(arrayLength);
    });
    console.log("testArray() has finished");
}

if(pm.environment.get("RequestRequestHeader")!="False"){
    pm.test("RequestId header is present", function () {
        pm.response.to.have.header("RequestId");
    });
}


if(pm.environment.get("ExpectedResponseLength")>-1){
    console.log("getting response...");
    
    try{
        jsonResponse = pm.response.json();
    }catch(err){
       console.log("ERROR: unable to get pm.response.json()"); 
       jsonResponse="";
    }
    console.log("Response gotten");    
}else{
    jsonResponse="";
    pm.environment.set("ExpectedResponseLength", 0)
}

if (pm.environment.get("TestType") === "Auth") {
    console.log("Auth Tests - Starting...");
    testResponseStatus();
    testResponseMessage();
    console.log("Auth Tests - Completed");
} 
else if (pm.environment.get("TestType") === "Not Found") {
    console.log("Not Found Tests - Starting...");
    testResponseStatus();
    console.log("Not Found Tests - Completed");
}    
else if (pm.environment.get("TestType") === "Error") {
    testResponseStatus();
    testResponseMessage();
    testResponseLength();
    testAttributes();
    console.log("Error Tests - Completed");
} 
else if (pm.environment.get("TestType") === "JSON") {
    console.log("JSON Tests - Starting...");
    testResponseStatus();
    testResponseMessage();
    testResponseLength();
    testAttributes();
    console.log("JSON Tests - Completed");
} 
else if (pm.environment.get("TestType") === "Xml") {
    console.log("XML Tests - Starting...");
    testResponseStatus();
    testResponseLength();
    console.log("XML Tests - Completed");
}
console.log("Finished");
