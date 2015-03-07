#!/bin/bash
for i in 0 1 2 3 4 5
do
  ffmpeg -i sintel_trailer-480p.mp4 -ss 00:00:$(($i * 5 + 10)) -t 00:00:05 sintel_trailer-480p_$i.mp4
done
