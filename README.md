Srt Subtitles from Text
=======================

This application aims to quickly obtain a subtitle file from a text file that contains the transcription of a video or audio file.

The time required to create the file is a little more than the duration of the video or audio file being played.

Start the reproduction and follow the speech on the text, when you perceive a pause, for example at the end of the sentence, click on the last spoken word.  
This action inserts the elapsed time (in hours, minutes, seconds, milliseconds) since the start of the video or audio.  

For example if you click on the word _Corona_ in the following line

 

_Die Berliner Familie Burgdorff nach einem Jahr Corona: Alle sind zu Hause, alle beschäftigt am Computer - okay, fast alle. Leandro kämpft mit Mathematik._

the line is broken as following:

 

_Die Berliner Familie Burgdorff nach einem Jahr Corona:  
00:00:09,531 Alle sind zu Hause, alle beschäftigt am Computer - okay, fast alle._

  
and then if you click on the word _Computer_ , the original line becomes:

 

00:00:00,000 Die Berliner Familie Burgdorff nach einem Jahr Corona:  
00:00:09,531 Alle sind zu Hause, alle beschäftigt am Computer  
00:00:13,837 - okay, fast alle.

  

Note that if there are no corrections to be made it is not necessary to stop the playback which can continue without stopping until the end.  
  
At the end of the playback, pressing the **Download file** button, downloads a subtitle file of **srt** type.  
  
This is the output of the above example:

 

1  
00: 00: 00,000 -> 00: 00: 09,531  
Die Berliner Familie Burgdorff nach einem Jahr Corona:  
         
2  
00: 00: 09,531 -> 00: 00: 13,837  
Alle sind zu Hause, alle beschäftigt am Computer  
         
3  
00: 00: 13,837 -> 00: 00: 16,379  
\- okay, fast alle.  
 

If a word was clicked at the wrong time, you can correct:

 

stop playback,  
move the cursor of the video/audio control line back a few seconds,  
restart the playback and  
at the exact moment click again on the same word as before.

in this way the new time will replace the previous one.

  
If you clicked on the wrong word,

 

double click on it,  
the entered time will be deleted and the line following it will be moved to the previous position.  
For example:  
00:00:09,531 Alle sind zu Hause, alle beschäftigt am Computer  
00:00:13,837 - okay, fast alle.

  
If you double click on _Computer_ you get:

 

00:00:09,531 Alle sind zu Hause, alle beschäftigt am Computer - okay, fast alle.