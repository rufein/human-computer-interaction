
$( document ).ready(function() {
 
	// Vars
	// State of the app
	var prev_state = 0;
	var state = 0;
	
	var mode = 0; // 0 = brujula -- 1 = mapa
	
	// Compass variable
	var compass = 0;
	
	// Timer variable
	var start_timer = 0;
	var timer_event;
	var timer_state = 0;
	
	// Sound
	var clickSound = new Audio('bass.mp3');
	
	var volumen = 1;
	
	// Options
	var depth = 0;
	var options_depth = [ "#radio-accion", "#tipo-de-voz", "#tipo-de-tono", "#tipo-de-mapa" ];
	
	// alert coordenates
	var alert_coordenates = [ 265, 110 ];
	
	// Menu
	var menu_l = [];
	menu_l[2] = 0; // mapa
	menu_l[3] = 0; // alertas
	menu_l[4] = 0; // volumen
	menu_l[5] = 0; // opciones
	
	// Divs name based on the state
	var ids = [];
	ids[0] =  [ "#lanzamiento" ];
	ids[1] = [ "#marcador-metros" , "#brujula" ];
	ids[2] = [ "#marcador-mapa" ];
	ids[3] = [ ];
	ids[4] = [ "#volumen"  ];
	ids[5] = [ "#opciones" ];

	// Background images
	var background = [];
	background[0] =  "lanzamiento.jpg" ;
	background[1] =  "";
	background[2] =  "mapa3.jpg";
	background[3] =  "";
	background[4] =  "";
	background[5] =  "";
	
	// map coordenates var
	var map = [];
	map[0] = [525, 400];
	map[1] = [525, 400];
	map[2] = [528, 390];
	map[3] = [530, 380];
	map[4] = [533, 370];
	map[5] = [535, 360];
	map[6] = [534, 350];
	map[7] = [533, 340];
	map[8] = [530, 330];
	map[9] = [527, 320];
	map[10] = [524, 310];
	map[11] = [521, 300];
	map[12] = [518, 290];
	map[13] = [508, 292];
	map[14] = [498, 295];
	map[15] = [488, 298];
	map[16] = [478, 300];
	map[17] = [471, 290];
	map[18] = [464, 280];
	map[19] = [457, 270];
	map[20] = [450, 260];
	map[21] = [443, 250];
	map[22] = [436, 240];
	map[23] = [429, 230];
	map[24] = [422, 220];
	map[25] = [415, 210];
	map[26] = [408, 200];
	map[27] = [401, 190];
	map[28] = [394, 180];
	map[29] = [388, 170];
	map[30] = [378, 160];
	map[31] = [368, 150];
	map[32] = [358, 140];
	map[33] = [348, 130];
	map[34] = [338, 120];
	
	// Director coordenates && Dustance
	var dir1 = [];
	dir1[0] =  200;
	dir1[1] =  205;
	dir1[2] =  207;
	dir1[3] =  210;
	dir1[4] =  212;
	dir1[5] =  215;
	dir1[6] =  217;
	dir1[7] =  220;
	dir1[8] =  222;
	dir1[9] =  225;
	dir1[10] =  227;
	dir1[11] =  230;
	dir1[12] =  235;
	dir1[13] =  150;
	dir1[14] =  160;
	dir1[15] =  157;
	dir1[16] =  155;
	dir1[17] =  152;
	dir1[18] =  150;
	dir1[19] =  180;
	dir1[20] =  180;
	dir1[21] =  181;
	dir1[22] =  181;
	dir1[23] =  182;
	dir1[24] =  182;
	dir1[25] =  183;
	dir1[26] =  183;
	dir1[27] =  184;
	dir1[28] =  184;
	dir1[29] =  180;
	dir1[30] =  180;
	dir1[31] =  180;
	dir1[32] =  180;
	dir1[33] =  180;
	dir1[34] =  180;
	
	/* */
	function init(){
		
		// Hide all alements
		$("div.element").css("display", "none");
		
		// Reveal initial elements
		reveal_background( background[0] );
		reveal_elements( ids[0] );
		
		// Bind behaviour links
		$(".l").click( function(){ links( this ); } );
		
		// Bind behaviour compass
		$("#boton-brujula").click( function(){ compass_trigger(); } );
		
		// init compass to avoid the central position
		compass = 359;
		compass_move();
		
		// Bind behaviour timer
		$("#empezar-timer").click( function(){ timer_trigger(); } );
		$("#terminar-timer").click( function(){ stop_timer(); } );
		
		// Build control volume
		build_control_sound();
		
		// Options
		$(".optionlist").click( function(){ option_trigger( this ); });
		// Tics options
		$(".option-voz").click( function(){ change_tic( this ); });
		$(".option-tono").click( function(){ change_tic( this ); });
		$(".option-mapa").click( function(){ change_tic( this ); });
		// Radio de accion
		build_radio_action();
		
	}
	
	function links( element ){
		
		prev_state = state;
		state = parseInt( $(element).attr("state") );
		
		
		// First time
		if ( state == 1){
			hide_background();
			hide_elements( ids[0] );
			reveal_elements( ["#menu"] );
			reveal_elements( ids[1] );
		}
		
		//mode
		var has_changed = 0;
		if( state == 2  && menu_l[2] == 0) { 
			mode = 1; 
			has_changed = 1;
			menu_l[2] = 1;
		}
		
		if( state == 2  && menu_l[2] == 1 && has_changed == 0) {
			mode = 0; 
			has_changed = 1;
			menu_l[2] = 0;
		}
		
		if( has_changed == 1 ){
		
			if( mode == 0 ){
				hide_background();
				hide_elements( ids[2] );
				reveal_elements( ids[1] );
			}
			
			if( mode == 1 ){
				hide_elements( ids[1] );
				reveal_background( background[2] );
				reveal_elements( ids[2] );
			}
			
			// Remove and add alertas
			hide_elements( ["#alertas-brujula", "#alertas-mapa"] );
			print_alertas(mode);
		}
		
		
		// Operations
		switch (state) {
		case 3:
			if( menu_l[3] == 0 ){
				menu_l[3] = 1;
				if ( (mode == 0 &&  start_timer == 1) == false ){
					print_alertas(mode);
				}
				break;
			}
			if ( menu_l[3] == 1 ){
				hide_elements( ["#alertas-brujula", "#alertas-mapa"] );
				menu_l[3] = 0;
				break;
			}
	
		case 4: 
			if( menu_l[4] == 0 ){
				if( menu_l[5] == 1){ 
					hide_elements( ids[5] );
					menu_l[5] = 0;
				}
			reveal_elements( ids[4] );
			menu_l[4] = 1;
			break;
		}
		if( menu_l[4] == 1 ){
			hide_elements( ids[4] );
			menu_l[4] = 0;
			break;
		}
		

		case 5:
			if(depth > 0){
				depth = 0;
				hide_elements(options_depth);
				reveal_elements( ids[5] );
				reveal_elements( ["#optionlist"] );
				break;
			}
			
			if( menu_l[5] == 0 ){
				if( menu_l[4] == 1){ 
					hide_elements( ids[4] );
					menu_l[4] = 0;
				}
			reveal_elements( ids[5] );
			menu_l[5] = 1;
			break;	
		}
		if( menu_l[5] == 1 ){
			hide_elements( ids[5] );
			menu_l[5] = 0;
			break;
			}
		} // end switch 
		
		rebuild_menu();
	}
	
	
	/* */
	function rebuild_menu(){
		
		for( i = 2; i < 6; i++){
			
			// Build ids
			var m = "mapa";
			if ( i == 3 ){ m = "alertas"; }
			if ( i == 4 ){ m = "volumen"; }
			if ( i == 5 ){ m = "opciones"; }
			
			// Change background for 4 and 5
			switch( i ){
			
			
			case 2:
				var coordenates = "0px 0px";
				if( menu_l[i] == 1  ){
					coordenates = "-80px 0px";	
				}
				
				$("#menu-" + m).css("background-position", coordenates );
				break;
			
			case 3:
				var coordenates = "-80px 0px";
				if( menu_l[i] == 1 ){
					coordenates = "0px 0px";	
				}
				
				$("#menu-" + m).css("background-position", coordenates );
				break;
				
			case 4:
				if( menu_l[i] == 1 ){
					$("#menu-" + m).css("background-image", "url(\"resources/menuhover.jpg\")");
				}else{
					$("#menu-" + m).css("background-image", "url(\"resources/menu.jpg\")");
				}
				break;
			
			case 5:
				if( menu_l[i] == 1 ){
					$("#menu-" + m).css("background-image", "url(\"resources/menuhover.jpg\")");
				}else{
					$("#menu-" + m).css("background-image", "url(\"resources/menu.jpg\")");
				}
				break;
			}
		}
		
	}
	
	
	/* */
	function hide_elements( ids ){
		
		for( i = 0; i < ids.length; i++  ){
			// Hide  elements
			$( ids[i] ).animate(
					{ opacity: 0 }, 
					50		
			);
		
			$( ids[i] ).css("display", "none");	
		}
		
		
	}
	
	/* */
	function reveal_elements( ids ){
		
		for( i = 0; i < ids.length; i++  ){
			$( ids[i] ).css("display", "inline");
			if( ids[i] != "#volumen" &&  ids[i] != "#opciones"){
				$( ids[i] ).animate(
					{ opacity: 1 }, 
					50		
				);
			}else{
				$( ids[i] ).animate(
						{ opacity: 0.8 }, 
						50		
				);
			}
		}
	}
	
	/* */
	function hide_background(){
		
		// Hide background
		$( "#background" ).animate(
				{ opacity: 0 }, 
				200		
		);	
	}
	
	/* */
	function reveal_background( background ){
		
		$( "#background" ).css("background-image", "url(\"resources/"  + background + "\")" );
		
		// Show background
		$( "#background" ).animate(
				{ opacity: 1 }, 
				200		
		);
	}
	
	/* */
	function print_alertas(mod){
		
		if( mod == 0 && menu_l[3] == 1 ){
			$( "#alertas-brujula" ).css("display", "inline");
			$( "#alertas-brujula" ).animate(
					{ opacity: 1 }, 
					200		
			);
		}
		
		if( mod == 1 && menu_l[3] == 1 ){
			$( "#alertas-mapa" ).css("display", "inline");
			$( "#alertas-mapa" ).animate(
					{ opacity: 1 }, 
					200		
			);
		}
	}
	
	/* */
	function compass_trigger( ){
		
		// reiniciar variable
		compass = 0;

		// Iniciar
		setTimeout( function(){ compass_move(); } , 100);	
	}
	
	/* */
	function compass_move(){
		
		if ( compass < 360 ){
			
			compass_calc( "#flecha", compass );
			marcador_calc( "#marcador2", compass );
			
			// Increase var
			compass += 2;
			setTimeout( function(){ compass_move(); } , 30);	
		}
	
	}
	
	function compass_calc( name, deg){
		
		// radio in pixeles
		r = 105;
		
		// center
		cx = 115; 
		cy = 80;
		
		// a = radians
		a = deg * ( Math.PI / 180 )
		// Ecuation to calculate
		x = cx + r * Math.cos(a);
		y = cy + r * Math.sin(a);
		
		// Css
		var degrees = (180 - deg ) % 360 ;
		$(name).rotate(degrees);
		$(name).css( { "margin-top": x, "margin-left": y } );
		
	}
	
	/* */
	function marcador_calc( name, deg ){
		
		// radio in pixeles
		r = 105;
		
		// center
		cx = 135; 
		cy = 130;
		
		// a = radians
		a = deg * ( Math.PI / 180 )
		// Ecuation to calculate
		x = cx + r * Math.cos(a);
		y = cy + r * Math.sin(a);
		
		// Css
		var degrees = (180 - deg ) ;
		//console.log(degrees);
		//$(name).rotate(deg);
		$(name).css( { "margin-top": x, "margin-left": y } );
	}
	
	/* */
	function distance_calc( real_state, type ){
		
		var result;
		
		if(type == 1){ 
			result = 140 - ( 5 * real_state );
			if(result > 0 ){
				return result;
			}else{
				return 0;
			}
		}
		
		if(type == 2){
			result = 280 - ( 8 * real_state );
			if(result > 0 ){
				return result;
			}else{
				return 0;
			}
		}
	}
	
	/* */
	function compass_on_track( track_state , director ){
		
		if ( track_state ){
			$("#circulo").css("background-image", "url(\"resources/brujula2.png\")" );
			$(director).css("display", "none");
			$(director + "-marcador").css("display", "none");
		}else{
			$("#circulo").css("background-image", "url(\"resources/brujula.png\")" );
			$(director).css("display", "inline");
			$(director + "-marcador").css("display", "inline");
		}
		
	}
	
	
	/* */
	function timer_trigger(){
		
		start_timer = 1;
		
		timer_event = window.setInterval(function() { timer(); }, 3000);
		
		// Hide normal director
		$("#flecha").css("display", "none");
		$("#marcador2").css("display", "none");
		
		//Create 2 Directors
		director(1);
		// director(2);
		
		//Initial position of directors
		timer_markup();
		
	}
	
	/* */
	function timer(){
		
		timer_state++;
		timer_markup(); // Print mark up
		
	}
	
	/* */
	function stop_timer(){
		
		start_timer = 0;
		
		clearInterval(timer_event);
		
		// Remove directors
		$(".director").remove();
		$(".marcador").remove();
		
		// Default director
		$("#flecha").css("display", "inline");
		$("#marcador2").css("display", "inline");
		
		// Default circulo
		compass_on_track(false);
	}
	
	/* */
	function timer_markup(){
		
		var real_state = timer_state % 35;
		
		// Delete prevoius text
		$("#count-times").empty();
		$("#count-times").append( real_state );
		
		// Move map
		var coordenates = "-" + map[real_state][0] + "px -" + map[real_state][1] + "px";
		$( "#background" ).css("background-position", coordenates );
		// $( "#map-prueba" ).css("background-position", coordenates );
		
		// Move alert
		map_alert_calc(real_state);
		
		
		// Move directors
		compass_calc("#director-1", dir1[real_state] );
		marcador_calc("#director-1-marcador", dir1[real_state] );
		
		//Meters to reach
		$("#director-1-marcador").empty();
		$("#director-1-marcador").append( distance_calc( real_state, 1 ) );
		
		
		// Compass
		if( real_state == 28 ){
			compass_on_track(true , "#director-1");
		}
		
		if( real_state == 0 ){
			compass_on_track(false , "#director-1");
		}
		
		// Alerts
		if( real_state == 20 && menu_l[3] == 1 ){
			alert_sound();
			print_alertas(mode);
		}else{
			hide_elements(["#alertas-brujula"]);
		}
	}
	
	/* */
	function director( n ){
		// Flecha
		var code = "<div id=\"director-" + n + "\" class=\"director\"></div>";
		
		// Count Meters
		var code2 = "<div id=\"director-" + n + "-marcador\" class=\"marcador\">0</div>";
		
		$("#brujula").append(code);
		$("#brujula").append(code2);
	}
	
	/* */
	function alert_sound(){
		
		clickSound.volume = volumen;
		clickSound.play();
		
	}
	
	/* */
	function build_control_sound(){
		
		$("#control-volumen").slider({
			        value: (volumen * 100),
			        range: "min",
			        animate: true,
			        orientation: "vertical",
			        slide: function( event, ui ) {
			            volumen = ui.value / 100;
			            change_volumen_numbers( ui.value / 10 );
			        }
			       	});
		
	}
	
	/* */
	function change_volumen_numbers( n ){
		
		$("#volumen-numeros").empty();
		$("#volumen-numeros").append(n);
		
	}
	
	/* */
	function option_trigger( object ){
		
		depth = 1;
		var show = "#" + $(object).attr("title");
		hide_elements(["#optionlist"]);
		reveal_elements([ show ]);
		
	}
	
	/* */
	function change_tic( object ){
		
		var parent = "#" + $(object).attr("title");
		var id = "#" + $(object).attr("id");
		$(parent + " div").removeClass('tic');
		$(id).addClass("tic");
		
	}
	
	/* */
	function build_radio_action(){
		
		$("#slider-radio-de-accion").slider({
	        value: 50,
	        range: "min",
	        animate: true,
	        orientation: "horizontal",
	        slide: function( event, ui ) {
	            var val = ui.value * 4;
	            $("#medida").empty();
	    		$("#medida").append(val);       
	        }
	       	});
		
	}
	
	/* */
	function map_alert_calc( state ){
		
		if ( state == 0 ){
			alert_coordenates = [ 85, 60 ];
		}
		
		var x = 0;
		var y = 0;
		
		if( state > 1){
			x = map[state][0] -  map[state - 1][0]; // margin left
			y = map[state][1] -  map[state - 1][1]; // margin top
		}
		
		alert_coordenates[0] -= y;
		alert_coordenates[1] -= x;
		
		var coordenates = alert_coordenates[0] + "px 0 0 " + alert_coordenates[1] + "px";
		$("#alertas-mapa").css("margin" , coordenates );
		
	}
	
	
	///////////////////////////////////////////
	
	// Start
	init();
	
	
});