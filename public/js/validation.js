
$('#loadData').on('click',function dataValidation(){
    // e.preventDefault();
    var flag=true;
    var input1=$('#fullname').val();
    var input2=$('#email').val();
    var input3=$('#password').val();
    var input4=$('#cnf').val();
    var patt1=/^[a-zA-Z0-9][a-zA-Z0-9_\s\-]*[a-zA-Z0-9](?<![_\s\-]{2,}.*)$/
    var patt2=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    var patt3=/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
    if(input1.match(patt1)==null)
     {alert("please use correct username")
      flag=false;}
    else if(input2.match(patt2)==null)
     {alert("please use correct email")
     flag=false;}
    else if(input3.match(patt3)==null)
     {alert("please give strong password")
     flag=false;}
    else if(input3!==input4)
     {alert("Not match password")
     flag=false;}
   
    if(flag)
      { $('form').submit();}

})
