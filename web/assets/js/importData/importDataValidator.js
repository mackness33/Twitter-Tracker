
//set control for login html
$('.ui.form')
  .form({
    newproject: {
    identifier  : 'new-project',
    rules: [
            {type   : 'empty',  prompt : 'Please enter a project'}
           ]
    },
       }, {
         inline : true,
         on     : 'blur'
       });

$('input[name="newoldproject"]').change(function(e){
      if(e.target.value == "exist"){
        $(".old").show();
        $(".new").hide();
        $('.ui.dropdown').dropdown();
        $('.ui.form')
          .form({
            oldproject: {
            identifier  : 'oldproject',
            rules: [
                    {type   : 'empty',  prompt : 'Please enter a project'}
                   ]
            }
               }, {
                 inline : true,
                 on     : 'blur'
               })
        ;
      }else{
        $(".new").show();
        $(".old").hide();
        $('.ui.form')
          .form({
            newproject: {
            identifier  : 'new-project',
            rules: [
                    {type   : 'empty',  prompt : 'Please select  a project'}
                   ]
            },
               }, {
                 inline : true,
                 on     : 'blur'
               })
        ;
      }
  });
