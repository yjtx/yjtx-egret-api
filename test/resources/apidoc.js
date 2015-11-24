/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

 function scrollIntoView(ids)
    {
        document.getElementById(ids).scrollIntoView();
    }

    function globalFunctionReplace()
    {
        var arr=$('#treelist').find('[data-class-name*=globalFunction]');
        for(var i=0;i<arr.length;i++)
        {
            arr[i].innerHTML=arr[i].innerHTML.replace('globalFunction',language_GlobalFunction);

            var parent=$($(arr[i]).parent()).parent();
            var object=$($(arr[i]).parent()).remove();
            $(parent[0]).append(object[0]);
        }
    }

    function seeReplace()
    {

        for(var i=0;i<$("[data-see]").length;i++)
        {
            var str=$($("[data-see]")[i]).text();
            if(str.indexOf('http://')!=-1 && str.indexOf(' ')!=-1)
            {
                $($("[data-see]")[i]).attr('href',str.split(' ')[0])
                $($("[data-see]")[i]).text(str.split(' ')[1]);
            }
        }
    }

    function see(obj)
    {
        var str_name=$(obj).attr('data-see');
        str_name=str_name.replace('()','');
        var text=$("#selectType").val();
        if(str_name.indexOf('http://')!=-1)
        {
            window.location=str_name;
        }
        else if(str_name.indexOf('.')!=-1)
        {
            var location_urls=location_url.replace("--param--",str_name);
            window.location=location_urls;
        }
        else if(str_name.indexOf('#')!=-1)
        {
            $("html,body").animate({scrollTop:$("#"+str_name.substr(1)).offset().top},500);
        }
    }

    function goto(obj)
    {
        event.preventDefault();
        var str_name=$(obj).attr('data-class-name');
        if(str_name.indexOf('.')!=-1)
        {
            var location_urls=location_url.replace("--param--",str_name);
            var isAjax=window.history && window.history.pushState && window.history.replaceState && !navigator.userAgent.match(/((iPod|iPhone|iPad).+\bOS\s+[1-4]\D|WebApps\/.+CFNetwork)/)
            if (isAjax) {
                $('#spinner').css('top',$(obj).offset().top-100);
                $('#spinner').css('left',$(obj).width()+60);
                $("#spinner").show();
                getContent(str_name);
            }
            else{
                window.location=location_urls;
            }
        }
        else
        {
            var location_urls=location_url.replace("--param--","global.Types");
            window.location=location_urls;
        }
    }

    function selectType(obj)
    {
        var type=$('#selectType').val();
        var update=$('#selectType').find("option:selected").attr('data-update');
        $("#apiupdate").text(update);
        $("[data-list-type]").hide();
        $("[data-list-type='"+type+"']").show();
        $("#searchclass").val("");
    }

    function getUrlParam(name){
        //构造一个含有目标参数的正则表达式对象
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        //匹配目标参数
        var r = window.location.search.substr(1).match(reg);
        //返回参数值
        if (r!=null) return unescape(r[2]);
        return null;
    }

    function treelistsize()
    {
        $('#treelist').css('width',$('#left-first-box').width()+20);
        $('#treelist').css('max-height',$(window).height()-50+"px");
        
        if($(window).width()<754)
        {
            $('#treelist').css('position',"inherit");
            $('#treelist').css('top',"0px"); 
            $('#treelist').css('max-height',"inherit");
        }
        else
        {
            var doc_height = $(document).height();
            var scroll_top = $(document).scrollTop(); 
            var win_height = $(window).height()+220;
            var mheight=doc_height- scroll_top;
            if(mheight <= win_height)
            {
                $('#treelist').css('max-height',$('#treelist').height() - (win_height-mheight)+"px");
                
            }
            if($(window).scrollTop()>=200)
            {
                $('#treelist').css('position',"fixed");
                $('#treelist').css('top',"5px"); 
            }
            if($(window).scrollTop()<200)
            {
                $('#treelist').css('position',"inherit");
                $('#treelist').css('top',"0px"); 
            }
        }
    }

    function updateContentDialog()
    {
        urls=url.replace('--param--',$('#selectType').val());
        $.ajax({ url: urls,processData:false,dataType:"html",cache:false, success: function(data)
        {
            $('#update-content-dialog-body').html(data);
            $('#update-content-dialog').modal();
        }});


    }

    function onload()
    {
        //替换列表
        globalFunctionReplace();
        seeReplace();

        InheritedMethod();
        InheritedProperty();
        //构造函数名替换
        //$("[data-function-name='constructor']").html('{$current_data->class->name}');
        //特殊字符替换
        var reg=new RegExp("@#@","g");
        $("#classdesc").html($("#classdesc").html().replace(reg,'\\'));
        //渲染CSS
        $("pre").addClass("prettyprint");
        prettyPrint();
        //设置选择类别
        if(!location_init)
        {
            $('#selectType').val(defualt_type);
            selectType(null);
        }
        //呈现
        $('#rightcontent').css('padding-right',"30px");
        $('#rightcontent').show();

        location_init=true;
    }

    function getContent(str_name)
    {
        var location_urls1=location_ajax.replace("--param--",str_name);
        location_urls1=location_urls1.replace("--paramtype--",$("#selectType").val());
        var location_urls2=location_url.replace("--param--",str_name);
            
        $.ajax({
            url: location_urls1,
            dataType:"text",
            success: function(data)
            {
                $("#rightcontent").html(data);
                var state = {
                    action : "page",
                    title : $("#contentPage").attr("data-title"),
                    content:data,
                    url : location_urls2

                };
                history.pushState(state, "EDN API", location_urls2);
                document.title = $("#contentPage").attr("data-title");
                $.get(state.url).done(function () { });
                onload();
                //$("body").scrollTop(180);
                $("#spinner").hide();
            }
        });
    }
    $(window).resize(treelistsize);
    $(window).scroll(treelistsize);
    window.onload(onload);
    window.onpopstate = function (e) {
        switch (e.state && e.state.action) {
            case "page" :

                document.title = e.state.title;

                $.get(e.state.url).done(function () 
                { 
                    $("#rightcontent").html(e.state.content);
                    onload(); 
                });
                $("#spinner").hide();
                break;
        }
        
    }
  $(document).ready(function(){
      
    $('#searchclass').on('keyup',function(){

        var myself=$(this);
        var word=myself.val();
        word=word.trim().toLowerCase();
        if(word==='')
        {
          selectType(null);  
          return false;
        }

        var mululi=$("[data-list-type='"+$('#selectType').val()+"']");
        mululi.each(function()
        {
            var myself=$(this);
            var atag=myself.children('a');
            if(atag.attr('data-class-name').toLowerCase().indexOf(word)>-1)
            {
                $(this).show();
            }
            else
            {
                $(this).hide();
            }
        });
    });
  });
