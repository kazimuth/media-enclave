// upload -- functions for the Upload page of Audio Enclave

var upload = {

  // Disables the submit button(s) of the form passed as as an argument.
  disable_form: function(form) {
    var inputs = form.getElementsByTagName("input");
    for (var i = 0; i < inputs.length; i++) {
      var input = inputs[i];
      if (input.type == "submit") input.disabled = true;
    }
  }

};
