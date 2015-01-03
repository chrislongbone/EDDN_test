//API docs: http://edstarcoordinator.com/api.html
       
var query = {
        ver:2, 
        test:true,
        outputmode:2, 
        filter:{
            knownstatus:0,
            /*systemname: "Cynetek",
            cr:5,*/
            date:"2014-09-18 12:34:56",/*
            coordcube: [[-10,10],[-10,10],[-10,10]]/*,
            coordsphere: {radius: 123.45, origin: [10,20,30]}*/
        }
    };



apitest();
function apitest() {
  var data = { data: query };
  $.ajax({
    type: 'POST',
    contentType: 'application/json; charset=utf-8',
    url: 'http://edstarcoordinator.com/api.asmx/GetSystems',
    data: JSON.stringify(data),
    dataType: 'json',
    success:
      function (data) {
        submitsuccess(data); 
      },
    error: submiterror
  });
};

function submitsuccess(data) {
  $('#out').html(showData(data.d)
  );
  console.log(data);
}

function submiterror(d, a) {
  $('#out').html(d.responseText);
  console.log(d);
}


//******** Pretty printing *************
//Credit: http://stackoverflow.com/a/11233515
function removequotes(json){
  //removes quotes around properties
  return json.replace(/\"([^(\")"]+)\":/g,"$1:") 
}


//Credit: http://stackoverflow.com/a/7220510
function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

function showData(systems) {
    
    //return JSON.stringify(systems);
    //systems =  JSON.parse(systems);
    status = systems.status;
    ver = systems.ver;
    date = systems.date;
    new_systems = systems.systems;
    
    //systems = JSON.parse(systems);
    //return JSON.stringify(systems);
    //return systems;

    //ret = JSON.stringify(systems);
    ret = "";
    
    //ret += "<br>Status: " + JSON.stringify(status);
    //ret += "<br>Ver: " + JSON.stringify(ver);
    //ret += "<br>Date: " + JSON.stringify(date);
    //ret += "<br>New Systems: " + JSON.stringify(new_systems);
    //ret += "<br>No. Systems: " + new_systems.length;
    //ret += "<br>System 50: " + JSON.stringify(new_systems[50]);
    //ret += "<br>System 50: " + new_systems[50].name;
    ret += "<br>" + "INSERT INTO EDS_known_systems (EDS_id, name, coords,server_time) VALUES <br>";
    for(var i = 0; i < new_systems.length; i++) {
        var this_system = new_systems[i];
        ret += "("+this_system.id+",";
        ret += "'"+this_system.name.replace(/'/g, "\\'")+"',";
        ret += "'"+this_system.coord+"',";
        ret += "NOW())";
        if (i < (new_systems.length - 1)) {ret += ",<br>";}
    }
    
    return ret;    
    
    
}
