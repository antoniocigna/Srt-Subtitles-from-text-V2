"use strict";
/*  
Srt Subtitles From Text: A tool to build srt file from a text
Antonio Cigna 2021/2022
license MIT: you can share and modify the software, but you must include the license file 
*/ 
/* jshint strict: true */
/* jshint esversion: 6 */
/* jshint undef: true, unused: true */	 

var XSRC1="SRT_v2_from_TEXT_cbc_1_builder_4_2_subtitle_data.jstxt"; // INIZIO

var FAKE_time  = "09:00:00.000"; 		
var FAKE_time2 = "09:00:10.000"; 

var minimum_speed = 0.07;
var milliseconds_per_char = 100;  // calculated every "onclick_precisionCut3(this)"  (magnifyingGlass)  

var ele_inpRngFrom     = document.getElementById("id_inpRngFrom");
var ele_inpRngTo     = document.getElementById("id_inpRngTo");

var sw_line_can_be_broken = true; 
onclick_can_breakLine(sw_line_can_be_broken);
//-------------------------------------------
	
	
	
	//var ele_rangeVal_show = document.getElementById("rangeVal_show"); 
	//var ele_rangeVal_hidden = document.getElementById("rangeVal_hidden"); 
	
	var leftInput = (ele_inpRngFrom.parentElement.offsetWidth - ele_inpRngFrom.offsetWidth) / 2; 
	var rangeMin = parseFloat(ele_inpRngFrom.min);
	var rangeMax = parseFloat(ele_inpRngFrom.max);
	var rangeVal = parseFloat(ele_inpRngFrom.value);	
	var off = ele_inpRngFrom.offsetWidth / ( rangeMax - rangeMin);	
	ele_inpRngFrom.value = ((rangeMax + rangeMin) / 2 ).toFixed(3); //    start value 


	//updateVal(); 




//============================================================

function dummyToReferenceFun() {
	// this fun. is made just to avoid unused error in script check 
	var dummy; 	
	dummy = LoadMessages(); 			//	function called by the 'message_FILE_NAME.txt' file loading 	
	dummy = onclick_playFrom(); //		//	function called by function onclick_row_join()
	dummy = onclick_precisionCut3(); 	//	function called by function onclick_row_join()	
	dummy = onclick_row_join(); 		//	function called by function make_word_button()	
	dummy = onclick_rowsplit();			//	function called by function make_word_button()
	dummy = changeVideoSpeed_gen1(); 	//	function called by html	
	dummy = closeThePage();    			//	function called	by html	
	dummy = fun_after_drop_due(); 		//	function called by html
	dummy = onclick_centerTheCursor(); 	//	function called	by html 
	dummy = onclick_confirm_two(); 		//	function called	by html
	dummy = onclick_pauseContinue(); 	//	function called	by html
	dummy = onclick_rLoopStop(); 		//	function called by html	
	dummy = onclick_separ_cancel(); 	//	function called by html
	dummy = onclick_separ_confirm(); 	//	function called by html
	dummy = onclick_show_what(); 		//	function called	by html
	dummy = onclick_write_srt(); 		//	function called	by html
	dummy = playLeft(); 				//	function called by html 
	dummy = playRight(); 				//	function called by html 
	return dummy; 
}

//------------------

//---------
function get_timehhmmss( str0 ) {
	/*
		try to manager time in srt or vtt  even when non correctly written ( maybe it's out of automatic translation)

		expected ==>    00:12:45,123                   ( hh:mm:ss,mmmm ) 
						00:12:45.123 other staff vtt   ( hh:mm:ss.mmmm )
						00:12:45                       ( hh:mm:ss ) 	
		can manage	1: 2: 45,123      transformed to 00:02:45.123
					12:45,123         transformed to 00:12:45.123
					45,123            transformed to 00:00:45.123					
	*/

	var str1 = (str0+"").trim().replace(",",".").replaceAll(": ",":").replaceAll(": ",":");   
	
	var tt1  = str1.split(":"); 
	var len1 = tt1.length;
	if (len1 < 3) {
		str1 = "00:" + str1; 
		if (len1<2) {  str1 = "00:" + str1; }
		tt1  = str1.split(":"); 
	} 
    var tHH = tt1[0].trim();
    var tMM = tt1[1].trim();	
	var tSS = tt1[2].trim().split(" ")[0];  // ignore whatever follows ( that is the case of vtt subtitiles) 
	
	
    if ( isNaN( tHH ) ) { return; }
    if ( isNaN( tMM ) ) { return; }
    if ( isNaN( tSS ) ) { return; }
	var nHH = parseInt( tHH ); 
	var nMM = parseInt( tMM ); 
	var nSS = parseFloat( tSS ); 	
	
	
	if ( (nHH >= 60) || (nHH < 0) || (nMM >= 60) || (nMM < 0) || (nSS >= 60) || (nSS < 0)  ) {
		return; 
	} 
	
	var seconds = nHH *3600 + nMM*60 + nSS ;  
	
	tHH = (100 + nHH).toString().substring(1); 
	tMM = (100 + nMM).toString().substring(1);
	tSS = (100.0000001 + nSS).toString().substr(1,6);
	
    return [ seconds , tHH + ":" + tMM + ":" + tSS ]; 
	
}  // end of get_timehhmmss(); 
//----------------------------------------
function isTimeLine( str1 ) {
			
			var line = str1.trim().
						replace("- ->" , "-->").
						replace(" -> " , " --> ").
						replace("-- >" , "-->"); // replace used to avoid random error from automatic translation  
			if (line.indexOf("-->") < 0) { 
				return [false,true,"",""]; 
			}						
			var part = line.split("-->"); 
			var timehh_fromX = get_timehhmmss( part[0] );  
			var timehh_toX   = get_timehhmmss( part[1] ); 				
			
			if (( timehh_fromX === undefined) || ( timehh_toX   === undefined)) { 
				console.log("error in " + line ); 
				return [true, true, part[0], part[1]]; 				
			}		
		
		return [true, false, timehh_fromX, timehh_toX];		
}
//--------------------------------------------------
function get_subtitle_strdata( inpsub ) {
	//---------------------------------------
	// get subtitles in srt or vtt format 
	// and return a string with a line for each subtitle group     
	//---------------------------------------
    /* 
		sample of a srt file
			14
			00:01:08,000 --> 00:01:10,000      ixtime[13] = 52
			one line of text
			other lines of text
			 
			15
			00:01:10,000 --> 00:01:15,000      ixtime[14] = 57
			lines
			of texts   
		---------------------------------------------
		sample of a vtt file 
			WEBVTT                             (this is the first line which identify a webvtt subtitle file  		
			STYLE
			::cue(.S1) {
			color: white;
			...
			}
			REGION
			id:R1
			...

			1
			00:00:01.000 --> 00:00:02.040 region:R1 align:center
			<c.S1>one line</c>

			2
			00:00:02.600 --> 00:00:03.640 region:R1 align:center
			<c.S1>another line</c>

    */		
	//-------------------------------------------------------
	
	
	var subline =  inpsub.trim().split("\n");  // <===  INPUT  
	
	//----------------------------
	var i, txt1; 
	
	
	
	var list_time_from = [0];
	var list_time_to   = [0];
	var list_text  = [""];
	var idsrt=[0];
	//------------------------------
	subline.push(""); 
		
	
		// look at what follows the time line,  stop when there is a blank line ( but might be missing ) 
		
		//list_start=[];  
		var line="";
		var preline="";
		
		var list_ix_beg=[0]; 
		var list_ix_end=[0]; 
		
		list_time_from = [0];
		list_time_to   = [0];
		list_text      = [""];
		idsrt          = [""]; 
		var num=0; 
		/***
		subline.push(""); 
		subline.push("99999999"); 
		subline.push("99:99:99,999 --> 99:99:99,999"); 
		**/
		
			var isTime;
			var time_err;
			var timehh_fromX;
			var timehh_toX;
			
		//---
		function close_previous_group()	{
			// the previous line should be a number 
			num = list_ix_end.length-2;
			if (list_ix_beg[ num ] >=0) {  
				if (isNaN( preline ) ) {
					list_ix_end[ num ] = i; 	
				} else {
					list_ix_end[ num ] = i-1;  
				}
			}
		} //end of  close_previous_group()

		//-----------------------------------
		for(i=0; i< subline.length; i++) {
			preline = line; 			
			line = subline[i] ;
			[ isTime,time_err, timehh_fromX, timehh_toX ] = isTimeLine( line ); 
			if (isTime == false) {
				continue; 
			}		
			if (time_err) {
				// error in time line
				list_ix_beg.push( -1 ); 
				list_ix_end.push( -1 ); 
				list_time_from.push( 0 );
				list_time_to.push(   0 );		
				list_text.push(      ""      );			
				idsrt.push(          ""     );
				close_previous_group();	
				
				continue; 
			}			
			
			var timehh_from =  timehh_fromX[1]; 
			var timehh_to   =  timehh_toX[1]; 
			
			var time_secs_from =  timehh_fromX[0]; 
			var time_secs_to   =  timehh_toX[0]; 
			
			list_ix_beg.push( i ); 
			list_ix_end.push( i ); 		 
			
	
			list_time_from.push( time_secs_from );
			list_time_to.push(   time_secs_to   );
		
			list_text.push(      ""      );
			
			idsrt.push(      timehh_from + " " + timehh_to );  
			close_previous_group();	
			
		}	
		
		list_ix_end[  list_ix_end.length-1 ] = 	subline.length;
		
		//-----------------	
		//return [ list_time_from, list_time_to, list_text ,idsrt ]; 
	
		// add_nodialog_clips2( list_time_from, list_time_to, list_text ,idsrt );	
		//------------------------	
		var txt00;
		for(var k=1; k < list_ix_end.length; k++) {
			txt1="";		
			var ixfrom = list_ix_beg[k];
			if (ixfrom < 0) { continue; }
			var ixto  =  list_ix_end[k];
			for(var z= ixfrom+1; z < ixto; z++) { 
				txt00 = subline[z].trim(); 
				
				//console.log("z=" + z + " " + subline[z] + "<==");
				
				if (txt00 !="")  txt1 += "\n" + txt00 + " " ;
			}
			list_text[k] = txt1.substring(1); 		
		} 
		//------------------------	
		/**
		for(var k=1; k < list_ix_end.length; k++) {		
			console.log(list_time_from[k] + "  " + list_time_to[k] + " txt="+ list_text[k] + " idsrt=" + idsrt[k]   ); 
		} 
		**/
		
		
		return [ list_time_from, list_time_to, list_text ,idsrt ]; 
		

	// add_nodialog_clips2( list_time_from, list_time_to, list_text ,idsrt );	
	
} // end of get_subtitle_strdata()



//-----------------------------------


XSRC1="SRT_v2_from_TEXT_cbc_1_builder_4_2_subtitle_data.jstxt"; // FINE

//=========================================================================

var XSRC2="SRT_v2_from_TEXT_1.jstxt" ;  // INIZIO     



//==============================

var sw_DEBUG = false; 


/**
some code about audio file and canvas got from: 
	Making an Audio Waveform Visualizer with Vanilla JavaScript by Matthew Ström (Nov 12, 2019, Jan 27, 2021)
	https://css-tricks.com/making-an-audio-waveform-visualizer-with-vanilla-javascript/

**/
let videoTimePAUSE = 0; 
//============================

//-------------------------------------------------

let event_target_file;

var ele_InputVideo = document.getElementById("id_videoUpload");


sw_file_1audio = false;
sw_file_1video = false;
var sw_type_input_srt = false;
var vid = document.getElementById("id_myVideo") ;
var vid_error = "";
var vid_durationTime = 0; 
var sw_file_video_ready = false;
var sw_file_text_ready  = false;

var estimate_storage_mb = 0;  

var filename_srt = "";
var isPlaying = false;
var path1;
var html_filename;
var sw_wordPlayLoop = false; 
var empty_WORD = '1nbsp1 ';   
var ele_input_prev = null; 

path1 = window.location.pathname;
var f1 = path1.lastIndexOf("/");
var f2 = path1.lastIndexOf("\\");
var f3 = -1;
var barra = "/";
if (f1 > f2) {
    f3 = f1;
    barra = "/";
} else {
    f3 = f2;
    barra = "\\";
}
html_filename = path1.substring(f3 + 1);

// if you want to debug,  change the name of the html file, so that contains the string debug    

if (html_filename.toLowerCase().indexOf("debug") >= 0) {
	sw_DEBUG=true;
} 


document.getElementById("id_srt_err").style.display = "none" ;

//c onsole.log("html_filename="+ html_filename  + "  sw_DEBUG=" + sw_DEBUG); 


var list_time_stamp = []; // hh:mm:ss,mmm --> hh:mm:ss,mmm  eg. 01:01:01,000 --> 01:01:02,999
var list_time_from_secs = []; // secs.mmm                       eg. 123.456
var list_time_to_secs = []; // secs.mmm                       eg. 123.456
var list_text = []; //                                eg. some text     
var ele_video_time = document.getElementById("id_video_time");
var ele_video_sub = document.getElementById("id_video_sub");

var sw_file_1video = false;
var sw_file_1audio = false;

sw_file_1audio = false;
sw_file_1video = false;


var sw_file_video_ready = false;
var sw_file_text_ready  = false;

var isPlaying = false;


var txtGr = "";










var magnifyingGlass_symb = "&#128270;";
var speakinghead_symb = "<span>" + document.getElementById("id_symb_speakinghead").innerHTML + "</span>"; //    '<span>&#128483;</span>' ;
var sunrise_symb = "<span>" + document.getElementById("id_symb_sunrise").innerHTML + "</span>"; //    "<span>&#127748;</span>"
var sunset_symb  = "<span>" + document.getElementById("id_symb_sunset").innerHTML + "</span>"; //    "<span>&#127751;</span>"
var millOverChar_symb = "ms/c";
var start_text_symb = sunrise_symb;
var end_text_symb   = sunset_symb;

var num_word_id = 0;
//====================
//==========================








 






var sw_search_of_word_cut = false;
//----------------
var vid_durationTime = 0;
var video_startTime = 0;
//var video_stopTime = 0;


var video_audio_type = ""; 

var video_src_filename = ""; 
//------------------------------










//--------------------------------
let ele_div20_2           = document.getElementById("id_div20_2"); 
let ele_div_head1         = document.getElementById("id_div_head1"); 
let ele_slider_separ_time = document.getElementById("id_slider_separ_time"); 
//-------------------------------------------------
var cutCursor = '<span class="cutSliderImg">&nbsp;&nbsp;</span>';  


//-----------------------

function fun_after_drop_due() {
	// function called by html 
    var this1 = document.getElementById("id_text1");
    this1.value = split_at_dot(this1.value);

    fun_display("block", ["id_text1"]);

    document.getElementById("id_msg2").innerHTML = "";

    sw_file_text_ready = true;
} // end of fun_after_drop_due


//------------------------------------------------------------ 
function fun_display(blockNone, array_id) {
    // blockNone =   "block" or "none"   
    // array_id  =  one or more id of element to display or to hide     
    if (typeof(array_id) == "string") {
        array_id = [array_id];
    }
    for (var i1 = 0; i1 < array_id.length; i1++) {
        document.getElementById(array_id[i1]).style.display = blockNone;
    }
} // end of fun_display 

//--------------------------------------------

function video_setting2(where) {
	vid_error = "";
	if (video_src_filename == "")  {
        filename_srt = "video_or_audio_filename" + " " + datetime_str() + ".srt";
    } else {
		var j1 = video_src_filename.lastIndexOf(".");
	    filename_srt = video_src_filename.substring(0,j1) + ".srt"; 
    }
	

    //vid = document.getElementById("id_myVideo");
	//c onsole.log("videosetting2 "+where + "   vid=" + vid  + " id="+ vid.id );  
	
	vid_durationTime = vid.duration; 

    videoTimePAUSE = vid.duration;
	
	//console.log("video duration time=" + videoTimePAUSE); 

    isPlaying = false;

    vid.onplaying = function() {
        isPlaying = true;
    };

    vid.onpause = function() {
        isPlaying = false;
    };
	
	vid.ontimeupdate = function() {  
		updateVideoToFindCut();		
    };	

    document.getElementById("id_td_vid1").style.display = "block";
	
	//c onsole.log(where + "  video_setting2() " + " video/audio duration=" + vid_durationTime  + "  file srt=" + filename_srt); 


}  // end of video_setting2()

//--------------------------------------------

function split_at_dot(text1) {
    var newText = ("_. " + text1.trim()).replaceAll(". ", ". \n").replaceAll(" \n", "\n").replaceAll("\n\n", "\n");
    return newText;
}

//----------------------------------------------------------
//----------------------------------------------------
function datetime_str() {
    var d = new Date();
    var n = d.toISOString();
    var local1 = d.toLocaleTimeString();
    return n.substring(0, 10) + " " + d.toDateString().substring(0, 8) + local1;
}


//========================================================== 
//   second part 
//===========================================================	

/*
- each word of the text becomes  a button 
- if the word (this button) is clicked while the video/audio is playing, then the row is splitted and the the video current time is inserted in the txt. 
 
- if you want the break a line at the end of a word, click on the word just after it is spoken:
the line is broken the rest become a new line preceeded by the video current time. 
         
- if you feel the time of click is not exactly at the end of the word, you can rerun the video starting just a few seconds before the end and at the right time click again on the word 
then the time on the line will be replaced    	   
         
- if you want reset the line, that's  join it with the next, then do a double ckick on the same word that broke it. 
*/
//------------------------
function remove_element_id_num( idnum ) {
	var id1 = "row" + idnum;
	var ele_next = document.getElementById(id1);
	
	//c onsole.log("remove_element_id () id=" + id1 + "<==" + " ele_next=" + ele_next)  
	if (ele_next) {
		//c onsole.log("da rimuovere " + ele_next.outerHTML ) ; 
		
		ele_next.remove();
				
		//c onsole.log("dopo il remove " + ele_next.outerHTML ) ; 
	}
}  

//-----------------------------

function onclick_row_join(this1, num_wordX) {
	// function called by make_word_button()

	//c onsole.log("srt onclick_row_join(this1, num_wordX) this1=" + this1.outerHTML );
	/*	
		example  this1.id = "w23", numWordX = 23   
		<button id="w23" class="but_word" onclick="onclick_rowsplit(this, 23)" ondblclick="onclick_row_join(this, 23 )">aufgerufen. </button>
		<span>
			<br id="wbr24">
			<button id="rc24" class="button" onclick="onclick_precisionCut3(this)">🔎</button> 
			<input id="ri24" type="time" value="00:00:29.677" step="0.001">
			<span id="rt24" style="display:none">00:00:29,677 = 29.677641</span>			
			<button id="ra24" class="button c_speaker" onclick="onclick_playFrom(this)"><span>🗣</span></button>
		</span>
		<button id="w24" class="but_word" onclick="onclick_rowsplit(this, 24)" ondblclick="onclick_row_join(this, 24 )">Die </button>
		-----------  or -------	
		example  this1.id = "w13", numWordX = 13   
		<button id="w13" class="but_word" onclick="onclick_rowsplit(this, 13)" ondblclick="onclick_row_join(this, 13 )">Anna</button>
		<span>
			<br id="wbr14">
		</span>
		<button id="w14" class="but_word" onclick="onclick_rowsplit(this, 14)" ondblclick="onclick_row_join(this, 14 )">hat </button>
		
	*/
	
	
	
	
	
	
	remove_element_id_num( (num_wordX + 1) );	

} // end of onclick_row_join  

//-----------------------------
//var magnifyingGlass_symb = "&#128270;"
//----------------------------------------------

function build_row_button(where, id_num, timesec1, timeHHMMSS) {
	
	var newLine = '\n\n<span id="row' + id_num + '" class="c_row">' +  '\n\t<br id="wbr' +  id_num + '">' ;
	var disabled = '';
	var time_wr_color = ''; 
	
	if (timeHHMMSS == FAKE_time) {	
		if (id_num > 1) {
			disabled = 'disabled';
			time_wr_color = ' style="color: #d5daf3;" ';  // input background-color
		}
	}
	
	if (isPlaying) {		
		var id_row_a = "ra" + id_num;
		var id_row_c = "rc" + id_num;
		var id_row_i = "ri" + id_num;
		var id_row_t = "rt" + id_num;
		newLine += "" + 	
			'\n\t<button id="' + id_row_c + '" class="button" onclick="onclick_precisionCut3(this)" ' + disabled + '>' + magnifyingGlass_symb + '</button> ' +
			'\n\t<input  id="' + id_row_i + '" type="time" value="' + timeHHMMSS.replace(",", ".") + '" step="0.001" ' +  time_wr_color  + ' >' +
			'\n\t<span   id="' + id_row_t + '" style="display:none">' + timeHHMMSS + " = " + timesec1 + '</span>' +			
			'\n\t<button id="' + id_row_a + '" class="button  c_speaker" onclick="onclick_playFrom(this)"      ' + disabled + '>' + speakinghead_symb + '</button>' +
			''; 
	}	
	newLine += '\n</span>\n';

    return newLine;


} // end of build_row_button()
//----------------------------------------


//-------------------------------------
function onclick_rowsplit(this1, num_wordX) {
	// function called by make_word_button()

	//c onsole.log("srt onclick_rowsplit()");

	// clicked because you want split the row
	// if the audio/video is running add the time of the cut 
	// otherwise just add a <br> tag  (you want to split the line because it's too long) 
    /** 
		if audio/video is running 
			you want something like this 
			<span>
				<br id="wbr8">
				<button id="ra8" class="button" onclick="onclick_playFrom(this)"><span>🗣</span></button>
				<button id="rc8" class="button" onclick="onclick_precisionCut3(this)">🔎</button> 
				<input id="ri8" type="time" value="00:00:17.809" step="0.001">
				<span id="rt8" style="display:none">00:00:17,809 = 17.8098</span>
			</span>
		otherwise something like 	
			<span>
				<br id="wbr8">
			</span>
	**/
	var timesec1;
	var timeHHMMSS;
	if (isPlaying) {
		timesec1 = vid.currentTime;
		timeHHMMSS = sec2time(timesec1).replace(".", ",");
	} else {
		//timesec1   = 0;
		//timeHHMMSS = "";
		return; 
	}	
	var newLine = build_row_button(1, num_wordX + 1, timesec1, timeHHMMSS);
	
	
	remove_element_id_num( (num_wordX + 1) );
	
	this1.insertAdjacentHTML("afterend", newLine);
	
	highlight_last_row(  document.getElementById("ri" + (num_wordX + 1) ),num_wordX+1,  1  );
	
	sw_wordPlayLoop = false;
	
	/**
	if (document.getElementById("id_spltStopY").checked) {	
		if (isPlaying) { // stop the running clip       
			//this1.style.backgroundColor = "lightgrey";
			pauseVid();
		}
	}
	**/
	
	
} // end of onclick_rowsplit() 

//------------------------------

function push_gr_srt(xtime_from_hhmmss, xtime_to_hhmmss, xtime_from_secs, xtime_to_secs, xtxtGr) {
	
	var ret=0; 
	
	if ( xtxtGr.indexOf(end_text_symb) >= 0) {
				xtime_to_hhmmss = xtime_from_hhmmss; 
				xtime_to_secs   = xtime_from_secs; 
				xtxtGr = " ";
				ret = -1; 
	}
    list_time_stamp.push(xtime_from_hhmmss + " --" + '>' + " " + xtime_to_hhmmss);
    list_time_from_secs.push(xtime_from_secs);
    list_time_to_secs.push(xtime_to_secs);
	
	var str1 = xtxtGr.replaceAll("&nbsp;"," ").replaceAll("   "," ").replaceAll("  "," ").trim() ;
	
    list_text.push( str1 ); 
	
	
	//console.log("\tpush_gr_srt " + " list_time_stamp[" + (list_time_stamp.length-1) + "] = " + list_time_stamp[   list_time_stamp.length-1 ] +  
	//		" list_text[" + (list_text.length-1) + "] = " + list_text[ list_text.length-1]  );
		
	
	return ret; 
	
} // end of  push_gr_srt()           


//-------------------------------------------
function get_time( headRow ) {
			var j1= headRow.indexOf(' id="rt');
			if (j1<0) {return;}
		
			var j2 = headRow.indexOf(">", j1);
			if (j2 < 0) {return; }	
			var j3 = headRow.indexOf("<", j2);			
			if (j3 < 0) {return; }
			
			return headRow.substring(j2+1,j3).split("="); 
			
}
//---------------------------
function push_gr_srt00( xtime_from_secs, xtime_to_secs, xtime_from_hhmmss, xtime_to_hhmmss,  prev_rowText) {

	var str1 = prev_rowText.replaceAll("&nbsp;"," ").replaceAll("   "," ").replaceAll("  "," ").trim() ;
	
	list_time_to_secs.push( xtime_to_secs);
	
	var this_ix = list_time_to_secs.length-1;  
	if (this_ix < 0) {  this_ix=0; }
	
    list_time_from_secs.push(   xtime_from_secs ) ; 
	
    list_text[ this_ix ] = str1 ; 
	
	list_time_stamp[ this_ix ] =  xtime_from_hhmmss + " --" + '>' + " " + xtime_to_hhmmss  ;
	
	return this_ix; 
	
} // end of  push_gr_srt00() 

//-----------------------------------

function appendTextToLastValid( ix2, text1) {
	
	var str1 = text1.replaceAll("&nbsp;"," ").replaceAll("   "," ").replaceAll("  "," ").trim() ;
	list_text[ ix2 ] += "\n" + str1; 
	
} // end of appendTextToLastValid()  

//----------------------------
function build_srt_list() {
	
    list_time_stamp = [];
    list_time_from_secs = [];
    list_time_to_secs = [];
	
	var PR = getBuilderMark(); 
	
    list_text = [];  //  [PR];
    var time_from, time_to, time_to_hhmmss, time_to_secs, time_from_hhmmss, time_from_secs;

    time_from_hhmmss = "00:00:00,000";
    time_from_secs = 0.0;
    txtGr = "";   
    
	var butwords = document.getElementById("id_p_text").children;
	
	var begX = 0; 
	
	var rc =0;
	var last_x = butwords.length;
	
	
	time_from_hhmmss = "00:00:00,000";
	time_from_secs=0;
	txtGr = PR;	
	//----------------------
	for (var x = begX; x < last_x; x++) {		
        var child1 = butwords[x];
		var last_ix=-1; 
		
		if (child1.tagName == "SPAN") {	// row begin is in   span/span				
			time_to = get_time( child1.outerHTML ); 
			if (time_to == null) { continue; }
				
			
            time_to_hhmmss = time_to[0].trim();
            time_to_secs   =  parseFloat( time_to[1]);	
						
			last_ix = push_gr_srt00( time_from_secs,time_to_secs, time_from_hhmmss, time_to_hhmmss,    txtGr);
						
            time_from_hhmmss = time_to_hhmmss;
            time_from_secs = time_to_secs;
            txtGr = "";
            continue;				
		} else {
			if (x >0) {
				txtGr += child1.innerHTML;
			}	
		}		
	}

}  // end of build_srt_list()

//-----------------------------------------------

function onclick_playFrom(this1) {
	// function called by    build_row_button()

	//console.log("srt onclick_playFrom() " + this1.id); 
	
	var input_id = this1.id.replace("ra","ri"); 
	
    //var next_butt_ele = this1.nextElementSibling;
    //var next_input_ele = next_butt_ele.nextElementSibling;
	var next_input_ele = document.getElementById( input_id ); 
	
    if (next_input_ele.tagName == "INPUT") {
        var timeHHMMSS = next_input_ele.value; // hh:mm:ss.mmm; 
        var timeHHMMSS_tt2 = timeHHMMSS.split(":");

        var t_secs0 = parseFloat(timeHHMMSS_tt2[0] * 3600 + parseFloat(timeHHMMSS_tt2[1] * 60) + parseFloat(timeHHMMSS_tt2[2]));
        var t_secs = t_secs0.toFixed(3);

        fun_playFrom2(next_input_ele, t_secs);
    }
}
//


//---------------------

function fun_playFrom2(thisInput, time_secs) {
	//console.log("fun_playFrom2( " + thisInput.id + " time_secs=" + time_secs);

	sw_wordPlayLoop = false; 
    const input_collection = document.getElementsByTagName("INPUT");

    var index = -1;

    for (let i = 0; i < input_collection.length; i++) {
        if (input_collection[i] == thisInput) {
            index = i;
            break;
        }
    }
    if (index < 0) {
        return;
    }
    var nextIx = index + 1;
    var nextInputValue = "";

    if (nextIx < input_collection.length) {
        nextInputValue = input_collection[nextIx].value;
    }

    var timeHHMMSS = nextInputValue; // hh:mm:ss.mmm; 
    var timeHHMMSS_tt2 = timeHHMMSS.split(":");

    var t_secs0 = parseFloat(timeHHMMSS_tt2[0] * 3600 + parseFloat(timeHHMMSS_tt2[1] * 60) + parseFloat(timeHHMMSS_tt2[2]));


    var next_secs = parseFloat(t_secs0.toFixed(3));
    if (next_secs == 0) {
        next_secs = vid.duration;
    }

    videoTimePAUSE  = next_secs;
	try {
		vid.currentTime = time_secs;
	} catch(e1) {
		console.log("error in 'onclick_playFrom(time_secs=" + time_secs +") " + e1 );
	} 

    playVid();

} // end of onclick_playFrom()
//-------------------------------------------
function onclick_pauseContinue(this1) {
	// function called by html  
	sw_wordPlayLoop = false;
    if (isPlaying) { // stop the running clip       
        this1.style.backgroundColor = "lightgrey";
        pauseVid();
    } else {
        this1.style.backgroundColor = null;
        playVid();
    }
} // end of onclick_pauseContinue()
// -----------------------------------	
function onclick_write_srt() {
	// function called by html  

    build_srt_list();
    if (list_time_from_secs.length < 0) {
        return;
    }
    var srt_txt = "",
        numGr = 0;
    
    var v;
	/***
    for (v = 0; v < list_time_stamp.length; v++) {
		var str2 = list_text[v] ;
		if (str2 == "") { continue; }
        numGr += 1;
		console.log(" onclick_write_srt()" + " v="+v + " numgr=" + numGr + " " + list_time_stamp[v] + " " + str2); 
        srt_txt += numGr + "\n" + list_time_stamp[v] + "\n" + str2 + "\n\n";
    }
	***/
	
	for (v = 0; v < list_time_stamp.length; v++) {
		var str2 = list_text[v].replace("_.","").trim();
		if (str2 == "") { continue; }
		/**
		if (v < 5) {
			if (str2 == "_.") continue;
		}
		**/
        numGr += 1;
		var xtime = list_time_stamp[v]; 
		if ( xtime.substr(0,12) == FAKE_time) {
			srt_txt += "\n" + str2; 
			continue;
		}
		//console.log(" onclick_write_srt()" + " v="+v + " numgr=" + numGr + " " + xtime + " " + str2); 
		
        srt_txt += "\n\n" + numGr + "\n" + list_time_stamp[v] + "\n" + str2 ;
    }
	if (numGr < 2) {
        return;
    }
	if (srt_txt.substr(0,2) == "\n\n") {
		download(filename_srt, srt_txt.substring(2) + "\n"); 
	} else {  
		download(filename_srt, srt_txt + "\n"); 
	}

} // end of onclick_write_srt()
//--------------------------------------
function onclick_show_what() {
	// function called by html 
    if (document.getElementById("id_whatToDo").style.display == "none") {
        document.getElementById("id_whatToDo").style.display = "block";
        document.getElementById("id_td_vid1").style.display = "none";
		
    } else {
        document.getElementById("id_whatToDo").style.display = "none";
        document.getElementById("id_td_vid1").style.display = "block";	
    }
}
//----------------------------------------------------

function sec2time(timeInSeconds) {
    return new Date(timeInSeconds * 1000).toISOString().substr(11, 12);
}

//-----------------------------------------------------

function onclick_split_into_rows(nn) {
	//c onsole.log("srt onclick_split_into_rows()"); 
    sw_file_text_ready = false;
    document.getElementById("id_msg1").innerHTML = "";
    document.getElementById("id_msg2").innerHTML = "";
    var text1 = document.getElementById("id_text1").value.trim();
    if (text1 == "") {
        //31 document.getElementById("id_msg1").innerHTML = "";  
        // text file is missing 
		missing_file_msg(3);
        return;
    }
    //text1 = zeroLine + '\n' + text1;

    document.getElementById("id_msg2").innerHTML = "";
	var newText;
    if (sw_line_can_be_broken) {
		newText = text1.replaceAll(". ", ". \n").replaceAll(" \n", "\n").replaceAll("\n\n", "\n");
	} else {
		newText = text1.replaceAll(" \n", "\n").replaceAll("\n\n", "\n");
	}
    document.getElementById("id_text1").innerHTML = newText.trim();
	
	get_srt_dataInput( sw_type_input_srt );
    	
    sw_file_text_ready = true;

    if (sw_file_video_ready) {
        video_setting2("2 onclick_split_into_rows()");
        go_on();
    } else {
		missing_file_msg(4); 
    }

} // end of onclick_split_into_rows()


//-------------------------------------------------

function  get_srt_data_from_text(new_text, firstTimesecs ) { 		

	var pez1=""; var pez0=""; 
	
	var lenRowMax=50; 
	
    var rows = new_text.split("\n");
	
	var from1  = firstTimesecs
	var to1    = 9 * 3600 + 10;    
	var timeh1 = FAKE_time ;   		
	var timeh2 = FAKE_time ;   	// FAKE_time2;  
	var rigaFrom = [], rigaTo=[], rigaTxt=[], idsrt=[]; 
	if (firstTimesecs > 0) {
	
	} else {
		rigaFrom = [ firstTimesecs ];
		rigaTo   = [0];
		rigaTxt  = [""];
		idsrt    = [""]; 		
	}
	//-----------------------------
	function push1( pez1 ) {
			rigaFrom.push( from1 ); 
			rigaTo.push( to1 ); 
			rigaTxt.push(pez1); 
			idsrt.push( timeh1 + " " + timeh2 ); 				
	}		
	//----------------------------
	function words_from_one_line(rowOne) { 
		if (sw_line_can_be_broken) {
			var woFS = rowOne.split(". ");
			for(var zx=0; zx < woFS.length; zx++) {  
				var wo = woFS[zx].split(" "); 		
				pez1=""; pez0="";
				for(var z2=0; z2 < wo.length; z2++) {
					pez0 += wo[z2] + " "; 
					if (pez0.length > lenRowMax) {
						push1( pez0 ); 
						pez0=""; 		
					}				
				}
			}
			if (pez0 != "") {
				push1( pez0 ); 
				pez0=""; 	pez1 = pez0;				 
			}
		} else {
			push1( rowOne); 
		}	
	} // end of  words_from_one_line()
	
	//-------------------------	
	for(var z1=0; z1 < rows.length; z1++) {
		words_from_one_line( rows[z1] ); 		
	} 
	//--------------------	
	console.log("firstTimesecs = " + firstTimesecs ); 
	if (firstTimesecs <= 0) { 
		//to1   = from1;
		to1 = 9 * 3600;  
		from1 = 0; 
		timeh1= "00:00:00.000"; 
		timeh2= FAKE_time;  // "09:00:00.000";
		rigaFrom[1] = from1; 
		rigaTo[1]   = to1  ; 
		idsrt[1]    = timeh1 + " " + timeh2; 	
	}
	
	return [rigaFrom, rigaTo, rigaTxt, idsrt];  
	
} //  get_srt_data_from_text()

//----------------------------------------



//----------------------------------------------
function elab_row_fromsrt(index, from1, to1, timehh_from, timehh_to, srt_txt) {
	/**	
	input file content:	
		2
		00:00:16,042 --> 00:00:20,377
		one two three four 

	---------------
	intermediate output: 
	<span id="row2" class="c_row">
		<br id="wbr2">
		<button id="rc2" class="button" onclick="onclick_precisionCut3(this)">🔎</button> 
		<button id="rs2" class="button" onclick="onclick_getMsecOverChar(this)">ms/c</button> 
		<input id="ri2" type="time" value="00:00:16.227" step="0.001">
		<span id="rt2" style="display:none">00:00:16,227 = 16.227438</span>		
		<button id="ra2" where="1" class="button" onclick="onclick_playFrom(this)"><span>🗣</span></button>
	</span>
	<button id="w2" class="but_word" onclick="onclick_rowsplit(this, 2)" ondblclick="onclick_row_join(this, 2 )">one </button>
	<button id="w3" class="but_word" onclick="onclick_rowsplit(this, 3)" ondblclick="onclick_row_join(this, 3 )">two </button>
	<button id="w4" class="but_word" onclick="onclick_rowsplit(this, 4)" ondblclick="onclick_row_join(this, 4 )">three </button>
	<button id="w5" class="but_word" onclick="onclick_rowsplit(this, 5)" ondblclick="onclick_row_join(this, 5 )">four </button>
	**/

	if (from1 == to1) {  // skip the beginning 
		return ""; 
	}
		
	isPlaying = true;
	var startRow = build_row_button(2, (num_word_id + 1), from1, timehh_from);
	isPlaying = false;
	
	var newriga1;	
	if (sw_line_can_be_broken) {
		newriga1 = split_in_words(srt_txt).trim(); 
	} else {
		newriga1 = only_one_word(srt_txt).trim(); 
	}	
	
	var ret = startRow + newriga1;
	
    return ret;
	
} // end of elab_row_fromsrt()
//-----------------------------------------------

//--------------------------------------
function get_srt_dataInput( sw_srt ) {

	document.getElementById("id_srt_err").style.display = "none" ;	
	
    // input srt  ( because we want to verify and correct it)
    var rigaFrom, rigaTo, rigaTxt, idsrt;
    var from1, to1, txt1, timeh1, timeh2;
    var colx;
    var new_text = document.getElementById("id_text1").value;
	
	var firstTimesecs = 0;  
	//------------------------------
	function isError() {  
		try { 
			if (rigaFrom === "undefined")  {	
				console.log("error1  in 'copy_textarea_srt()'" + " rigaFrom undefined");
				return;
			}
			if (typeof rigaFrom === "undefined")  {
				console.log("error2  in 'copy_textarea_srt()'" + " rigaFrom object undefined");
				return;
			}
			if (typeof rigaFrom == "object") {
				if (rigaFrom.length < 2) {	
					document.getElementById("id_srt_err").style.display = "block" ; // srt file missing or in error 
					return;  
				}
			} else {
				document.getElementById("id_srt_err").style.display = "block" ; // srt file missing or in error  
				return ;
			} 
		} catch(e1) {
			console.log("error3 in 'copy_textarea_srt()' " + e1);
			return;
		} 
	} // end of isError()
	
	//------------------------------------------
	function fun_srt1() {
		[rigaFrom, rigaTo, rigaTxt, idsrt] = get_subtitle_strdata(new_text);// this function and its container file is copied
																			// from "Builder"  part of the "ClpByClip" application.	
		var posLastRow2 = rigaTxt.length-2; 
		var lastRow2 = rigaTxt[ posLastRow2 ];			
		var posLastRow = rigaTxt.length-1; 		
		var lastRow = rigaTxt[ posLastRow ]; // last element
		var last2row = lastRow.split("\n"); 
				
		if (last2row.length > 2) {
			var firstTimesecs = rigaFrom[  rigaTo.length-1 ];				
			var pop1 = rigaFrom.pop();
			pop1 = rigaTo.pop();
			pop1 = rigaTxt.pop();
			pop1 = idsrt.pop();
						
			var rigaFrom2, rigaTo2, rigaTxt2, idsrt2; 	
			[rigaFrom2, rigaTo2, rigaTxt2, idsrt2] = get_srt_data_from_text( lastRow, firstTimesecs ); 
			var timeh00 = sec2time(rigaFrom2[0]);
			idsrt2[0] = timeh00 + idsrt2[0].substring(12); 
		
			rigaFrom = rigaFrom.concat( rigaFrom2 );
			rigaTo   = rigaTo.concat(   rigaTo2   );
			rigaTxt  = rigaTxt.concat(  rigaTxt2  );
			idsrt    = idsrt.concat(    idsrt2    );	
		}		
	} // end of fun_srt1()
	//-----------------------------
	if (sw_srt) {
		fun_srt1();		
	} else {
		[rigaFrom, rigaTo, rigaTxt, idsrt] = get_srt_data_from_text(new_text, firstTimesecs ); 
	} 	
	if (isError()) return; 

	var allrows2 = head_button();     
	
	//----------------
    for (var x = 1; x < rigaFrom.length; x++) {
        from1 = rigaFrom[x];
        to1 = rigaTo[x];
        txt1 = empty_WORD + rigaTxt[x];
        colx = idsrt[x].split(" ");
        timeh1 = colx[0];
        timeh2 = colx[1];
        allrows2 += elab_row_fromsrt(x, from1, to1, timeh1, timeh2, txt1);
    }
	
	isPlaying = true;
	from1=to1;
	var timehh_from = timeh2;
	
	var startRow = build_row_button(3, (num_word_id + 1), from1, timehh_from);
	isPlaying = false;
	allrows2 += startRow;
	if (sw_line_can_be_broken) allrows2 += make_word_button("&nbsp;", " ");
	else  allrows2 += only_one_word("&nbsp;");
	
    document.getElementById("id_p_text").innerHTML = allrows2;
		
	//console.log("allrows2 =\n" +allrows2.substring(0,500)); 

} // end of get_srt_dataInput()

// ========================================================

//-------------------------------------------
function make_word_button(word1, wSeparString) {

    var newword;
    if (word1 == "") {
        if (wSeparString == "") {
            return "";
        }
        newword = '</span>' + wSeparString + '<span>';
    } else {
        num_word_id += 1;
		
		if (word1 == empty_WORD.trim()) {  word1 = '&nbsp;'; }
		
        newword = '\n\t<button id="w' + num_word_id + '" class="but_word" ' +
					' onclick="onclick_rowsplit(this, ' + num_word_id + ')"  ' + 
					' ondblclick="onclick_row_join(this, ' + num_word_id + ' )">' +
            word1 +
            wSeparString +
            '</button>';

    }

    return newword;

} // end of make_word_button

//----------------

function only_one_word(word1) {	
	
	num_word_id += 1;
    var newword = '\n\t<button id="w' + num_word_id + '" class="but_word" ' +
					' onclick="onclick_rowsplit(this, ' + num_word_id + ')"  ' + 
					' ondblclick="onclick_row_join(this, ' + num_word_id + ' )">' +
            word1.replace(empty_WORD,"") +
            '</button>';
    return newword;

} // end of only_one_word()

//-----------------------
function split_in_words(row1) {

    var pattern = /[\.\'\",;:\[\]\(\)\/\\\!+|\&]/g; // word separators   ( used to change all separator characters to space
    var patternNot = /[^ ]/g; // accept all character, but exclude space -->  only word and non separator

    var char1_special = "§".charAt(0);
	
	row1 = row1.replaceAll(char1_special,' ') + ' ';    // remove all char1_special if any present 
	

    var rowS = row1.replaceAll(pattern, ' ');
    var rowWS = rowS.replaceAll(patternNot, char1_special) + ' ';
    var newline = "";



    // eg.   row1 =in Deutschland. Russland und
    //       rowWS=§§ §§§§§§§§§§§§ §§§§§§§§ §§§ 

    var jstart = 0,
        j1s = 0;
    var word1 = "";
    var separString = "";
    var newword = "";
    var jw = rowWS.indexOf( char1_special, 0);
    if (jw < 0) {
        return "";
    }
    if (jw > 0) {
        separString = row1.substring(0, jw);
        newword = separString;
        newline += newword;
    }
    jstart = jw;
    var len1 = row1.length;

    for (var v1 = 0; v1 < len1; v1++) {
        j1s = rowWS.indexOf(' ', jstart); // find first separator 

        word1 = row1.substring(jstart, j1s);



        if (j1s >= len1) {
            newline += make_word_button(word1, '');

            break;
        }

        jw = rowWS.indexOf( char1_special, j1s); // find first character of a word
        if (jw < 0) {
            separString = row1.substring(j1s);

            newline += make_word_button(word1, separString);

            break;
        }
        separString = row1.substring(j1s, jw);
        newline += make_word_button(word1, separString);


        separString = "";
        word1 = "";
        jstart = jw;
    }

    return newline;

} // end of split_in_words
//----------


// =====================================================================



//-----------------------------------		
// Play video function
function playVid() {
    if (vid.paused && !isPlaying) {
		//c onsole.log("playVid() current="+ vid.currentTime + " videoTimePAUSE="+ videoTimePAUSE); 
        vid.play();
    } else {
        //c onsole.log("play No OK: vid.paused=" + vid.paused + "   isPlaying=" + isPlaying);
    }
}
//---------------------------------
// Pause video function
function pauseVid() {
    if (!vid.paused && isPlaying) {
		//c onsole.log("pauseVid() currentTime=" + vid.currentTime); 
        vid.pause();
    } else {
        //c onsole.log("PAUSE  NO OK: vid.paused=" + vid.paused + "   isPlaying=" + isPlaying + " currentTime=" + vid.currentTime );
    }
}

//--------------------------------------------------------
function get_ix_of_time_secs(timeInSeconds) {
    var ix = -1;

    for (var z = 0; z < list_time_from_secs.length; z++) {
        if (timeInSeconds < list_time_from_secs[z]) {
            break;
        }
        if (timeInSeconds > list_time_to_secs[z]) {
            continue;
        }
        if ((timeInSeconds >= list_time_from_secs[z]) && (timeInSeconds <= list_time_to_secs[z])) {
            ix = z;
        }
    }


    return ix;
}
//-----------------------------------------------------------
function set_time_to_show(time_secs) {

    var msg = "";


    var hhmmss = new Date(time_secs * 1000).toISOString().substr(11, 8);


    var ix = get_ix_of_time_secs(time_secs);


    if (ix >= 0) {
        hhmmss += "  ( " + (ix + 1) + " )";
        msg = list_text[ix];
    }

    ele_video_time.innerHTML = hhmmss;
    ele_video_sub.innerHTML = msg;


} // end of set_time_to_show

//----------------------------------------
function missing_file_msg(nn) {
	//console.log("missing_file_msg(" + nn + ")"  +  
	//	" sw_file_text_ready=" + sw_file_text_ready + " sw_file_video_ready=" + sw_file_video_ready);       

	if (sw_file_text_ready == false) {
		document.getElementById("id_msg2").innerHTML = "<b>" + document.getElementById("m303").innerHTML + 
			"</b>" + "<hr><br>"; // text file missing
        document.getElementById("id_msg2").style.color = "red";
    }	
    if (sw_file_video_ready == false) {		
        document.getElementById("id_msg1").innerHTML = "<b>" + document.getElementById("m301").innerHTML + 
			"</b>" + "<hr><br>"; // video/audio file is missing;	
        document.getElementById("id_msg1").style.color = "red";
    }
	//console.log("msg1=" + document.getElementById("id_msg1").innerHTML + "\nmsg2=" + document.getElementById("id_msg2").innerHTML); 
} //

//-------------------------------------------------------

function go_on() {

    if (sw_file_video_ready && sw_file_text_ready) {
        document.getElementById("id_part1").style.display = "none";
        document.getElementById("id_split").style.display = "none";
        document.getElementById("id_msg1").innerHTML = "<br>";
        document.getElementById("id_div20").style.display = "block";
        document.getElementById("id_div20").scrollIntoView();
        return;
    }
	missing_file_msg(1); 
}
//------------------------------------------	
function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' +
        encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

//-------------------------
function handleFiles(ele_inp1, id_to_elem1, src_value_inner, fun_after_drop1, id_error1) {
    if (ele_inp1.files.length < 1) {
        return;
    }

    document.getElementById(id_error1).innerHTML = "";

    var to_elem1 = document.getElementById(id_to_elem1);

    var file1 = ele_inp1.files[0]; //  <input type="file"  

    var type_file = file1.type;
    var filename00 = file1.name;


    if ((filename00.substring(filename00.length - 4) == ".srt") || (filename00.substring(filename00.length - 4) == ".vtt")) {		
		document.getElementById("id_srt_err_file").innerHTML = filename00;
        sw_type_input_srt = true;
        type_file = "text";
		//c onsole.log("tipo SRT  sw_type_input_srt=" + sw_type_input_srt ); 
    }
	
    if (is_toElem_tagName_compatible_type_file(to_elem1, type_file) == false) {
        var msgfile1 = "<span style='color:blue;'>" + filename00 + "</span>";
        document.getElementById(id_error1).innerHTML = type_file + "<br>" + msgfile1 + "<br>" + document.getElementById("m302").innerHTML + "<hr><br>"; // incompatible
        document.getElementById(id_error1).style.color = "red";
        return;
    }

    var reader = new FileReader();

    var type1 = src_value_inner.toLowerCase();

    if (type1 == "src") {
        reader.readAsDataURL(file1);
    } else {
        reader.readAsText(file1);
    }
    reader.onload = function(e) {
        if (type1 == "src") {
			video_src_filename = file1.name;
			console.log("video file src=" + video_src_filename) ;
        }
        copy_to1(to_elem1, e.target.result, src_value_inner);
        fun_after_drop1();
    };
    reader.onerror = function() {
        console.log("error in 'handleFiles(): " + reader.error);
        copy_to1(to_elem1, reader.error, src_value_inner);
    };
} // end of handleFiles()	

//-------------------------------

function is_toElem_tagName_compatible_type_file(to_elem0, type_file0) {

    var to_elemTagName = to_elem0.tagName.toLowerCase();
    var type_file = (type_file0.split("/"))[0].toLowerCase();

    if (to_elemTagName == "img") {
        return ((type_file == "image") ? true : false);
    }
    if (to_elemTagName == "video") {
        if ("  video audio ".indexOf(type_file) > 0) {
            return true;
        }
        return false;
    }
    if (to_elemTagName == "audio") {
        return ((type_file == "audio") ? true : false);
    }

    if (" textarea input ".indexOf(to_elemTagName) > 0) {
        return ((type_file == "text") ? true : false);
    }
    return true;
} // end of is_toElem_tagName_compatible_type_file

//-------------------------------------------

function copy_to1(ele1, result1, src_value_inner) {
    // drop result 
    switch (src_value_inner) {
        case "src":
            ele1.src = result1;
            break;
        case "value":
            ele1.value = result1;
            break;
        default:
            ele1.innerHTML = result1;
            break;
    }
} // end of copy_to1	
//---------------------------------

function changeVideoSpeed_gen1(this1) {	
	// called by HTML   id="id_rangespeed_gen1" 
	
	
	
	var val1 =  parseFloat(this1.value);
	if (val1  < minimum_speed) { 
		val1 = minimum_speed; 
		this1.value = val1;
	}	
	try{
		vid.playbackRate = val1; 		
		document.getElementById("val1_speed0").style.display = "none";
	} catch {
		document.getElementById("val1_speed0").style.display = "block";
		document.getElementById("val1_speed").innerHTML = val1; 
	}
}

//---------------------------------
function getBuilderMark() {
	var msg1="srt file for '"; 
	
	var video_filenameXsrt = video_src_filename;
	
	var j1 	= video_filenameXsrt.lastIndexOf(barra);	
	var video_srt_fn;
	var video_srt_path;
	if (j1 >0) {
		video_srt_fn   = video_filenameXsrt.substring(j1+1);
		video_srt_path = video_filenameXsrt.substring(0, j1+1);
		msg1 += video_srt_fn + "' \n\t     found in '" +  video_srt_path + "'"; 
	}  else {
		video_srt_fn   = video_filenameXsrt;
		video_srt_path = "";
		msg1 += video_srt_fn + "'"; 
	}

    const d = new Date(Date.now());
    let blddate = d.toLocaleString();
	
	var ret_str =  msg1 + "\n" +   
		"built on " + blddate + " by " + html_filename + " file\n    (written by Antonio Cigna in 2021/2022)";
	return ret_str; 	
} // end of getBuilderMark()

//---------------------------------

function onclick_precisionCut3(this1) {

	var num_id = this1.id.substring(2);
    
    var id_time = "rt" + num_id;
	
    var time_to = (document.getElementById(id_time).innerHTML).split("=");
    var time_to_hhmmss = time_to[0].trim();
    var time_to_secs = parseFloat(time_to[1]);
	
	document.getElementById( "id_div_cut"   ).style.display = "block";
	document.getElementById( "id_div_p_text").style.display = "none"; 
	
    //console.log(" srt onclick_precisionCut3()   num_id=" + num_id + "  time=" + time_to_hhmmss + "   secs=" + time_to_secs);
	
	onclick_hideShowSlider2(this1, "srt", num_id, time_to_secs, time_to_hhmmss) ;
	
}


//--------------------------------

function resetAndGoBack() {
    //c onsole.log("CONFERMA il tempo di separazione " + document.getElementById("id_cut_point").innerHTML);
	
	var num_id    = document.getElementById( "id_caller_num_id").innerHTML; 
	
	if (1*num_id > 0) {
		num_id = num_id - 1;
	}
	var pos_id = "w" + num_id;	
	
	ele_div20_2.style.display = "block";
	
	ele_div_head1.style.display = "flex";
	
	document.getElementById( "id_div_cut"   ).style.display = "none"; 
	document.getElementById( "id_div_p_text").style.display = "block"; 
	if (document.getElementById( pos_id) ) {
		document.getElementById( pos_id  ).scrollIntoView();	
	}
}
//----------------------------
function highlight_last_row( ele_input, id1, nn ) {
	if (ele_input_prev) {
		ele_input_prev.style.backgroundColor = null;
	}
	if (ele_input) {
		ele_input.style.backgroundColor = "yellow"; 
		ele_input_prev = ele_input; 
	} else {
		//alert("highlight_last_row(ele_input) id=" + id1 + " nn="+ nn ) ;
		console.log("highlight_last_row(ele_input) id=" + id1 + " nn="+ nn ) ;
		console.log("  ele_input=" + ele_input);
		console.log("  ele_input.id=" + ele_input.id);
	}
	
} 
//------------------------------
function confirmCutTime() {
    //c onsole.log("CONFERMA il tempo di separazione " + document.getElementById("id_cut_point").innerHTML);
	
	var num_id    = document.getElementById( "id_caller_num_id").innerHTML; 
	var ele_input = document.getElementById( "ri" + num_id );
	var ele_time  = document.getElementById( "rt" + num_id );
	
	
	
	ele_input.value = ele_cut_point_HHMMSS.innerHTML.replace(",","."); 
	
	highlight_last_row( ele_input, num_id, 2 ); 
	
	ele_time.innerHTML  = ele_cut_point_HHMMSS.innerHTML  + "=" + document.getElementById( "id_cut_point" ).innerHTML;
	
    sw_search_of_word_cut = false;
	
	if (1*num_id > 0) {
		num_id = num_id - 1;
	}
	var pos_id = "w" + num_id;	
	ele_div20_2.style.display = "block";
	ele_div_head1.style.display = "flex";
	
	document.getElementById( "id_div_cut"   ).style.display = "none"; 
	document.getElementById( "id_div_p_text").style.display = "block"; 
	document.getElementById( pos_id         ).scrollIntoView();	
}

//======================================================	
	
function closeThePage() {
	// function called by HTML 
	//the actual message depends on the browser, that one  here below is just a memo to you    
  return "do you really want to close? You will lose any unsaved changes";
}
//====================

function estimate_needed_storage() {
	// we don't know the exact values before reading array buffer 
	var x_sample_rate     = 48500 ; // samples per second 
	var x_bytes_x_sample = 4; 
	var x_number_channels = 2     ; // stereo 
	var tot_stor = vid_durationTime * x_sample_rate * x_bytes_x_sample * x_number_channels;
	
	var other_stor = 10 * 1024 * 1024; 
	
	tot_stor += other_stor;
	
	tot_stor = 1.10 * tot_stor;    // + 10% 
	
	
	var stor_mb = parseInt( tot_stor / (1024 * 1024))  ; 
	stor_mb = 100 * parseInt( stor_mb/100);   // round to the hundreds
	
	//c onsole.log("storage=" + tot_stor +  "   = " + stor_mb + "mb"); 
	return stor_mb; 
}

//---------------------
function onclick_confirm_two() {  	
	// function called by HTML 
	
	//console.log("onclick_confirm_two() sw_file_text_ready=" + sw_file_text_ready + " sw_file_video_ready=" + sw_file_video_ready);  
		
	//fun_after_drop_uno();
	
	if (sw_file_video_ready) {
		video_setting2("1 fun_after_drop_uno()" );
	} else {
		missing_file_msg(2); 
	}
	
	onclick_split_into_rows(1);
	
} // end of onclick_confirm_two()

//-----------------------------
function postLoad() {
	console.log("postLoad()")
	
	if ( vid.videoWidth == 0) {
		video_audio_type = "audio";
	} else {
		video_audio_type = "video";
	}
	
	sw_file_video_ready = true; 
	
	//c onsole.log("This is a " + video_audio_type); 
  
	
	
	vid_durationTime =  vid.duration;	
	
}


//----------------------------------


ele_InputVideo.onchange = function(event) {
    event_target_file = event.target.files[0];
	
	var file1 = ele_InputVideo.files[0];
	var typeFile =  file1.type; 	
	video_src_filename = file1.name;
			console.log("video/audio file src=" + video_src_filename) ;
	console.log("Input file video/audio Type: " + typeFile);
	if (( typeFile.indexOf("audio") < 0) && ( typeFile.indexOf("video") < 0)  ) {
		document.getElementById("id_msg1").innerHTML = "<b>" + document.getElementById("m305").innerHTML + "</b>" + "<hr><br>"; // not video/audio file
        document.getElementById("id_msg1").style.color = "red";
		return;  
	}
	
	if (typeFile.indexOf("audio") >= 0) {
		document.getElementById("id_myVideo").style.height = "3em"; 
	} 

	let file = event_target_file;
	let blobURL = URL.createObjectURL(file);
	vid.src = blobURL;
	
	vid.onloadedmetadata = postLoad; 
	
};

//-----------------------------



function custom_message_change( txt1 ) {
	// this function is called by  replaceMsg() in 'MESSAGE_manager.jstxt' 	
	var notEditableInput = '<input class="notEditableInput" type="range" max="1" value="0.5" style="width:2em;">'; 	
	//var txt063 = getMessageId("m063"); 	
	var stop_continue  = document.getElementById("m063").outerHTML.replace('style="',  'style="font-size:0.8em;') ; 
	var change_speed   = document.getElementById("id_rangespeed_gen1").outerHTML; 
	var change_speed_t = document.getElementById("m054").outerHTML;
	

	
	var txt2 = txt1;
	if (txt2.indexOf("[") < 0) { return txt2;}
	txt2 = txt2.
		replaceAll('[ul1]',                 '<ul>')    .replaceAll('[ul2]',    '</ul>').
		replaceAll('[li1]',                 '<li>')    .replaceAll('[li2]',    '</li>').    
		replaceAll('[small1]',              '<small>') .replaceAll('[small2]', '</small>').  
		replaceAll('[notEditableInput]'  ,  notEditableInput).	
		replaceAll('[speakinghead_symb]',   speakinghead_symb). 	
		replaceAll('[magnifyingGlass_symb]',magnifyingGlass_symb).
		replaceAll('[change_speed_t]',      "<small>" + change_speed_t + "</small>").
		replaceAll('[change_speed]',        "<small>" + change_speed   + "</small>").
		replaceAll('[cutCursor]',           cutCursor).
		replaceAll('[stop_continue]',       "<small>" + stop_continue  + "</small>");  
		
	return txt2; 
	
} // end of custom_message_change()
//------------------------------------
//=============================================
// end of script file

XSRC2="SRT_v2_from_TEXT_1.jstxt";   // FINE


//=========================================================================
                        







var vid_durationTime = 0;
var isPlaying = false;

var sw_wordPlayLoop = false;

var play_videoFC_cut_time = 0; 
var play_videoFC_from = 0;
var play_videoFC_to = 0;
var plusIncr  = 2;
var minusIncr = plusIncr;


var ele_loopCursor    = document.getElementById("id_loopCursor");
var ele_millCharRule  = document.getElementById("id_millCharRule");
var ele_millCharRule2 = document.getElementById("id_millCharRule2");
var millCharRule_msg  = ""; 
var ele_resetValue    = document.getElementById("id_b_resetVal");
var ele_newValue      = document.getElementById("id_b_confeVal");
var ele_speed_loop    = document.getElementById("id_rangespeed_loop3");
// --------------
let ele_cut_point         = document.getElementById("id_cut_point"   );   
let ele_cut_point_HHMMSS  = document.getElementById("id_cut_point_HHMMSS"   ); 
//let videoTimePAUSE = 0; 
var video_startTime = 0;




var video_audio_type = ""; 

var video_src_filename = ""; 
var sw_wordPlayLoop = false; 
let localDec = (0.123).toLocaleString().substring(1,2); 
//-------------------------------

//------------------------------------------

function playLeft() {
	// function  called by HTML 
	
    vid.playbackRate = parseFloat( ele_speed_loop.value ); 

	//console.log("playLeft playbackRate=" + vid.playbackRate); 
	
    playFromToCut3( play_videoFC_from,     play_videoFC_cut_time, false);  // loop = false
}
//---------------------------
function playRight() {
	// function  called by HTML  
    vid.playbackRate = parseFloat( ele_speed_loop.value ); 
                                                             
    playFromToCut3( play_videoFC_cut_time, play_videoFC_to,      false);  // loop = false
}

//--------------------------------------------------------

function playFromToCut3(from1, to1, sw00_loop) {

    
    sw_wordPlayLoop = sw00_loop;  //  true;
	
	video_startTime = from1;
    videoTimePAUSE =  to1; 	
	
	
	vid.currentTime = from1;
    playVideo();
}

//----------------------------------

function oninput_getInpValueLR(distVal) {	
			 
	 var this_left  = ele_inpRngFrom ;
	 var this_right = ele_inpRngTo ;
	
	 minusIncr = parseFloat(this_left.value);  
	 plusIncr  = parseFloat(this_right.value); 

	 
	 play_videoFC_from = play_videoFC_cut_time - minusIncr ;  
	 play_videoFC_to   = play_videoFC_cut_time + plusIncr;  
	
	 ele_loopCursor.min   = play_videoFC_from.toFixed(3);
     ele_loopCursor.value = play_videoFC_cut_time.toFixed(3);
	 ele_loopCursor.max   = play_videoFC_to.toFixed(3);
	 	 
	var slide_secs = play_videoFC_to - play_videoFC_from; 
	
	var numSlideChar = Math.round(1000 * slide_secs / milliseconds_per_char); 
	var new_slide_millisecs = numSlideChar * milliseconds_per_char; 
	var diff_slide_millisecs = 1000 *slide_secs -  new_slide_millisecs; 
	
	/**
	<div id="id_millCharRule" class="ticks w100	padmar0	border1 ">
                  <span class="o_txt">|</span>
                  <span class="o_txt">|</span>
                  <span class="o_txt">|</span>     
	</div> 				
	**/
	
	// roughly draw  one tick each spoken character 
	var newruler =""; 
	for(var r=0; r <= numSlideChar; r++) {
		newruler += '<span class="o_txt">|</span>\n' ; 
	} 
	ele_millCharRule.innerHTML =  newruler; 
	if (millCharRule_msg == "") {millCharRule_msg = document.getElementById("m333").innerHTML;} 
	ele_millCharRule2.innerHTML = millCharRule_msg.replace("§milliseconds_per_char§", milliseconds_per_char) ; 
	
} // end of oninput_getInpValueLR()

//-----------------------------------		
// 
function playVideo() {
	// this function start the playback, after this  vid.ontimeupdate function is executed many times till the pause ( every fraction of second)       
	
    if (vid.paused && !isPlaying) {		
		if (ele_slider_separ_time.style.display == "block") {
			vid.playbackRate = parseFloat( document.getElementById("id_rangespeed_loop3").value ); // play loop / play left / play right
		} else {
			vid.playbackRate = parseFloat( document.getElementById("id_rangespeed_gen1").value ); // normal play run 
		}	
		
		vid.play();
		
    } else {
        //c onsole.log("play No OK: vid.paused=" + vid.paused + "   isPlaying=" + isPlaying);
    }
} // end of playVideo()

//---------------------------------
 
function pauseVideo() {
    if (!vid.paused && isPlaying) {
		//c onsole.log("pauseVideo() currentTime=" + vid.currentTime); 
        vid.pause();
    } else {
        //c onsole.log("PAUSE  NO OK: vid.paused=" + vid.paused + "   isPlaying=" + isPlaying + " currentTime=" + vid.currentTime );
    }
} // end of pauseVideo()

//----------------------------

function onclick_rLoopStop(this1) {
	// function called by html 
	//console.log("onclick_rLoopStop(this1) speed=" + ele_speed_loop); 
	
	//c hangeVideoSpeed_loop3( ele_speed_loop );

	if (this1.checked == false) {
		return; 
	}
	if (this1.value == "play") {
		sw_wordPlayLoop = true;		
		playFromToCut3( play_videoFC_from, play_videoFC_to, true);  // loop = true
	} else {
		sw_wordPlayLoop = false;
        stop_theWatch();
	}
	
} // end of onclick_pauseContinue()

//--------------------------------------

function updateVideoToFindCut() {	
	
	if (sw_wordPlayLoop == false) {	
		//c onsole.log("1 updateVideoToFindCut()  sw_wordPlayLoop=" + sw_wordPlayLoop + "  stop " + videoTimePAUSE + "  curr=" + vid.currentTime)
        if (vid.currentTime >=  videoTimePAUSE) {
			//c onsole.log("1.1 updateVideoToFindCut()  PAUSE" )
			vid.pause();        
		}
		return;  
    } 
	//-------------------------------	
	//c onsole.log("2 updateVideoToFindCut()  sw_wordPlayLoop=" + sw_wordPlayLoop + "  stop " + videoTimePAUSE + "  curr=" + vid.currentTime)
   
    if (vid.currentTime >=  videoTimePAUSE) {
        // when at end pause 2 seconds and then begin again 
		//c onsole.log("2.1 updateVideoToFindCut()  PAUSE" );
        vid.pause();
        vid.currentTime = play_videoFC_from;
		
		ele_loopCursor.value = vid.currentTime.toFixed(3);	

        setTimeout(function() {
            playVideo(); //  vid.play();
        }, 1000);
    }
	
	//c onsole.log("2.2 updateVideoToFindCut() ")
  
	ele_loopCursor.value = vid.currentTime.toFixed(3);
	
} // end of updateVideoToFindCut() 

//------------------------------------------------

//-------------------------------	
function stop_theWatch() {
	//console.log("STOP the watch")

	onchangeCutTimeValue3();
	
	pauseVideo();
	 
}

//-----------------------------

function onchangeCutTimeValue3() {
   // the slide has been moved the value of time is changed 
   // 		input: id=id_pointX   value
   // 		output: id=id_cut_point   + - nearby value (1 second) 
   //		output: id=cut_pointOK_HHMMSS   
   //  	onclick_playRight()
   //----------------------------
    //console.log("onchangeCutTimeValue3() ");
   
    sw_wordPlayLoop = false;
  
    let center_second = parseFloat( ele_loopCursor.value ) ;
    play_videoFC_cut_time = center_second;
     ele_cut_point.innerHTML =  play_videoFC_cut_time; 
	var hhmmss = new Date(play_videoFC_cut_time * 1000).toISOString().substr(11, 12);
	ele_cut_point_HHMMSS.innerHTML = hhmmss; 	
   
   
   ele_newValue.innerHTML = center_second.toFixed(3).replace(".",localDec); 
  
  
} // end of onchangeCutTimeValue3()

//--------------------------------
function modify_speed_according_to_timeInterval_to_play(deltaTime) {
   
   let short_time = 2.0;
   
   let normal_speed = 1.00;   
   let min_speed = 1.0;
   let part_speed = normal_speed - min_speed;
   
   let speed = normal_speed;
   
   if (deltaTime < 0) {
      return;
   }
   
   if (deltaTime < short_time) {
      speed = min_speed + part_speed * (deltaTime / short_time);
   }
   speed = parseFloat(speed.toFixed(3));
   
   //console.log(" modify_speed_according_t... delta=" + deltaTime + "   speed=" + speed);

    ele_speed_loop.value = speed;
	
    changeVideoSpeed_loop3( ele_speed_loop );
	
} // end of modify_speed_according_to_timeInterval_to_play

//--------------------------------
function changeVideoSpeed_loop3(this1) {

	//console.log("c hangeVideoSpeed_loop3()    speed=" + this1.value);
	var val1 =  parseFloat(this1.value);
	if (val1  < minimum_speed) { 
		val1 = minimum_speed; 
		this1.value = val1;
	}
	try{		
		vid.playbackRate = val1; 		
		document.getElementById("val3_speed0").style.display = "none";
	} catch {
		document.getElementById("val3_speed0").style.display = "block";		
		document.getElementById("val3_speed").innerHTML = val1; 
	}
}

//-------------------------------------

function onclick_separ_cancel() { 
	// function called by html 
	vid.playbackRate = parseFloat( document.getElementById("id_rangespeed_gen1").value ); // normal video speed 
		
	ele_slider_separ_time.style.display = "none";
	resetAndGoBack(); // srt
	
} 

//---------------------------------
function onclick_separ_confirm() {
	// function called by html 
	
	vid.playbackRate = parseFloat( document.getElementById("id_rangespeed_gen1").value ); 
		
	ele_slider_separ_time.style.display = "none";
	
	confirmCutTime() ;	
	
} // end of  onclick_separ_confirm()

//------------------------------------------------

function onclick_separ_reset() {

	//console.log("onclick_separ_reset() document.getElementById(input_timeslider).innerHTML = "+document.getElementById("input_timeslider").innerHTML ); 
	
	play_videoFC_cut_time = parseFloat( document.getElementById("input_timeslider").innerHTML ); 
		
	ele_resetValue.innerHTML = play_videoFC_cut_time.toFixed(3).replace(".",localDec); 
	ele_newValue.innerHTML   = play_videoFC_cut_time.toFixed(3).replace(".",localDec); 
	
	play_videoFC_from   =  play_videoFC_cut_time - minusIncr; 
	play_videoFC_to     =  play_videoFC_cut_time + plusIncr ; 
 
   ele_loopCursor.min   = play_videoFC_from.toFixed(3);
   ele_loopCursor.value = play_videoFC_cut_time.toFixed(3);
   ele_loopCursor.max   = play_videoFC_to.toFixed(3);
   
    
	//------------------------
	ele_cut_point.innerHTML =  play_videoFC_cut_time.toFixed(3).replace(".",localDec);  
	var hhmmss = new Date(play_videoFC_cut_time * 1000).toISOString().substr(11, 12);
	ele_cut_point_HHMMSS.innerHTML = hhmmss.replace(".",localDec);  	
	
	oninput_getInpValueLR('reset'); 
									
 }  // end of onclick_separ_reset()
 
//------------------------------------

function onclick_centerTheCursor() {

	// function called by html
	let center_second = parseFloat( ele_loopCursor.value) ;
	
	play_videoFC_cut_time = center_second;
	
	play_videoFC_from = center_second - minusIncr;
	play_videoFC_to   = center_second + plusIncr;
	
	 ele_loopCursor.min   = play_videoFC_from.toFixed(3);
     ele_loopCursor.value = play_videoFC_cut_time.toFixed(3);
	 ele_loopCursor.max   = play_videoFC_to.toFixed(3);
	 
	oninput_getInpValueLR(); //   distVal );
	
} // end of onclick_centerTheCursor()
 
//-------------------------------------------------------
function onclick_hideShowSlider2(ele_caller, typesrt="", srt_num_id="", srt_time_to_secs="", srt_time_to_hhmmss="") {
			
	if (ele_slider_separ_time.style.display == "block") {
		ele_slider_separ_time.style.display = "none"; 
		return;
	}
	
	fun_getMsecOverChar_Ruler( ele_caller ); // calculate milliseconds_per_char

	ele_slider_separ_time.style.display = "block";
	ele_div20_2.style.display = "none";
	
	ele_slider_separ_time.scrollIntoView();
	
	play_videoFC_cut_time = srt_time_to_secs;
	
	//console.log("onclick_hideShowSlider2() play_videoFC_cut_time=" + play_videoFC_cut_time ); 	
	
	document.getElementById("id_b_resetVal").innerHTML = srt_time_to_secs;
	document.getElementById("id_b_confeVal").innerHTML = srt_time_to_secs;
	
	var word_pre = ""; var word_next = "";
	var num_id = parseInt( srt_num_id ); 
	var v1, ww1;
	var maxlenCH = 50; 
	for(v1=num_id - 10; v1<num_id; v1++) {     	
		ww1 = document.getElementById("w" + v1 );
		if (ww1) { word_pre += " " + ww1.innerHTML; }
	}
	for(v1=num_id; v1<=num_id+10; v1++) {     	
		ww1 = document.getElementById("w" + v1 );
		if (ww1) { word_next += " " + ww1.innerHTML; }
	}    
	word_next = word_next.substring(0,maxlenCH); 
	if (word_pre.length > maxlenCH) {
		word_pre = word_pre.substring( word_pre.length-maxlenCH ) ; 
	}  
	
    document.getElementById("idword_left").innerHTML  = word_pre;
    document.getElementById("idword_right").innerHTML = word_next;

	document.getElementById("id_caller_num_id").innerHTML = num_id;  

    document.getElementById("input_timeslider").innerHTML = play_videoFC_cut_time; 
	
	/**
	console.log("onclick_hideShowSlider2() document.getElementById('input_timeslider').innerHTML = " +
		document.getElementById("input_timeslider").innerHTML);  	
	
	//var wordsPerSecond = (num_id / play_videoFC_cut_time).toFixed(1); 
	//console.log( wordsPerSecond + " words per second  (" + play_videoFC_cut_time + " seconds, " + num_id + " words)" )  ;   	
	//document.getElementById("id_wordsXsecs").innerHTML = wordsPerSecond + " words/second";  
	**/	
	
	onclick_separ_reset() ;
	
	

} // end of onclick_hideShowSlider2()
	
//------------	

function updateVal_L() {	
	rangeVal = parseFloat(ele_inpRngFrom.value);
	var showVal = parseFloat((rangeVal).toFixed(1)) ;	
	document.getElementById("rangeVal_show_L").innerHTML =showVal; 	
	minusIncr = showVal; 
	onclick_separ_reset(); 	
}

//------------	

function updateVal_R() {	
	var rangeValR = parseFloat(document.getElementById("id_inpRngTo").value );
	var showVal = parseFloat((rangeValR).toFixed(1)) ;
	document.getElementById("rangeVal_show_R").innerHTML = showVal; 	
	plusIncr = showVal; 
	//console.log("updateVal_R() plusinCR =" + plusIncr	); 
	onclick_separ_reset(); 		
}

//--------------------------------------

function TOGLIonclick_getMsecOverChar( this1 ) {
	if (this1 == null) return; 
	
	var numW = this1.id.substring(2);
	if (numW <=1 ) return;  
	var list_c_row = document.getElementsByClassName("c_row");
	var id_r = 0;
	var num_row_next = 0, num_row_prev = 0, num_row_this = 0;
	var nowL = 0
	num_row_next = numW;
	
	var atLeast_w = 10; 
	
	for (var l=0; l< list_c_row.length; l++) {
		id_r = parseInt(list_c_row[l].id.substring(3) ) ;   //  <button id="ra62" class="button c_row" 
		if (id_r > numW) {
			num_row_next = id_r;
			if (id_r > (num_row_this + atLeast_w)) break; 
		}		
		if (id_r <= numW) {
			num_row_this = id_r;
			nowL = l;  
		}
	}  	
	
	l = list_c_row.length-1;
	var max_next = parseInt(list_c_row[l].id.substring(3) ) ;  
	num_row_next = Math.min( num_row_next , max_next);  
	
	var prev5 = Math.max(0,num_row_this - atLeast_w) ; 
	num_row_prev = 1;
	for (l=nowL-1; l >=0; l--) {
		id_r = parseInt(list_c_row[l].id.substring(3) ) ;   //  <button id="ra62" class="button c_row" 
		if (id_r < prev5) { 
			num_row_prev = id_r;
			break; 
		}  
	}  	
	if (num_row_prev < 1)  num_row_prev = 1; 
	var eleP = document.getElementById("rt" + num_row_prev) ; 
	var eleT = document.getElementById("rt" + num_row_this) ; 
	var eleN = document.getElementById("rt" + num_row_next) ; 
	//if (eleP == null) return ;
	if (eleT == null) return ;
	if (eleN == null) return ;
	
	//var wordP = eleP.innerHTML ; 
	var wordT = eleT.innerHTML ; 
	var wordN = eleN.innerHTML ; 
	/**	
	console.log( "onclick_getMsecOverChar() " + 
			"\n\t" + "prev='row" + num_row_prev + "' " + wordP +			
			"\n\t" + "this='row" + num_row_this + "' " + wordT +
			"\n\t" + "next='row" + num_row_next + "' " + wordN );
	**/		
	var txtW1="",  txtW2 = "" ;		
	var ww1; 
	var numChar=0, numChar1=0, numChar2=0;
	var numP=0, numN=0;
	
	for( var w = num_row_prev; w < num_row_next+1; w++) {
		ww1 = document.getElementById("w" + w).innerHTML.replace("&nbsp;",""); 
		numChar = ww1.length; 
		
		if (w < num_row_this) { txtW1 += ww1; numChar1 += numChar; numP++; }
		else { txtW2 += ww1; numChar2 += numChar; numN++;}
	} 	
	//var msecs_P = 1000 * parseFloat(wordP.substring(15) ) ;  
	var msecs_T = 1000 * parseFloat(wordT.substring(15) ) ;  
	var msecs_N = 1000 * parseFloat(wordN.substring(15) ) ;  
	//var mdiff_P = msecs_T - msecs_P;
	var mdiff_N = msecs_N - msecs_T;
	/**
	console.log( wordP + " " + txtW1 + "\n" + wordT + " " + txtW2 + "\n" + wordN ); 
	console.log( wordP + " " + msecs_P + " chr=" + numChar1 + " diff1=" + mdiff_P + " w=" + numP + 
			" millsec/char=" + parseInt(mdiff_P / numChar1) +  
			" millsec/wo=" + parseInt(mdiff_P / numP) +  
		  "\n" + wordT + " " + msecs_T + " chr=" + numChar2 + " diff2=" + mdiff_N + " w=" + numN + 
			" millsec/char=" + parseInt(mdiff_N / numChar2) +  
			" millsec/wo=" + parseInt(mdiff_N / numN) +    
		  "\n" + wordN + " " + msecs_N );  
	**/	  
		 
	this1.innerHTML = parseInt(mdiff_N/numChar2);   	
			
} // end of TOGLIonclick_getMsecOverChar() 

//--------------------------------------------


function fun_getMsecOverChar_Ruler( this1  ) {

	if (this1 == null) return; 
	/*		
		<span id="row1" class="c_row">
			<br id="wbr1">
			<button id="rc1" class="button" onclick="onclick_precisionCut3(this)">🔎</button> 
			<input id="ri1" type="time" value="00:00:00.000" step="0.001">
			<span id="rt1" style="display:none">00:00:00.000 = 0</span>	
			<button id="ra1" class="button" onclick="onclick_playFrom(this)"><span>🗣</span></button>
		</span>
	*/
	var numW = this1.id.substring(2);
	if (numW <=1 ) return;  
	var list_c_row = document.getElementsByClassName("c_row");
	var id_r = 0;
	var num_row_next = 0, num_row_prev = 0, num_row_this = 0;
	var nowL = 0
	num_row_next = numW;
	
	var atLeast_w = 10; 
	
	for (var l=0; l< list_c_row.length; l++) {
		id_r = parseInt(list_c_row[l].id.substring(3) ) ;   //  <button id="rc62" ...
		if (id_r > numW) {
			num_row_next = id_r;
			if (id_r > (num_row_this + atLeast_w)) break; 
		}		
		if (id_r <= numW) {
			num_row_this = id_r;
			nowL = l;  
		}
	}  	
	
	l = list_c_row.length-1;
	var max_next = parseInt(list_c_row[l].id.substring(3) ) ;  
	num_row_next = Math.min( num_row_next , max_next);  
	
	var eleT = document.getElementById("rt" + num_row_this) ; 
	var eleN = document.getElementById("rt" + num_row_next) ; 
	
	if (eleT == null) return ;
	if (eleN == null) return ;
		
	var wordT = eleT.innerHTML ; 
	var wordN = eleN.innerHTML ; 
		
	var txtW2 = "" ;		
	var ww1; 
	var numChar2=0;
	
	for( var w = num_row_this; w < num_row_next+1; w++) {
		ww1 = document.getElementById("w" + w).innerHTML.replace("&nbsp;",""); 		
		numChar2 += ww1.length; 
	} 	
	
	var msecs_T = 1000 * parseFloat(wordT.substring(15) ) ;  
	var msecs_N = 1000 * parseFloat(wordN.substring(15) ) ;  
	var mdiff_N = msecs_N - msecs_T;
	
	milliseconds_per_char =  parseInt(mdiff_N/numChar2);  	
	
} // end of fun_getMsecOverChar_Ruler()

//------------------------------------
function onclick_can_breakLine(sw) {
	sw_line_can_be_broken = sw; 
	if (sw_line_can_be_broken) { 
		document.getElementById("lab_breakLineYes").style.fontWeight = "bold"; 
		document.getElementById("lab_breakLineNo" ).style.fontWeight = "normal"; 
	} else {		
		document.getElementById("lab_breakLineYes").style.fontWeight = "normal"; 
		document.getElementById("lab_breakLineNo" ).style.fontWeight = "bold"; 
	}	
} // end of onclick_can_breakLine

//------------------------
function head_button() {
	/**
	var startRow = '<span>' +
		'<button class="button" style="visibility:hidden;" disabled >' + magnifyingGlass_symb + '</button> ' +		
		'<span id="id_headtime"  style="font-weight:bold; font-size:1.2em;">' +		
		document.getElementById("m338").innerHTML +		
		'</span>' + 
		'</span> \n';  	
		
	return startRow;
	**/
	
	var startRow = '<div style="display:flex;">' +
		'<div >' + 
		'	<button class="button" style="visibility:hidden;" disabled >' + magnifyingGlass_symb + '</button> ' +		
		'</div>' + 
		'<div id="id_headtime"  style="font-weight:bold; font-size:1.2em;width:8em;text-align:center;">' +		
			document.getElementById("m338").innerHTML +		
		'</div>' + 
		'</div> \n';  	
		
	return startRow;
	
	
	
} // end of head_button() 
//=========================================================================