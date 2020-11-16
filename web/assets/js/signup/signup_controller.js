$('.ui.form')
  .form({
    email: {
      identifier  : 'email',
      rules: [
          {type   : 'empty',  prompt : 'Please enter your email'},
          {type   : 'email',  prompt : 'Invalid email address'}
      ]
    },
    password: {
      identifier  : 'password',
      rules: [
        {type   : 'empty',  prompt : 'Please enter your password'},
        { type : 'minLength[6]',  prompt : function(value){$("#repeated_passwordError > div>input").val("");$("#repeated_passwordError > div").addClass("disabled"); ;return'Your password must be at least 6 characters'}}
      ]
    },
    repeated_password: {
      identifier  : 'repeated_password',
      rules: [
        {type   : 'empty',  prompt : 'Please enter your password'},
        {type   : 'match[password]',  prompt : 'Passwords must match'}
      ]
    },
    name: {
      identifier  : 'name',
      rules: [
        {type   : 'empty',  prompt : 'Please enter your name'}
      ]
    },
    birthday: {
      identifier  : 'birthday',
      rules: [
              {type   : 'empty',  prompt : 'Please enter your birthday'}
            ]
    },
    gender: {
      identifier  : 'gender',
      rules: [
        {type   : 'empty',  prompt : 'Please enter your gender'}
      ]
    },
    surname: {
      identifier  : 'surname',
      rules: [
        {type   : 'empty',  prompt : 'Please enter your surname'}
      ]
    },
    fiscal_code: {
      identifier  : 'fiscal_code',
      rules: [
        {type   : 'empty',  prompt : 'Please enter your fiscal code'}
      ]
    },
    company_name: {
      identifier  : 'company_name',
      rules: [
        {type   : 'empty',  prompt : 'Please enter your company name'}
      ]
    },
    enterprise: {
      identifier  : 'enterprise',
      rules: [
        {type   : 'empty',  prompt : 'Please enter your enterprise'}
      ]
    },
    vat: {
      identifier  : 'vat',
      rules: [
        {type   : 'empty',  prompt : 'Please enter your vat'}
      ]
    },
    country: {
      identifier  : 'country',
      rules: [
        {type   : 'empty',  prompt : 'Please enter your country'}
      ]
    },
    province: {
      identifier  : 'province',
      rules:[
        {type   : 'empty',  prompt : 'Please enter your province'}
    ]
  },
    zipcode: {
      identifier  : 'zipcode',
      rules: [
        {type   : 'empty',  prompt : 'Please enter your zipcode'}
      ]}
      ,
    address: {
      identifier  : 'address',
      rules: [
        {type   : 'empty',  prompt : 'Please enter your address'}
      ]
    },
    accept_tos: {
      identifier  : 'accept_tos',
      rules: [
        {type   : 'checked', prompt : 'You must agree to the terms and conditions'}
      ]
    },
  }, {
    inline : true,
    on     : 'blur',
    onSuccess : function() {
      alert("funzia")
    }
  })
;

window.onload = function(){
    $('.ui.dropdown').dropdown();
};


//css control  password
$("#password").on('input',function() {
  if( $('.ui.form').form('is valid', 'password')) {
    $("#repeated_passwordError > div").removeClass("disabled");
  }
})

//css control match password
$("#repeated_password").on('input',function() {
  if( $('.ui.form').form('is valid', 'repeated_password')) {
    $("#password").css("background-color" , "#daf8da")
    $("#repeated_password").css("background-color" , "#daf8da")
  }else{
    $("#password").css("background-color" , "rgb(248, 218, 218)")
    $("#repeated_password").css("background-color" , "rgb(248, 218, 218)")
  }
})


//function call when a new user want to signup
$("#button").on('click',function() {
  if($('.ui.form').form('is valid')) {
    $.ajax({
      type: "POST",
      url: "/signup",
      data: $("form").serialize(), // serializes the form's elements.
      success: function(data){
        //check if there are errors
        try{
          var json = JSON.parse(data);
          for( var item in json){
            if( item != "repeated_password" ){
                 try{
                   $("#"+item+"Error > div").remove()
                 }catch(e){}
                   $("#"+item+"Error").addClass("error")
                   $("#"+item+"Error").append('<div class="ui basic red pointing prompt label transition visible">'+json[item]+'</div>')
            }
          }
        }catch(e){
          if(data['value'] == "Email already exists"){
            try{
              $("#emailError > div").remove()
            }catch(e){}

            $("#emailError").addClass("error")
            $("#emailError").append('<div class="ui basic red pointing prompt label transition visible">Email address already exists </div>')
          }else if(data['value'] =="Invalid email address"){
            try{
              $("#emailError > div").remove()
            }catch(e){}
            $("#emailError").addClass("error")
            $("#emailError").append('<div class="ui basic red pointing prompt label transition visible">Invalid email address</div>')
          }
          // else{
          //   //from.data are ok, go to login
          //   window.location.href = "/login";
          // }
        }
      },
      error: function (data) {
        alert(data)
      }
    });
  }
})
