"use strict";
/*  
Subtitles_from_test: a tool to obtain srt subtitles from text      (former srt_to_text)
Antonio Cigna 2021/2022    
license MIT: you can share and modify the software, but you must include the license file 
*/ 
/* jshint strict: true */
/* jshint esversion: 6 */
/* jshint undef: true, unused: true */	 
//---------------------------------------------------------


var word_separator = ".,.;:?!_+-\[\]\(\)"  + "\t\n\r" ;  // word separator characters 

//----------------------------------------------------
// This function returns an XML string with all the messages from the application.
// xml doesn&apos;t accept &apos;<&apos; and &apos;&&apos; characters,
// but here you can use the following html markup: <br><b></b>
// and the following characters: & &apos; "
//-----
// If you want to edit a message you need to edit this file only (the texts in the html file are just for reminder).
// You can add any language using the English part as a base, as long as you change the first 2 lines and the last one appropriately:
//    <lang_xx> </lang_xx> where xx is the language identifier.
//    <id_language>xx</id_language>
//    <lang_name>Name of the language</lang_name> This line is never used in any script it is only used as a comment.
// The language used by the script is determined by the local language of the computer.
// The script gets the local language identifier, looks for the corresponding part in this file, if it can&apos;t find it, use the English one.
// for example: the identifier is fr, since the French part is missing (lang_fr) the English one (lang_en) is used.
//----
// The message id has the form <Bm...></Bm...>  
// where the first character can be one of A, B, C
//    A  message for  cbc_builder.html file    
//    B  message for  cbc_player.html file    
//    C  message for  cbc_Player_Words_ClipByClip.html file    
// The m... following A,B,C is the id  of the html element that will receive the message text (eg. id="m123")   
//
//----------------------------------------------------------------------------------------------------------------------------------------
// Questa funzione restituisce una stringa XML con tutti i messaggi dell&apos;applicazione. 
// xml non accetta i caratteri &apos;<&apos; e &apos;&&apos;,
// ma qui puoi usare i seguenti marcatori html: <br><b></b>
// e i seguenti caratteri: & &apos; "
//-----
// Se vuoi modificare un messaggio devi modificare soltanto questo file (quelli nel file html servono soltanto come promemoria)
// Puoi aggiungere qualsiasi lingua usando come base la parte inglese, a patto di modificare opportunamente le prime 3 righe e l&apos;ultima:
//    <lang_xx>   </lang_xx>   dove xx è l&apos;identificatore della lingua.
//    <id_language>xx</id_language>
//    <languageName>Nome della lingua usata</languageName>  Questa riga non  è mai usata in nessuno script serve soltanto come commento.
// La lingua utilizzata dallo script è determinata dalla lingua locale del computer.
// Lo script ottiene l&apos;identificativo xx della lingua locale, cerca la parte corrispondente in questo file, 
// se non la trova, utilizza quella in inglese.
// per esempio: l&apos;identificativo è fr, poiché manca la parte francese (lang_fr) viene utilizzata quella inglese (lang_en).
//----
// L&apos;id del messaggio ha la forma <Bm...></Bm...>
// dove il primo carattere può essere A, B, o C
// 		A messaggio per il file cbc_builder.html
//      B messaggio per il file cbc_player.html
//      C messaggio per il file cbc_Player_Words_ClipByClip.html
// La m... che segue A,B,C è l&apos;id dell&apos;elemento html che riceverà il testo del messaggio  (es. id="m123")
//               
//---------------------------------------------------------------------------------------------------------------------------------------

function get_messages() {

	var xml_text = `
<messages>
	<lang_en>		
		<id_language>en</id_language>	
		<languageName>English</languageName>
		<Sm001> Create subtitles for a video or audio using text transcription </Sm001>		
		<Sm004> The input text file (txt, srt or vtt) is missing or with errors, restart and specify the correct text file</Sm004>
		<Sm013> Video or audio </Sm013>
		<Sm023> Text transcription or srt subtitles </Sm023>
		<Sm054> Change the playback speed </Sm054>
		<Sm055> speed too low </Sm055>
		<Sm062> Confirm </Sm062>		
		<Sm063> Stop/Continue </Sm063>
		<Sm064> Change the playback speed </Sm064>
		<Sm065> speed too low </Sm065>
		<Sm069> Play left </Sm069>
		<Sm071> Play right </Sm071>
		<Sm072> Time </Sm072>
		<Sm073> end of Play left <br> and start of Play right </Sm073>			
		<Sm300> Download the srt file </Sm300>
		<Sm301> The audio or video file is missing </Sm301>
		<Sm302> the file type is incompatible </Sm302>
		<Sm303> missing text (.txt) or subtitles (.srt or .vtt) file </Sm303>
		<Sm304> What to do </Sm304>
		<Sm305> the file type is neither video nor audio </Sm305>
		<Sm306>
			The text is divided into lines taking into account only the end of sentence and the length, 
			but if the subdivision is not satisfactory,
			it is possible to join a line to the previous or to the following one or to break it in two.
			<br>Each line appears as two buttons, a time, a sequence of words.    
			<br>
			- The [speakinghead_symb] button is used to listen to the playback of the line.
			<br>
			- The [magnifyingGlass_symb] button is used in case of need to better specify 
				the separation time between two adjacent lines.
			<br>
			- The field of the separation time between two adjacent lines (hours:minutes:seconds,milliseconds
			<br> hh: mm:ss,mmm) is set automatically, but can also be changed manually. 
			At first the time value is false or missing, it needs to be changed to the real one as explained below.
			<br>
			- a sequence of words: each word is a button that, when pressed, interrupts the line (all other subsequent words go to the next).
			The first word button of a line is an empty word, it can be used to leave a gap of time before the actual words are spoken.
			<br><br>
			Read the first line and consider where it is best to break it.
			<br>
			Press the [speakinghead_symb] button and as soon as the word you want ends the line, has been spoken, click on this word.
			<br>
			Immediately after the click, the playback stops, the line ends with the last spoken word, and all subsequent words are displayed in the next line
			preceded by the break time (time of end of the previous line and start of the new one).
			<br> <br>
			Repeat the same operations for the following lines.
			<br> <br>
			A line can be joined with the next one by double clicking on the last word.

			<br> If it is difficult to stop playback at the right time, you can decrease the playback speed by moving the slider under <b>[change_speed_t]</b>,			
			<br>By clicking on the [magnifyingGlass_symb] button, a new page appears where it is possible to specify the moment of separation more precisely.		
			<br>
			<br>
			Playback can be stopped or resumed using the [stop_continue] button. <br> &nbsp;
		</Sm306>
		<Sm311> <b> Cancel </b> <br> and <br> go back </Sm311>
		<Sm312> <b> Confirm </b> <br> the new value </Sm312>
		<Sm313> <b> Restore </b> the original value<br> </Sm313>		
		<Sm314> centers the cursor </Sm314>		
		<Sm315> <b> Set the end time (hour:minutes:seconds,milliseconds) of a line by clicking on the [speakinghead_symb] button 
			and on the last word of the line </b>
			<br> (for more information, click the <b> What to do </b> button)
		</Sm315>
		<Sm316> creates an srt subtitle file using </Sm316>
		<Sm317> an existing text file or <br> srt or vtt subtitle file
			<small> (if you may want to correct the start and end times) </small>
		</Sm317>
		<Sm318> a video or audio file. </Sm318>
		<Sm319> seconds </Sm319>
		<Sm320> seconds </Sm320>
		<Sm321>
			This page is used to better define the precise moment <b> T </b> in which one line ends and the next one begins.
			<br>To check how good the separation time is,
			<br> press the <b> Play Left </b> button to listen to the moment immediately before the separation
			<br> and <b> Play Right </b> the one immediately after.
			<br>
			<br> The cursor [cutCursor] is used to modify the value of the time T,
			it can be moved by dragging it with the mouse
			or by using the <b> PLAY &infin; </b> and <b> STOP </b> buttons.
			<br> Press PLAY &infin; to listen to the piece endlessly and press STOP as soon as the word 
			that completes the line has been spoken.
			<br> To be more precise it is better to decrease the playback speed by moving the slider under 
			<b> Change the playback speed &infin; </b> header.
			<br>
			<br> The beginning and end of the piece to be played can be changed by moving the left slider 
			for the beginning and right slider for the end.
			<br>
			<br> When you are satisfied with the result, press the <b> Confirm </b> button.
		</Sm321>	
		<Sm322> stop playing, immediately after splitting lines </Sm322>
		<Sm323> Not </Sm323>
		<Sm324> Yes </Sm324>		
		<Sm325>start playback </Sm325>
		<Sm326>seconds ahead of separation time </Sm326>		
		<Sm327>end playback </Sm327>
		<Sm328>seconds after the separation time</Sm328>
		
	</lang_en>	
		
	<lang_it>
		<id_language>it</id_language>	
		<languageName>Italiano</languageName>	
		<Sm001>Crea i sottotitoli di un video o audio utilizzando la trascrizione del testo</Sm001>
		<Sm004>Il file di testo (txt, srt o vtt) in input è mancante o con errori, riparti e specifica il file di testo corretto</Sm004>
		<Sm013>Video o audio</Sm013>		
		<Sm023>Trascrizione del testo o sottotitoli srt</Sm023>
		<Sm054>Modifica la velocità di riproduzione</Sm054>
		<Sm055>velocità troppo bassa</Sm055>
		<Sm062>Conferma</Sm062>
		<Sm063>Interrompi/Continua</Sm063>
		<Sm064>Modifica la velocità di riproduzione</Sm064>
		<Sm065>velocità troppo bassa</Sm065>
		<Sm069>Play sinistra</Sm069>			
		<Sm071>Play destra</Sm071>
		<Sm072>Tempo</Sm072>
		<Sm073>di fine Play sinistra <br>e inizio di Play destra</Sm073>	
		<Sm300>Scarica il file srt</Sm300>
		<Sm301>Manca il file audio o video</Sm301>
		<Sm302>il tipo di file è incompatibile </Sm302>
		<Sm303>manca il file testo (.txt) o sottotitoli (.srt oppure .vtt)</Sm303>
		<Sm304>Cosa fare </Sm304>
		<Sm305>il tipo di file non è né video né audio</Sm305>
		<Sm306>
			Il testo è diviso in righe tenendo conto soltanto del punto di fine frase e della lunghezza, ma se la suddivisione non risulta soddisfacente, 
			è possibile unire una riga alla precedente o alla seguente oppure spezzarla in due.
			<br>Ogni riga è rappresentata da 2 pulsanti, un tempo di inizio e una lista di parole.    
			<br>- Il pulsante [speakinghead_symb] viene utilizzato per ascoltare la riproduzione della linea.
			<br>- Il pulsante [magnifyingGlass_symb] viene utilizzato in caso di necessità per specificare meglio il tempo di separazione tra due righe adiacenti.
			<br>- Il campo del tempo di separazione tra due righe adiacenti (ore: minuti: secondi hh: mm: ss, mmm) 
			è impostato automaticamente, ma può essere modificato anche manualmente. 
			All'inizio il valore del tempo è fasullo, deve essere modificato da quello reale come spiegato di seguito.
			<br>- una sequenza di parole: ogni parola è un pulsante che premuto interrompe la riga 
			(tutte le altre parole successive vanno nella successiva).
			La riga inizia con un pulsante senza parola, questo può essere usato per lasciare un intervallo di tempo   
			prima che le parole effettive vengano pronunciate.
			<br>
			<br>
			Leggi la prima riga e considera dove è meglio romperla.
			<br>Premi il pulsante [speakinghead_symb] e non appena la parola che vuoi che termini la riga è stata pronunciata, 
			fai clic su questa parola.
			<br>
			Subito dopo il clic, la riproduzione si interrompe, la riga termina con l'ultima parola pronunciata 
			e tutte le parole successive vengono visualizzate nella riga successiva
			preceduto dal tempo di interruzione (ora di fine della riga precedente e inizio di quella nuova).
			<br><br>
			Ripetere le stesse operazioni per le righe successive.
			<br><br>
			Una riga può essere congiunta con quella successiva facendo doppio clic sull'ultima parola.
			<br> Se è difficile interrompere la riproduzione al momento giusto, 
			si può diminuire la velocità di riproduzione spostando il cursore sotto  <b>[change_speed_t]</b>,
			<br> Cliccando sul pulsante [magnifyingGlass_symb] appare una nuova pagina dove è possibile specificare 
			il momento della separazione in modo più preciso.
			<br>
			<br>
			La riproduzione può essere interrotta o ripresa utilizzando il pulsante [stop_continue].<br>
		</Sm306>
		<Sm311><b>Annulla</b>   <br>e<br> torna indietro</Sm311>
		<Sm312><b>Conferma</b>  <br>nuovo valore</Sm312>
		<Sm313><b>Ripristina</b><br>originale</Sm313>		
		<Sm314>centra il cursore</Sm314>		
		<Sm315><b>Imposta il tempo di fine (ora:minuti:secondi,millisecondi) di una riga 
			facendo clic sul pulsante [speakinghead_symb] e sull'ultima 	parola	della riga </b>
			<br>(per ulteriori informazioni, fare clic sul pulsante <b>Cosa fare</b>)
		</Sm315>
		<Sm316>crea un file di sottotitoli srt utilizzando</Sm316>
		<Sm317>un file di testo <br>o un file di sottotitoli srt o vtt esistente
			<small>(es. per correggere il tempo di inizio e fine)</small>
		</Sm317>
		<Sm318>un video o un file audio.</Sm318>			
		<Sm319>secondi</Sm319>
		<Sm320>secondi</Sm320>
		<Sm321>			
			Questa pagina serve per definire meglio il momento preciso <b>T</b>  
			in cui termina un riga ed inizia la successiva.
			<br>
			Per verificare quanto sia buono il tempo di separazione, 
			<br>premi il tasto  <b>Play Sinistra</b> per ascoltare il momento immediatamente prima della separazione 
			<br>e  <b>Play Destra</b> quello immediatamente dopo.  
			<br>
			<br>Il cursore [cutCursor] serve a modificare  il valore del tempo T, 
			può essere spostato trascinandolo col mouse 
			oppure usano i tasti <b>PLAY &infin;</b> e <b>STOP</b>.  
			<br>Premi PLAY &infin; per ascoltare il pezzettino all'infinito e premi STOP 
			appena la parola che completa la riga è stata pronunciata.
			<br>Per essere più precisi conviene diminuire la velocità di riproduzione spostando il cursore 
			<b>Modifica la velocità di riproduzione &infin;</b>. 
			<br>
			<br>L'inizio e la fine del brano da riprodurre possono essere modificati 
			spostando il cursore di sinistra per l'inizio e di destra per la fine.  
			<br>
			<br>Quando si è soddisfatti del risultato premere il tasto <b>Conferma</b>. 
		</Sm321>
		<Sm322>interrompi la riproduzione subito dopo la divisione delle righe</Sm322>		
		<Sm323>No</Sm323>
		<Sm324>Sì</Sm324>
		<Sm325>inizia Play</Sm325> 
		<Sm326>secondi prima del tempo</Sm326>		
		<Sm327>termina Play</Sm327> 
		<Sm328>secondi dopo il tempo</Sm328>
	</lang_it>
</messages>	
`; // end of xml_text ( ` alt + 96 )

return xml_text;

} // end of get_messages()
//=======================================================================