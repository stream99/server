#!/bin/bash
for i in 0 1 2 3 4 5 6 7
do
  ffmpeg -i sintel_trailer-480p.mp4 -ss 00:00:$(($i * 2 + 10)) -t 00:00:02 sintel_trailer-480p_$i.mp4
done
