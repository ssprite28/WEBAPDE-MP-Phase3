function checkLogIn(){
  var email = $("form[name=login-form] input[name=email]").val();
  var pass = $("form[name=login-form] input[name=pass]").val();
  if (email.length>0 && pass.length>0){
    return true;
  }else{
    $("#empty-prompt").removeClass('hide-prompt');
    return false;
  }
}
