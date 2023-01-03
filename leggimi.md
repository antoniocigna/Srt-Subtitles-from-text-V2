Srt Subtitles from text
=======================
Sottotitoli srt da testo

Questa applicazione serve per ottenere rapidamente un file di sottotitoli da un file di testo che contiene la trascrizione di un file video o audio.

Il tempo necessario per creare il file è poco più della durata del file video o audio in riproduzione.

Avvia la riproduzione e segui col mouse le parole sul testo mentre vengono pronunciate, quando percepisci una pausa, ad esempio alla fine della frase, clicca sull'ultima parola pronunciata. Questa azione inserisce il tempo trascorso (in ore minuti, seconid millisecondi) dall'inizio del video o audio. 

Ad esempio se clicchi sulla parola _Corona_ nella riga seguente

 

_Die Berliner Familie Burgdorff nach einem Jahr Corona:Alle sind zu Hause, alle beschäftigt am Computer - okay, fast alle. Leandro kämpft mit Mathematik._

la linea viene spezzata così:

 

_00:00:00,000 Die Berliner Familie Burgdorff nach einem Jahr Corona:  
00:00:09,531 Alle sind zu Hause, alle beschäftigt am Computer - okay, fast alle._

  
e poi se clicchi sulla parola _Computer_ , la riga originale diventa:

 

00:00:00,000 Die Berliner Familie Burgdorff nach einem Jahr Corona:  
00:00:09,531 Alle sind zu Hause, alle beschäftigt am Computer  
00:00:13,837 - ok, fast alle.

  

Nota che se non ci sono correzioni da fare non è necessario fermare la riproduzione che può continuare senza fermarsi fino alla fine.  
  
Al termine della riproduzione, premendo il pulsante **Scarica file** , viene scaricato un file di sottotitoli di tipo **srt** .  
  
Questo è l'output dell'esempio precedente:

 

_1  
00:00:00.000 -> 00:00:09,531  
Die Berliner Familie Burgdorff nach einem Jahr Corona:  
         
2  
00:00:09,531 -> 00:00:13,837  
All sind zu Hause, alle beschäftigt am Computer  
         
3  
00:00:13,837 -> 00:00:16,379  
\- ok, fast alle._ 

Se una parola è stata cliccata nel momento sbagliato, puoi correggere:

 

ferma la riproduzione,  
sposta il cursore della linea di controllo video/audio indietro di alcuni secondi,  
riavvia la riproduzione e  
nell'esatto momento clicca di nuovo sulla stessa parola di prima.

in questo modo il nuovo tempo andrà a sostituire quello precedente.

  
Se hai cliccato sulla parola sbagliata,

 

fai doppio click su questa parola,  
Il tempo inserito verrà eliminato e la riga successiva verrà spostata nella posizione precedente.  
Ad esempio:  
00:00:09,531 Alle sind zu Hause, alle beschäftigt am Computer  
00:00:13,837 ok, fast alle.

  
Se fai doppio click su _Computer_ ottieni:

 

00:00:09,531 Alle sind zu Hause, alle beschäftigt am Computer - okay, fast alle.