function loadStartPage()
{
  $(function(){
    $("#header").load("views/header.html");
    $("#content").load("views/defaultcontent.html");
  });
}

function loadResultsPage()
{
  $(function(){
    $("#header").load("views/header.html");
    //$("#content").load("views/content.html");
  });
}
