
//set control for login html
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
            {type   : 'empty',  prompt : 'Please enter your password'}
           ]
         }
       }, {
         inline : true,
         on     : 'blur'
       })
;
(function (global) {

    if(typeof (global) === "undefined") {
        throw new Error("window is undefined");
    }

    var _hash = "!";
    var noBackPlease = function () {
        global.location.href += "#";

        // making sure we have the fruit available for juice (^__^)
        global.setTimeout(function () {
            global.location.href += "!";
        }, 50);
    };

    global.onhashchange = function () {
        if (global.location.hash !== _hash) {
            global.location.hash = _hash;
        }
    };

    global.onload = function () {
        noBackPlease();

        // disables backspace on page except on input fields and textarea..
        document.body.onkeydown = function (e) {
            var elm = e.target.nodeName.toLowerCase();
            if (e.which === 8 && (elm !== 'input' && elm  !== 'textarea')) {
                e.preventDefault();
            }
            // stopping event bubbling up the DOM tree..
            e.stopPropagation();
        };
    }

})(window);
