//Functions state for FORM
function stateSendingForm(){
  $("#upload-file :input").prop("disabled", true);
  $("p").show()
}



//stateImportForm()
//Functions state for progress bar
function stateReceiveData(){
  $(".progress").show();
}

function stateNoReceiveData(){
  $(".progress").hide();
}


//
function startSavingAndReload(url){
 var xhr = new XMLHttpRequest();
  xhr.open("POST", "/importData");

  var postData = new FormData();
  postData.append('url', url);
  postData.append('caseStudy', getCaseStudy());
  xhr.onreadystatechange = function() {
    if(xhr.readyState === 4){
      if(xhr.status === 200 || xhr.status === 204){
        location.reload();
      }
      else{
        alert("Could not upload file.");
      }
   }
  };
  xhr.upload.onprogress = function (event){
       if(event.lengthComputable){
           var complete = (event.loaded / event.total * 100 | 0);
           console.log(complete)
       }
   };
  xhr.send(postData);
}

//upload filo to AWS
function uploadFile(file, s3Data, url, caseStudy){
  var xhr = new XMLHttpRequest();
  xhr.open("POST", s3Data.url);

  var postData = new FormData();
  for(key in s3Data.fields){
    postData.append(key, s3Data.fields[key]);
  }
  postData.append('file', file);

  //css form upload to aws
  $("#upload-file :input").prop("disabled", true);
  $("#div-submit").hide();
  $("#div-spinner").show();


  xhr.onreadystatechange = function() {
    if(xhr.readyState === 4){
      if(xhr.status === 200 || xhr.status === 204){
        startSavingAndReload(url)
      }
      else{
        alert("Could not upload file.");
      }
   }
  };
  xhr.upload.onprogress = function (event){
       if(event.lengthComputable){
           var complete = (event.loaded / event.total * 100 | 0);
           $("#div-percentage-save > strong").text("Sending data "+complete+"%");
           console.log(complete)
       }
   };
  xhr.send(postData);
  // url = "https://importdatafile.s3.amazonaws.com/ss_mov_act2.xlsx" //max, parti da questo url, senza dover ogni volta caricare il file, piu' semplice
  // startSavingAndReload(url)
}

//FUNZIONE CHE RITORNA IL caseStudy
function getCaseStudy(){
  if ($('input[name="newoldproject"]:checked').val() == "new"){
    if($('#new-project').val() != ""){
      return $('#new-project').val();
    }else{
      alert("Manca caseStudy")
    }
  }else if ($('input[name="newoldproject"]:checked').val() == "exist"){
    if($('#oldproject').val() != ""){

      return $('#exist-project').val();
    }else{
      alert("Manca caseStudy")
    }
  }
  return ""
}

$(document).ready(function(){
    $('#submit').click(function() {
      var caseStudy = getCaseStudy();
      if(caseStudy != ""){
        var file =  $('#input-file-now').prop('files')[0];
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "/sign_s3?file_name="+file.name+"&file_type="+file.type+"&case_study="+caseStudy);
        xhr.onreadystatechange = function(){
        if(xhr.readyState === 4){
          if(xhr.status === 200){
            var response = JSON.parse(xhr.responseText);
            uploadFile(file, response.data, response.url, caseStudy);
          }
          else{
            alert("Could not get signed URL.");
          }
        }
        };
        xhr.send();
     }
    });
    getStatus();
});


function getStatus(){
  $.ajax({
      type: 'GET',
      url: '/getStatus',
      success: function(data) {
        if(data["Value"] == "Working"){
          update_progress(true);
        }
      },error:function(){
        alert("Impossible to send request")
      }
  });
}

//function that remove a DOM object


function getLoading(id){
  return '<p class="loading2" >Loading</p>'
}

function update_progress(value) {
        if (value == true){
          $.getJSON("/getPercentage", function(data) {
                  for( item in data){
                    if(Number.isInteger(data[item]["percentage"]) == false ){
                      if(($("#progress_"+data[item]["url"].split(".")[0].replace(" ", "_")).length == 0 ) &&( $('#div_'+data[item]["url"].split(".")[0].replace(" ", "")+'_percentage'.length == 0 ) ) ){
                        if(data[item]["percentage"]== "loading"){
                          $(".files").append("<tr> <td id='div_"+data[item]["url"].split(".")[0].replace(" ", "")+"'><label>"+data[item]["url"]+"</label></td><td id='div_"+data[item]["url"].split(".")[0].replace(" ", "")+"_percentage'>"+getLoading()+"</td></tr>")

                        }else{
                          $(".files").append("<tr> <td id='div_"+data[item]["url"].split(".")[0].replace(" ", "")+"'><label>"+data[item]["url"]+"</label></td><td id='div_"+data[item]["url"].split(".")[0].replace(" ", "")+"_percentage'>"+data[item]["percentage"]+"</td></tr>")

                        }
                      }
                    }else if (Number.isInteger(data[item]["percentage"])){
                      if($("#progress_"+data[item]["url"].split(".")[0].replace(" ", "_")).length == 0 ){
                        $(".files").append("<tr> <td id='div_"+data[item]["url"].split(".")[0].replace(" ", "")+"'><label>"+data[item]["url"]+"</label></td><td id='div_"+data[item]["url"].split(".")[0].replace(" ", "")+"_percentage'><progress id='progress_"+data[item]["url"].split(".")[0].replace(" ", "_")+"'  max='100'></progress></td></tr>")
                      }
                    }
                  }
                  stateReceiveData()
                  update_progress(false)
            })
        }
        else{
          $.getJSON("/getPercentage", function(data) {
            console.log(data)
                  if(data != []){
                    for( item in data){
                      if(Number.isInteger(data[item]["percentage"])){
                        if($("#div_"+data[item]["url"].split(".")[0].replace(" ", "")+"_percentage > p").length >= 1 ){
                              $("#div_"+data[item]["url"].split(".")[0].replace(" ", "")+"_percentage > p").remove()
                              id = (data[item]["url"].split(".")[0]).replace(" ", "")
                              $("#div_"+data[item]["url"].split(".")[0].replace(" ", "")+"_percentage").append("<progress id='progress_"+id+"'  max='100'></progress>")
                        }
                        else if($("#progress_"+data[item]["url"].split(".")[0].replace(" ", "_")).length == 0 ){
                            update_progress(true)
                        }
                        else{
                          $("#progress_"+data[item]["url"].split(".")[0].replace(" ", "_")).attr("value",data[item]["percentage"]);
                        }
                      }else{
                        if($("#progress_"+data[item]["url"].split(".")[0].replace(" ", "_")).length == 0 ){
                           if( $("#div_"+data[item]["url"].split(".")[0].replace(" ", "")).length == 0){
                          if(data[item]["percentage"] == "loading" ){
                            $(".files").append("<tr> <td id='div_"+data[item]["url"].split(".")[0].replace(" ", "")+"'><label>"+data[item]["url"]+"</label></td><td id='div_"+data[item]["url"].split(".")[0].replace(" ", "")+"_percentage'>"+getLoading()+"</td></tr>")
                          }else{
                            $(".files").append("<tr> <td id='div_"+data[item]["url"].split(".")[0].replace(" ", "")+"'><label>"+data[item]["url"]+"</label></td><td id='div_"+data[item]["url"].split(".")[0].replace(" ", "")+"_percentage'>"+data[item]["percentage"]+"</td></tr>")

                          }
                        }
                      }
                      }
                    }
                    setTimeout(function(){
                        update_progress(false);
                    }, 1500);
                  }
            });
        }
}
