// JavaScript Document
var mainurl= "http://app.sendexpert.com";

function setCookie (name, value, expires, path, domain, secure) {
	  document.cookie = name + "=" + escape(value) +
		((expires) ? "; expires=" + expires : "") +
		((path) ? "; path=" + path : "; path=/") +
		((domain) ? "; domain=" + domain : "") +
		((secure) ? "; secure" : "");
}
function getCookie(name) {
	var cookie = " " + document.cookie;
	var search = " " + name + "=";
	var setStr = null;
	var offset = 0;
	var end = 0;
	if (cookie.length > 0) {
		offset = cookie.indexOf(search);
		if (offset != -1) {
			offset += search.length;
			end = cookie.indexOf(";", offset)
			if (end == -1) {
				end = cookie.length;
			}
			setStr = unescape(cookie.substring(offset, end));
		}
	}
	return(setStr);
}
function deleteCookie(name) {
	  setCookie(name, "", "Mon, 01-Jan-2001 00:00:00 GMT", "/");
}
function checkLogin(){
        var url = mainurl+"/ajax/crossdomain.php";
         
        var success = function(data){
            data = $.parseJSON(data);
			if(parseInt(data.user_id) > 0 ){
				$('#notlogined').addClass('hide');
				$('#logined').removeClass('hide');
				$('#user_login').text(data.login);
				
				
				setCookie('login', data.login);
				setCookie('user_id', data.user_id);
 			} else {
				$('#notlogined').removeClass('hide');
				$('#logined').addClass('hide');
				
				deleteCookie('login');
				deleteCookie('user_id');
 			}
			 
        };
         
        $.ajax({
          type: 'GET',   
          url: url,
          data:{todo:"jsonp"},
          dataType: "jsonp",
          crossDomain: true,         
          cache:false,
          success: success,
          error:function(jqXHR, textStatus, errorThrown){
            //alert(errorThrown);
          }
        });
		
}
$(document).ready(function(){
	checkLogin();
});
function logout(){
        var url = mainurl+"/ajax/logout.php";
        var success_logout = function(data){
            checkLogin()
			 
        };
         
        $.ajax({
          type: 'GET',   
          url: url,
          data:{todo:"jsonp"},
          dataType: "jsonp",
          crossDomain: true,         
          cache:false,
          success: success_logout,
          error:function(jqXHR, textStatus, errorThrown){
            //alert(errorThrown);
          }
        });
		
	return false;	
}

			
//Selector Activate			
function SelectLoadScript() {
	$('select').selectpicker();
	//$('[type=checkbox]').bootstrapToggle();
}
$(function() {	
	$('.modal').on('loaded.bs.modal', SelectLoadScript);
	SelectLoadScript();
});	
			



 
/*
http://codepen.io/dimbslmh/pen/mKfCc?editors=011
*/

var optimal_packet = 1;

function calcPrice(){
	var cnt_subscribers = parseInt($('#cnt_subscribers').val());
	var cnt_mail 		= parseInt($('#cnt_mail').val());
	if(isNaN( cnt_subscribers)){
		cnt_subscribers = 0;
	} 
	if(isNaN(cnt_mail)){
		cnt_mail = 0;
	} 
 	var summ = cnt_subscribers * cnt_mail;
	var min_packet = 0;
	var min_summ = -1;
	$('#tmp').empty();
	var tmp_summ = 0;
	var tmp_cnt = 0;
	for (key in tarifs) {
		if(tarifs[key]['cnt_mails'] > summ){
			tmp_summ = tarifs[key]['price'];

			tmp_mail_prepaid = tarifs[key]['cnt_mails'];
			tmp_mail_additional = 0;
		} else {
			tmp_summ = tarifs[key]['price'] + ( summ - tarifs[key]['cnt_mails']) * tarifs[key]['price_additional'];
			tmp_mail_prepaid = tarifs[key]['cnt_mails'];
			tmp_mail_additional = summ - tarifs[key]['cnt_mails'];
		}
		//$('#tmp').append('sum='+tmp_summ+"<br>");
		if((tmp_summ < min_summ) || (min_summ == -1)){
			min_summ = tmp_summ;
			optimal_packet = key;
			optimal_name = tarifs[key]['name'];
			optimal_summ = tmp_summ;
			optimal_mail_prepaid = tmp_mail_prepaid.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
 			optimal_mail_additional = tmp_mail_additional;
		}
	}
	var current_valute = valutes[$('#currency option:selected').val()];
	
	optimal_summ = optimal_summ * current_valute['course'];
 	$('.currency_price').html( current_valute['name_show']);
	
	$('.calc_packet').html(optimal_name);
	$('.calc_price').html(Math.round(optimal_summ*100)/100);
	$('#cnt_prepaid').html( optimal_mail_prepaid );
	if(optimal_mail_additional > 0 ){
		ppc = optimal_mail_additional +"";
		$('#cnt_additional').html( ppc.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') );
		$('#additional_block').removeClass('hide');
	} else {
		$('#additional_block').addClass('hide');
	}
}
function selectThisEmail(){
	var language = $('#currency :selected').val();
	var period = 0;
	if(optimal_packet < 1){optimal_packet = 1;};
	var packet = optimal_packet;
	var login = getCookie('login');
	
 	if(login != "" && login != null){
		var url = mainurl +'/ru/packets/act-show/packet-'+packet+'/period-'+period+'/';
	} else {
		var url = mainurl +'/ru/registration/'+packet+'-'+language+'-'+period+'/';
	}
	//alert("Выбрали пакет #"+packet+" На период "+period+" м."+to);
 	document.location.href = url;
	
	
}




function calcSmsPrice(){
	var cnt_sms   = parseInt($('#cnt_sms').val());
	if(isNaN(cnt_sms)){
		cnt_sms = 0;
	} 
	
	var price_one = parseFloat($('#country_sms option:selected').val());
	var current_valute = $('#currency_sms :selected');
	price_one = price_one * parseFloat(current_valute.attr('course'));
	price_one = Math.round(price_one * 100)/100;
	var price = cnt_sms * price_one;
	
	sms_price = Math.round(price * 100)/100 + " " + current_valute.attr('name_show');
	$('#sms_price').html(sms_price);	
	return false;
}
function goUrl(url){
	document.location.href = url;	
}

function subscribe(el){
	$(".has-error").removeClass('has-error');
	var name = $('#sub_name');	
	var email = $('#sub_email');	
	var ok = 1;
	if(name.val() == '' ||  name.val() == name.attr('rel')){
		name.closest('.form-group').addClass('has-error');	
		ok = 0;
	}
	if(email.val() == '' ||  email.val() == email.attr('rel')){
		email.closest('.form-group').addClass('has-error');	
		ok = 0;
	}
	if(!validateEmail(email.val())){
		email.closest('.form-group').addClass('has-error');	
		ok = 0;
	} 
	if(ok == 1){
		$.post('/ajax/subscribe.php',{ name: name.val(), email:email.val()}, function(data) {
			$('#subscriebeform').closest('.container').html(data);
		});
	}
	return false;
	
}

function validateEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
} 

function TariffCurrency(){
	var valute = $('#currency_tariff option:checked').val();
	$('.tarifpacket').each(function(){
		var id = $(this).attr('id');
		if(id != ""){
			if($(this).attr('rel') == 'spec'){
				$(this).find('.price_additional').html("<br>"+packets[id][valute]['price_additional']);
			} else {
				$(this).find('.price_additional').html("+ "+packets[id][valute]['price_additional']);
			}
			$(this).find('.pricemonth').html(packets[id][valute]['price']);
		}
	})
	$('.tariff-sms').each(function(){
		var id = $(this).attr('id');
		$(this).find('span').html(sms[id][valute]['price']);
	})
	$(".sms_price_1").addClass('hide');
	$(".sms_price_2").addClass('hide');
	$(".sms_price_3").addClass('hide');
	$(".sms_price_4").addClass('hide');
	$(".sms_price_"+valute).removeClass('hide');
	
}


//Modal vertical center
function reposition() {
	//var modal = $(this);
	var modal = $('#modal');
	dialog = modal.find('.modal-dialog');
	modal.css('display', 'block');
	recalcHeight();
	// Dividing by two centers the modal exactly, but dividing by three 
	// or four works better for larger screens.
	// alert(modal.height());
	dialog.css("margin-top", Math.max(0, ($(window).height() - dialog.height()) / 2));
}

$(function() {
    // Reposition when a modal is shown
    $('.modal').on('loaded.bs.modal',reposition );
    // Reposition when the window is resized
    $(window).on('resize', function() {
        $('.modal:visible').each(reposition);
    });	
	//reposition();
});
function recalcHeight(){
	$('.modal-vertical').each(function(){
		 
		var el = $(this).find('.modal-body');	
		var header = $(this).find('.modal-header').outerHeight();
		var footer = $(this).find('.modal-footer').outerHeight();

		$(el).css('max-height',$(window).height() - header - footer - 62);
		$(el).css('overflow-y', 'auto'); 
		
	});
	
	
}
function checkForm(el,id_message){
	var ret = true;
 	$('.has-error').removeClass('has-error');
	$('#'+id_message).addClass('hide');
	$('.alert').addClass('hide');
	$(el).closest('form').find('[rel=text]').each(function(index){
		val = $(this).val();
		if(val == ""){
			$(this).closest('div').addClass('has-error');	
			$('#'+id_message).removeClass('hide');
			ret = false;
		}
	});
	return ret;
}
function sendCallback(el){
	var id_message = 'alert_callback';
	if(checkForm(el,id_message)){
		$.post("/ajax/callback.php",{name:$('#name').val(),phone:$('#phone').val(),subject:$('#subject option:selected').html(),timefrom:$('#timefrom').val(),timeto:$('#timeto').val()},function(data){
			$('#modal_ok').click();
			
		});
	}
	return false;
}

function selectThisPacket(el){
	var language = 1;
	var period = $('#period').val();
	var packet = $(el).attr('rel');
	var login = getCookie('login');
	
 	if(login != "" && login != null){
		var url = mainurl+'/ru/packets/act-show/packet-'+packet+'/period-'+period+'/';
	} else {
		var url = mainurl+ '/ru/registration/'+packet+'-'+language+'-'+period+'/';
	}
 	document.location.href = url;
	
}
function showModal(el){
	var url = $(el).attr('href');
	$(function() {
		$.get( url,{},function(data){
			$('.modal-content').html(data);
			SelectLoadScript();
			
			$('#modal').modal();
			reposition();		
		});
	});	
	return false;
}
function timePromoLeft(){
	var dateEnd = new Date(2015, 12-1, 1); // month -1
	var today = new Date();
	
	msPerDay = 24 * 60 * 60 * 1000 ;
	timeLeft = (dateEnd.getTime() - today.getTime());
	if(timeLeft < 0 ){
		timeLeft = 0;
	}
	e_daysLeft = timeLeft / msPerDay;
	daysLeft = Math.floor(e_daysLeft);
	
	e_hrsLeft = (e_daysLeft - daysLeft)*24;
	hrsLeft = Math.floor(e_hrsLeft);

	minsLeft = Math.floor((e_hrsLeft - hrsLeft)*60);
	secsLeft = Math.floor(timeLeft/1000 - daysLeft * 24 * 60 * 60 - hrsLeft * 60 * 60  - minsLeft * 60) ;
	
	var day_1 = Math.floor(daysLeft/10); 
	var day_2 = daysLeft -  day_1 *10;
	document.getElementById('day-1').innerHTML = day_1 ;
	document.getElementById('day-2').innerHTML = day_2 ;

	var hour_1 = Math.floor(hrsLeft/10); 
	var hour_2 = hrsLeft - hour_1 *10;
	document.getElementById('hour-1').innerHTML = hour_1 ;
	document.getElementById('hour-2').innerHTML = hour_2 ;

	var minutes_1 = Math.floor(minsLeft/10); 
	var minutes_2 = minsLeft - minutes_1 *10;
	document.getElementById('minutes-1').innerHTML = minutes_1 ;
	document.getElementById('minutes-2').innerHTML = minutes_2 ;

	var second_1 = Math.floor(secsLeft/10); 
	var second_2 = secsLeft - second_1 *10;
	document.getElementById('second-1').innerHTML = second_1 ;
	document.getElementById('second-2').innerHTML = second_2 ;
	setTimeout(timePromoLeft,300);
}
function goSite(){
	var login = getCookie('login');
 	if(login != "" && login != null){	
		document.location.href = mainurl;
	} else {
		document.location.href = mainurl+"/ru/registration/";	
	}
}