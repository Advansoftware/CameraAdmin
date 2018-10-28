var Main = {
	carrega : function(){
		$(".dropdown-trigger").dropdown();
        $('#numero').mask('00/0000', {reverse: true});
	   /*$('select').formSelect();
	    $('.datepicker').datepicker({
		i18n: {
			months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
			monthsShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
			weekdays: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sabádo'],
			weekdaysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
			weekdaysAbbrev: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
			today: 'Hoje',
			clear: 'Limpar',
			cancel: 'Sair',
			done: 'Confirmar',
			labelMonthNext: 'Próximo mês',
			labelMonthPrev: 'Mês anterior',
			labelMonthSelect: 'Selecione um mês',
			labelYearSelect: 'Selecione um ano',
			selectMonths: true,
			selectYears: 15,
		},
	    format: 'dd/mm/yyyy'
	    });
	    $('.fixed-action-btn').floatingActionButton();*/
	},
	envia_pedido : function(){

		var vereadores = $("#vereadores").val();
		var nome_pedido = $("#numero").val();
		var data_pedido  = $("#data").val();
        var file_data = $('#file').prop('files')[0];
        var fd = new FormData();
        fd.append('arquivo',file_data);
        fd.append('vereadores',vereadores);
        fd.append('data',data_pedido);
        fd.append('nome',nome_pedido);
        if(vereadores != '' && nome_pedido != '' && data_pedido != '') {
            $.ajax({
                method: "POST",
                url: Main.base_url + "pedidos/cria_pedido",
                dataType: 'text',
                cache: false,
                contentType: false,
                processData: false,
                data: fd,
                type: 'post'
            }).done(function (html) {
                location.reload();
            });
        }
        else{
        	alert("Falta Preencher alguns dados");
		}
	},
	envia_noticia : function(){
        var titulo = $("#titulo").val();
        var data = $("#data").val();
        var texto = CKEDITOR.instances.texto.getData();
        var file_data = $('#file').prop('files')[0];
        var fd = new FormData();
        fd.append('arquivo',file_data);
        fd.append('titulo',titulo);
        fd.append('data',data);
        fd.append('texto',texto);
        if(titulo != '' && data != '' && file_data != ''  && texto != '') {
            $.ajax({
                method: "POST",
                url: Main.base_url + "noticias/insere_noticia",
                dataType: 'text',
                cache: false,
                contentType: false,
                processData: false,
                data: fd,
                type: 'post'
            }).done(function (html) {
            	alert(html);
               location.reload();
            });
		}
        else{
            alert("Falta Preencher alguns dados");
        }
	},
    login : function () {
        if(Main.login_isvalid() == true)
        {
            Main.modal("aguardar","Aguarde... validando seus dados.");
            $.ajax({
                url: Url.base_url+'account/validar',
                data: $("#form_login").serialize(),
                dataType:'json',
                cache: false,
                type: 'POST',
                success: function (msg) {
                    if(msg.response == "valido")
                    {
                        window.location.assign(Url.base_url + "pedidos");
                    }
                    else
                    {
                        setTimeout(function(){
                            $('#modal_aguardar').modal('hide');
                        },500);
                        Main.limpa_login();
                        Main.modal("aviso", msg.response);
                    }
                }
            });
        }
    },
    logout : function (){
        Main.modal("aguardar", "Aguarde... encerrando sessão");
    },
    modal : function(tipo, mensagem)
    {
        $("#mensagem_"+tipo).html(mensagem);
        $('#modal_'+tipo).modal({
            keyboard: true,
            backdrop : 'static',
        });

        if(tipo == "aviso")
        {
            $('#modal_aviso').on('shown.bs.modal', function () {
                $('#bt_close_modal_aviso').trigger('focus')
            })
        }
        else if(tipo == "confirm")
        {
            $('#modal_confirm').on('shown.bs.modal', function () {
                $('#bt_confirm_modal').trigger('focus')
            })
        }
    },
    limpa_login : function ()
    {
        $("#password").val("");
        $("#password").focus();
    },
    login_isvalid : function (){
        if($("#email").val() == "")
            Main.show_error("email","Informe seu e-mail","");
        else if(Main.valida_email($("#email").val()) == false)
            Main.show_error("email","Formato de e-mail inválido","");
        else if($("#password").val() == "")
            Main.show_error("password","Insira sua senha","");
        else
            return true;
    },
    valida_email : function(email)
    {
        var nome = email.substring(0, email.indexOf("@"));
        var dominio = email.substring(email.indexOf("@")+ 1, email.length);

        if ((nome.length >= 1) &&
            (dominio.length >= 3) &&
            (nome.search("@")  == -1) &&
            (dominio.search("@") == -1) &&
            (nome.search(" ") == -1) &&
            (dominio.search(" ") == -1) &&
            (dominio.search(".") != -1) &&
            (dominio.indexOf(".") >= 1)&&
            (dominio.lastIndexOf(".") < dominio.length - 1))
            return true;
        else
            return false;
    },
    show_error : function(form, error, class_error)
    {
        if(class_error != "")
            document.getElementById(form).className = "input-material "+class_error;
        if(error != "" && document.getElementById(form) != undefined)
            document.getElementById(form).focus();

        document.getElementById("error-"+form).innerHTML = error;
    }

}

