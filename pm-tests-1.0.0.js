console.log("pm-tests starting....");


// functions first...
function testResponseLength() {
    console.log("testResponseLength - Starting...");
    pm.test("Response length", function() {
        var actualLength = Object.keys(jsonResponse).length;
        pm.expect(pm.environment.get("ExpectedResponseLength")).to.equal(actualLength);
    });
    console.log("testResponseLength - Completed");
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

function testArray(parentName, arrayPropertyName, arrayLength){
    console.log("testArray('" + arrayPropertyName + "') is starting....");

    pm.test(arrayPropertyName + " is property of jsonResponse", function(){
        pm.expect(jsonResponse).to.have.property(parentName);
    });
    var parent= jsonResponse[parentName];

	
    pm.test(arrayPropertyName + " is property of Parent", function(){
        pm.expect(parent).to.have.property(parentName);
    });
    var arr = parent[arrayPropertyName];

    pm.test(arrayPropertyName + " IsArray", function(){
        pm.expect(Array.isArray(arr)).to.equal(true);
    });	
    

    pm.test(arrayPropertyName + ".length", function(){
        console.log("Array.length=" + arr.length);
        pm.expect(arr.length).to.equal(arrayLength);
    });
    console.log("testArray() has finished");
}

if(pm.environment.get("RequireRequestHeader")!="False"){
    pm.test("RequestId header is present", function () {
        pm.response.to.have.header("RequestId");
    });
}



// now the stuff that gets directly executed:
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
